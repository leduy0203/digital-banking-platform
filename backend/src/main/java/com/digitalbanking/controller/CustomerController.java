package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.CustomerResponseDto;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-CONTROLLER")
public class CustomerController {

    private final CustomerService customerService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    public ApiResponse<CustomerResponseDto> getMyProfile() {

        UUID currentUserId = securityUtils.getCurrentUserId();

        log.info("Fetching customer profile for user: {}", currentUserId);

        CustomerResponseDto response = customerService
                .getCustomerProfileByUserId(currentUserId);

        return ApiResponse.ok("Fetch customer profile successfully", response);
    }
}