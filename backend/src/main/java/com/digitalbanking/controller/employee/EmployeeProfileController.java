package com.digitalbanking.controller.employee;

import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.AdminEmployeeService;
import com.digitalbanking.service.EmployeeProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employee/profile")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-PROFILE-CONTROLLER")
public class EmployeeProfileController {

    private final SecurityUtils securityUtils;
    private final EmployeeProfileService employeeProfileService;

    @GetMapping("/me")
//    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    public ApiResponse<EmployeeProfileResponse> getMyProfile() {

        UUID currentUserId = securityUtils.getCurrentUserId();

        log.info("Fetching profile for employee user ID: {}", currentUserId);

        EmployeeProfileResponse response = employeeProfileService.getMyProfile(currentUserId);
        return ApiResponse.ok("Employee profile retrieved successfully", response);
    }
}
