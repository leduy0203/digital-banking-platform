package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.filter.CustomerFilterRequest;
import com.digitalbanking.domain.dto.response.CustomerAccountSummaryDto;
import com.digitalbanking.domain.dto.response.CustomerDetailResponse;
import com.digitalbanking.domain.dto.response.CustomerResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.KycDocumentEntity;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import com.digitalbanking.domain.enums.KycStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.AccountRepository;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.repository.KycDocumentRepository;
import com.digitalbanking.repository.specification.CustomerSpecification;
import com.digitalbanking.service.EmployeeCustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-CUSTOMER-SERVICE")
public class EmployeeCustomerServiceImpl implements EmployeeCustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final KycDocumentRepository kycDocumentRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerResponse> getCustomers(CustomerFilterRequest filterRequest) {
        log.info("Employee fetching customer list with filter: {}", filterRequest);

        Specification<CustomerEntity> spec = CustomerSpecification.filter(filterRequest);
        Pageable pageable = filterRequest.toPageable("createdAt");

        Page<CustomerEntity> pageResult = customerRepository.findAll(spec, pageable);
        Page<CustomerResponse> responsePage = pageResult.map(this::mapToCustomerResponse);

        return PageResponse.from(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDetailResponse getCustomerByCif(String cif) {
        log.info("Employee fetching customer detail for CIF: {}", cif);

        CustomerEntity customer = customerRepository.findByCustomerCode(cif)
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));

        Optional<KycDocumentEntity> latestKyc = kycDocumentRepository.findTopByCustomerIdOrderBySubmittedAtDesc(customer.getId());
        KycStatus kycStatus = latestKyc.map(KycDocumentEntity::getStatus).orElse(KycStatus.NOT_SUBMITTED);

        List<AccountEntity> accounts = accountRepository.findByCustomerId(customer.getId());

        BigDecimal totalBalance = accounts.stream()
                .map(acc -> acc.getBalance() != null ? acc.getBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CustomerAccountSummaryDto> accountlist = accounts.stream()
                .map(this::mapToAccountSummaryDto)
                .collect(Collectors.toList());

        return CustomerDetailResponse.builder()
                .customerId(customer.getId())
                .userId(customer.getUser() != null ? customer.getUser().getId() : null)
                .customerCode(customer.getCustomerCode())
                .fullName(customer.getFullName())
                .nationalId(customer.getNationalId())
                .dateOfBirth(customer.getDateOfBirth())
                .address(customer.getAddress())
                .avatarUrl(customer.getAvatarUrl())
                .email(customer.getUser() != null ? customer.getUser().getEmail() : null)
                .phoneNumber(customer.getUser() != null ? customer.getUser().getPhoneNumber() : null)
                .userStatus(customer.getUser() != null ? customer.getUser().getStatus() : null)
                .kycStatus(kycStatus)
                .kycSubmittedAt(latestKyc.map(KycDocumentEntity::getSubmittedAt).orElse(null))
                .kycVerifiedAt(latestKyc.map(KycDocumentEntity::getVerifiedAt).orElse(null))
                .totalBalance(totalBalance)
                .totalAccounts(accounts.size())
                .accounts(accountlist)
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    private CustomerResponse mapToCustomerResponse(CustomerEntity customer) {
        KycStatus kycStatus = kycDocumentRepository.findTopByCustomerIdOrderBySubmittedAtDesc(customer.getId())
                .map(KycDocumentEntity::getStatus)
                .orElse(KycStatus.NOT_SUBMITTED);

        return CustomerResponse.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .fullName(customer.getFullName())
                .nationalId(customer.getNationalId())
                .phoneNumber(customer.getUser() != null ? customer.getUser().getPhoneNumber() : null)
                .email(customer.getUser() != null ? customer.getUser().getEmail() : null)
                .userStatus(customer.getUser() != null ? customer.getUser().getStatus() : null)
                .kycStatus(kycStatus)
                .createdAt(customer.getCreatedAt())
                .build();
    }

    private CustomerAccountSummaryDto mapToAccountSummaryDto(AccountEntity account) {
        return CustomerAccountSummaryDto.builder()
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .frozenBalance(account.getFrozenBalance())
                .availableBalance(account.getAvailableBalance() != null ? account.getAvailableBalance() : account.getBalance())
                .currency(account.getCurrency())
                .status(account.getStatus())
                .isDefault(account.getIsDefault())
                .openedAt(account.getOpenedAt())
                .build();
    }
}
