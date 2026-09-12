package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.CreateEmployeeRequest;
import com.digitalbanking.domain.dto.request.EmployeeFilterRequest;
import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.enums.UserStatus;

import java.util.UUID;

public interface AdminEmployeeService {

    EmployeeProfileResponse createEmployee(CreateEmployeeRequest request);

    PageResponse<EmployeeProfileResponse> getEmployees(EmployeeFilterRequest filterRequest);

    EmployeeProfileResponse updateEmployeeStatus(UUID id, UserStatus status);
}
