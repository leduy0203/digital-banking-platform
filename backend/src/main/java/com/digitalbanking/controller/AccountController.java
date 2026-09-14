package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.response.AccountLookupResponse;
import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{accountNumber}/balance")
    public ApiResponse<AccountResponse> getAccountBalance(@PathVariable String accountNumber) {
        log.info("Received request to fetch account balance for account number: {}", accountNumber);

        UUID currentUserId = securityUtils.getCurrentUserId();

        AccountResponse response = accountService.getAccountBalance(accountNumber, currentUserId);

        return ApiResponse.ok("Fetch account balance successfully", response);
    }

    @GetMapping("/lookup")
    public ApiResponse<AccountLookupResponse> lookupAccount(@RequestParam String accountNumber) {
        log.info("Received request to lookup account for account number: {}", accountNumber);

        AccountLookupResponse response = accountService.lookupAccount(accountNumber);

        return ApiResponse.ok("Lookup account successfully", response);
    }
}
