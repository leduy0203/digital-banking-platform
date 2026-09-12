package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.DepartmentType;
import com.digitalbanking.domain.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeProfileResponse {

    private UUID id;
    private String employeeCode;
    private String fullName;
    private DepartmentType department;
    private LocalDate hireDate;
    private String email;
    private String phoneNumber;

    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
    private Instant createdAt;
    private Instant updatedAt;
}