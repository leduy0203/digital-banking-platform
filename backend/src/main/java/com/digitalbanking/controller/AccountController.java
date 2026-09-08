package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Slf4j(topic = "ACCOUNT-CONTROLLER")
public class AccountController {

    private final AccountService accountService;
    private final SecurityUtils securityUtils;

    @GetMapping("/my-accounts")
    public ApiResponse<List<AccountResponse>> getMyAccounts() {
        log.info("Received request to fetch my accounts list");

        UUID currentUserId = securityUtils.getCurrentUserId();

        List<AccountResponse> response = accountService.getMyAccounts(currentUserId);

        return ApiResponse.ok("Fetch my accounts successfully", response);
    }
}
