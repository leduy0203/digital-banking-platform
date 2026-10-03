package com.digitalbanking.controller.employee;

import com.digitalbanking.domain.dto.request.DepositCashRequest;
import com.digitalbanking.domain.dto.request.WithdrawCashRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.CashTransactionResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CashOperationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/api/v1/employee/transactions")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-TRANSACTION-CONTROLLER")
public class EmployeeTransactionController {

    private final CashOperationService cashOperationService;
    private final SecurityUtils securityUtils;

    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    @PostMapping("/deposit")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CashTransactionResponse> depositCash(
            @Valid @RequestBody DepositCashRequest request
    ) {
        UUID employeeUserId = securityUtils.getCurrentUserId();

        log.info("Employee {} requested cash deposit to account: {}", employeeUserId,
                request.getAccountNumber()
        );

        CashTransactionResponse response = cashOperationService.depositCash(request, employeeUserId);

        return ApiResponse.ok(
                "Cash deposit to the account was successful",
                response
        );
    }

    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    @PostMapping("/withdraw")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CashTransactionResponse> withdrawCash(
            @Valid @RequestBody WithdrawCashRequest request
    ) {
        UUID employeeUserId = securityUtils.getCurrentUserId();

        log.info("Employee {} withdrew cash from account {}", employeeUserId, request.getAccountNumber());

        CashTransactionResponse response = cashOperationService.withdrawCash(request, employeeUserId);

        return ApiResponse.ok("Cash withdrawal at the counter was successful", response);
    }
}

