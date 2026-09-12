package com.digitalbanking.controller.admin;

import com.digitalbanking.domain.dto.request.CreateEmployeeRequest;
import com.digitalbanking.domain.dto.request.EmployeeFilterRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.enums.UserStatus;
import com.digitalbanking.service.AdminEmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/employees")
@RequiredArgsConstructor
@Slf4j(topic = "ADMIN-EMPLOYEE-CONTROLLER")
public class AdminEmployeeController {

    private final AdminEmployeeService adminEmployeeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EmployeeProfileResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request
    ) {
        log.info("Admin creating new employee with email: {}", request.getEmail());

        EmployeeProfileResponse response = adminEmployeeService.createEmployee(request);

        return ApiResponse.ok("Employee created successfully", response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<EmployeeProfileResponse>> getEmployees(
            @Valid EmployeeFilterRequest filterRequest
    ) {
        log.info("Admin fetching employees list with filter: {}", filterRequest);

        PageResponse<EmployeeProfileResponse> response = adminEmployeeService.getEmployees(filterRequest);

        return ApiResponse.ok("Employee list retrieved successfully", response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<EmployeeProfileResponse> updateEmployeeStatus(
            @PathVariable UUID id,
            @RequestParam UserStatus status
    ) {
        log.info("Admin updating status of employee ID: {} to {}", id, status);

        EmployeeProfileResponse response = adminEmployeeService.updateEmployeeStatus(id, status);

        return ApiResponse.ok("Employee status updated successfully", response);
    }
}
