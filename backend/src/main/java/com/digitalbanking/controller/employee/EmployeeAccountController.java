package com.digitalbanking.controller.employee;

import com.digitalbanking.domain.dto.request.OpenAccountRequest;
import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employee/accounts")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-ACCOUNT-CONTROLLER")
public class EmployeeAccountController {

    private final AccountService accountService;

    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    public ApiResponse<AccountResponse> openAccount(@Valid @RequestBody OpenAccountRequest request) {
        log.info("Open account request: {}", request);

        AccountResponse response = accountService.openAccount(request);

        return ApiResponse.ok("Account opened successfully" , response);
    }

    @PatchMapping("{accountNumber}/status")
    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    public ApiResponse<AccountResponse> updateAccountStatus(
            @PathVariable String accountNumber,
            @RequestParam AccountStatus status
    ) {
        log.info("Update account status for account number {} to {}", accountNumber, status);

        AccountResponse response = accountService.updateAccountStatus(accountNumber, status);

        return ApiResponse.ok("Account status updated successfully" , response);
    }
}
