package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.ChangePinRequest;
import com.digitalbanking.domain.dto.request.SetupPinRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.service.CustomerPinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customers/pin")
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-PIN-CONTROLLER")
public class CustomerPinController {

    private final CustomerPinService customerPinService;

    @PostMapping("/setup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> setupPin(@Valid @RequestBody SetupPinRequest request) {
        log.info("REST request to set up transaction PIN for current customer");

        customerPinService.setupPin(request);
        return ApiResponse.ok("Transaction PIN set up successfully", null);
    }

    @PutMapping("/change")
    public ApiResponse<Void> changePin(@Valid @RequestBody ChangePinRequest request) {
        log.info("REST request to change transaction PIN for current customer");

        customerPinService.changePin(request);
        return ApiResponse.ok("Transaction PIN changed successfully", null);
    }
}
