package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.KycFilterRequest;
import com.digitalbanking.domain.dto.request.RejectKycRequest;
import com.digitalbanking.domain.dto.response.KycDocumentResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.EmployeeEntity;
import com.digitalbanking.domain.entity.KycDocumentEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.domain.enums.KycStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.EmployeeRepository;
import com.digitalbanking.repository.KycDocumentRepository;
import com.digitalbanking.repository.specification.KycDocumentSpecification;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.EmailService;
import com.digitalbanking.service.EmployeeKycService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-KYC-SERVICE")
public class EmployeeKycServiceImpl implements EmployeeKycService {

    private final EmployeeRepository employeeRepository;
    private final KycDocumentRepository kycDocumentRepository;
    private final SecurityUtils securityUtils;
    private final EmailService emailService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<KycDocumentResponse> getPendingKycs(KycFilterRequest filterRequest) {
        log.info("Fetching pending KYC documents with filter: {}", filterRequest);

        Specification<KycDocumentEntity> spec = KycDocumentSpecification.filter(filterRequest);

        Sort.Direction direction = "DESC".equalsIgnoreCase(filterRequest.getSortDir())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String sortBy = StringUtils.hasText(filterRequest.getSortBy())
                ? filterRequest.getSortBy()
                : "submittedAt";

        Pageable pageable = PageRequest.of(
                filterRequest.getPage(),
                filterRequest.getSize(),
                Sort.by(direction, sortBy)
        );

        Page<KycDocumentEntity> kycPage = kycDocumentRepository.findAll(spec, pageable);

        List<KycDocumentResponse> content = kycPage.getContent().stream()
                .map(this::mapToKycDocumentResponse)
                .toList();

        return PageResponse.<KycDocumentResponse>builder()
                .items(content)
                .page(kycPage.getNumber() + 1)
                .size(kycPage.getSize())
                .totalElements(kycPage.getTotalElements())
                .totalPages(kycPage.getTotalPages())
                .isLast(kycPage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public KycDocumentResponse getKycDetail(UUID kycId) {
        log.info("Fetching KYC document details for ID: {}", kycId);

        KycDocumentEntity kycDocument = getKycDocumentOrThrow(kycId);

        return mapToKycDocumentResponse(kycDocument);
    }

    @Override
    @Transactional
    public KycDocumentResponse approveKyc(UUID kycId) {
        log.info("Approving KYC document: {}", kycId);

        KycDocumentEntity kycDocument = getKycDocumentOrThrow(kycId);
        validatePendingStatus(kycDocument);

        EmployeeEntity currentEmployee = getCurrentEmployee();

        kycDocument.setStatus(KycStatus.VERIFIED);
        kycDocument.setVerifiedAt(Instant.now());
        kycDocument.setVerifiedByEmployee(currentEmployee);
        kycDocument.setRejectionReason(null);

        KycDocumentEntity updatedKyc = kycDocumentRepository.save(kycDocument);
        log.info("KYC document {} approved successfully by employee {}", kycId, currentEmployee.getEmployeeCode());

        CustomerEntity customer = kycDocument.getCustomer();
        UserEntity user = customer != null ? customer.getUser() : null;

        if (user != null && StringUtils.hasText(user.getEmail())) {
            emailService.sendKycApprovedEmail(user.getEmail(), customer.getFullName());
        }

        return mapToKycDocumentResponse(updatedKyc);
    }

    @Override
    @Transactional
    public KycDocumentResponse rejectKyc(UUID kycId, RejectKycRequest request) {
        log.info("Rejecting KYC document: {} with reason: {}", kycId, request.getReason());

        KycDocumentEntity kycDocument = getKycDocumentOrThrow(kycId);
        validatePendingStatus(kycDocument);

        EmployeeEntity currentEmployee = getCurrentEmployee();

        kycDocument.setStatus(KycStatus.REJECTED);
        kycDocument.setVerifiedAt(Instant.now());
        kycDocument.setVerifiedByEmployee(currentEmployee);
        kycDocument.setRejectionReason(request.getReason().trim());

        KycDocumentEntity updatedKyc = kycDocumentRepository.save(kycDocument);
        log.info("KYC document {} rejected by employee {}", kycId, currentEmployee.getEmployeeCode());

        CustomerEntity customer = kycDocument.getCustomer();
        UserEntity user = customer != null ? customer.getUser() : null;

        if (user != null && StringUtils.hasText(user.getEmail())) {
            emailService.sendKycRejectedEmail(user.getEmail(), customer.getFullName(), request.getReason().trim());
        }

        return mapToKycDocumentResponse(updatedKyc);
    }

    private KycDocumentEntity getKycDocumentOrThrow(UUID kycId) {
        return kycDocumentRepository.findById(kycId)
                .orElseThrow(() -> {
                    log.error("KYC document not found with ID: {}", kycId);
                    return new BusinessException(ErrorCode.KYC_DOCUMENT_NOT_FOUND);
                });
    }

    private void validatePendingStatus(KycDocumentEntity kycDocument) {
        if (kycDocument.getStatus() != KycStatus.PENDING) {
            log.error("KYC document {} is not in PENDING status, current status: {}",
                    kycDocument.getId(), kycDocument.getStatus());
            throw new BusinessException(ErrorCode.KYC_DOCUMENT_NOT_PENDING);
        }
    }

    private EmployeeEntity getCurrentEmployee() {
        UUID currentUserId = securityUtils.getCurrentUserId();
        return employeeRepository.findByUserId(currentUserId)
                .orElseThrow(() -> {
                    log.error("Current logged-in user is not registered as an employee. User ID: {}", currentUserId);
                    return new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND);
                });
    }

    private KycDocumentResponse mapToKycDocumentResponse(KycDocumentEntity entity) {
        CustomerEntity customer = entity.getCustomer();
        UserEntity user = customer != null ? customer.getUser() : null;
        EmployeeEntity employee = entity.getVerifiedByEmployee();

        return KycDocumentResponse.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .frontIdCardUrl(entity.getFrontIdCardUrl())
                .backIdCardUrl(entity.getBackIdCardUrl())
                .selfiePhotoUrl(entity.getSelfiePhotoUrl())
                .rejectionReason(entity.getRejectionReason())
                .submittedAt(entity.getSubmittedAt())
                .verifiedAt(entity.getVerifiedAt())
                // Employee info
                .verifiedByEmployeeCode(employee != null ? employee.getEmployeeCode() : null)
                .verifiedByEmployeeName(employee != null ? employee.getFullName() : null)
                // Customer profile
                .customerId(customer != null ? customer.getId() : null)
                .customerCode(customer != null ? customer.getCustomerCode() : null)
                .fullName(customer != null ? customer.getFullName() : null)
                .nationalId(customer != null ? customer.getNationalId() : null)
                .dateOfBirth(customer != null ? customer.getDateOfBirth() : null)
                .address(customer != null ? customer.getAddress() : null)
                .email(user != null ? user.getEmail() : null)
                .phoneNumber(user != null ? user.getPhoneNumber() : null)
                .build();
    }
}
