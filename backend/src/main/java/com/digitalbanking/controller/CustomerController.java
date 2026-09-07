package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.CustomerOnboardingRequest;
import com.digitalbanking.domain.dto.request.UpdateProfileRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.CustomerResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-CONTROLLER")
public class CustomerController {

    private final CustomerService customerService;
    private final SecurityUtils securityUtils;

    @PostMapping("/onboarding")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CustomerResponse> completeOnboarding(
            @Valid @RequestBody CustomerOnboardingRequest request
    ) {
        log.info("Received onboarding request for user: {}", request);

        UUID currentUserId = securityUtils.getCurrentUserId();

        CustomerResponse response = customerService.completeOnboarding(currentUserId, request);

        return ApiResponse.ok("Completed to update profile customer onboarding", response);
    }

    @GetMapping("/me")
    public ApiResponse<CustomerResponse> getMyProfile() {
        log.info("Received me request for user: {}", securityUtils.getCurrentUserId());

        UUID currentUserId = securityUtils.getCurrentUserId();

        CustomerResponse response = customerService.getMyProfile(currentUserId);

        return ApiResponse.ok("Fetch customer profile success", response);
    }


    @PutMapping("/me")
    public ApiResponse<CustomerResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        log.info("Received update request for user: {}", securityUtils.getCurrentUserId());

        UUID currentUserId = securityUtils.getCurrentUserId();

        CustomerResponse response = customerService.updateProfile(currentUserId, request);

        return ApiResponse.ok("Update customer profile success", response);
    }
}