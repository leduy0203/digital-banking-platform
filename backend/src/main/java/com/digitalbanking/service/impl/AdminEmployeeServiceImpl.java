package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.CreateEmployeeRequest;
import com.digitalbanking.domain.dto.request.EmployeeFilterRequest;
import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.entity.EmployeeEntity;
import com.digitalbanking.domain.entity.RoleEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.domain.enums.UserRole;
import com.digitalbanking.domain.enums.UserStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.EmployeeRepository;
import com.digitalbanking.repository.RoleRepository;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.repository.specification.EmployeeSpecification;
import com.digitalbanking.service.AdminEmployeeService;
import com.digitalbanking.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "ADMIN-EMPLOYEE-SERVICE")
public class AdminEmployeeServiceImpl implements AdminEmployeeService {

    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    @Transactional
    public EmployeeProfileResponse createEmployee(CreateEmployeeRequest request) {
        log.info("Admin creating new employee: email={}, role={}, department={}",
                request.getEmail(), request.getRole(), request.getDepartment());

        validateUniqueEmailAndPhone(request.getEmail(), request.getPhoneNumber());

        validateEmployeeRole(request.getRole());

        UserRole targetRole = request.getRole() != null ? request.getRole() : UserRole.ROLE_TELLER;

        RoleEntity role = roleRepository.findByRoleCode(targetRole)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        UserEntity user = UserEntity.builder()
                .email(request.getEmail().trim().toLowerCase())
                .phoneNumber(request.getPhoneNumber().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(role))
                .status(UserStatus.ACTIVE)
                .build();

        UserEntity savedUser = userRepository.save(user);
        log.info("Created user account ID: {} for employee", savedUser.getId());

        EmployeeEntity employee = EmployeeEntity.builder()
                .employeeCode(generateUniqueEmployeeCode())
                .fullName(request.getFullName().trim())
                .department(request.getDepartment())
                .hireDate(LocalDate.now())
                .user(savedUser)
                .build();

        EmployeeEntity savedEmployee = employeeRepository.saveAndFlush(employee);
        log.info("Saved employee profile ID: {} with code: {}", savedEmployee.getId(), savedEmployee.getEmployeeCode());

        return mapToEmployeeProfileResponse(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeProfileResponse> getEmployees(EmployeeFilterRequest filterRequest) {
        log.info("Fetching employees list with filter: {}", filterRequest);

        Specification<EmployeeEntity> spec = EmployeeSpecification.filter(filterRequest);

        Sort.Direction direction = "DESC".equalsIgnoreCase(filterRequest.getSortDir())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String sortBy = StringUtils.hasText(filterRequest.getSortBy())
                ? filterRequest.getSortBy()
                : "createdAt";

        Pageable pageable = PageRequest.of(
                filterRequest.getPage(),
                filterRequest.getSize(),
                Sort.by(direction, sortBy)
        );
        Page<EmployeeEntity> pageData = employeeRepository.findAll(spec, pageable);

        List<EmployeeProfileResponse> items = pageData.getContent().stream()
                .map(this::mapToEmployeeProfileResponse)
                .toList();

        return PageResponse.<EmployeeProfileResponse>builder()
                .items(items)
                .page(pageData.getNumber() + 1)
                .size(pageData.getSize())
                .totalElements(pageData.getTotalElements())
                .totalPages(pageData.getTotalPages())
                .isLast(pageData.isLast())
                .build();
    }

    @Override
    @Transactional
    public EmployeeProfileResponse updateEmployeeStatus(UUID id, UserStatus newStatus) {
        log.info("Updating status of employee ID: {} to {}", id, newStatus);

        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.info("Employee ID: {} not found", id);
                    return new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND);
                });

        UserEntity user = employee.getUser();

        user.setStatus(newStatus);
        userRepository.save(user);
        log.info("Updated user account ID: {} for employee", employee.getId());

        if (newStatus == UserStatus.BLOCKED) {
            tokenService.revokeAllByUserId(user.getId());
            log.info("Revoked all tokens for user ID: {} due to status change to BLOCKED", user.getId());
        }

        return mapToEmployeeProfileResponse(employee);
    }

    private void validateUniqueEmailAndPhone(String email, String phoneNumber) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Employee creation failed: Email {} already exists", email);
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            log.warn("Employee creation failed: Phone number {} already exists", phoneNumber);
            throw new BusinessException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }
    }

    private String generateUniqueEmployeeCode() {
        String code;
        do {
            int randomNum = 100000 + (int)(Math.random() * 900000);
            code = "EMP" + randomNum;
        } while (employeeRepository.existsByEmployeeCode(code));
        return code;
    }

    private void validateEmployeeRole(UserRole role) {
        if (role == null || role == UserRole.ROLE_CUSTOMER) {
            log.warn("Invalid employee role: {}", role);
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Employee role must be ROLE_TELLER or ROLE_ADMIN");
        }
    }

    private EmployeeProfileResponse mapToEmployeeProfileResponse(EmployeeEntity employee) {
        UserEntity user = employee.getUser();

        return EmployeeProfileResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .fullName(employee.getFullName())
                .department(employee.getDepartment())
                .hireDate(employee.getHireDate())
                .email(user != null ? user.getEmail() : null)
                .phoneNumber(user != null ? user.getPhoneNumber() : null)
                .status(user != null && user.getStatus() != null ? user.getStatus() : null)
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
