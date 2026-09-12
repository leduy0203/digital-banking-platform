package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;
import com.digitalbanking.domain.entity.EmployeeEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.EmployeeRepository;
import com.digitalbanking.service.EmployeeProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-PROFILE-SERVICE")
public class EmployeeProfileServiceImpl implements EmployeeProfileService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public EmployeeProfileResponse getMyProfile(UUID userId) {
        log.info("Fetching profile for employee with userId: {}", userId);

        EmployeeEntity employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Employee profile not found for userId: {}", userId);
                    return new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND);
                });

        return EmployeeProfileResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .fullName(employee.getFullName())
                .department(employee.getDepartment())
                .hireDate(employee.getHireDate())
                .email(employee.getUser() != null ? employee.getUser().getEmail() : null)
                .phoneNumber(employee.getUser() != null ? employee.getUser().getPhoneNumber() : null)
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}