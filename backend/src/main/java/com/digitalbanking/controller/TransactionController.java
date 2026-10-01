package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.filter.TransactionHistoryFilterRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransactionSummaryResponse;
import com.digitalbanking.service.TransactionHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Slf4j(topic = "TRANSACTION-CONTROLLER")
public class TransactionController {

    private final TransactionHistoryService transactionHistoryService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-history")
    public ApiResponse<PageResponse<TransactionSummaryResponse>> getMyHistory(
            @Valid @RequestBody TransactionHistoryFilterRequest filterRequest
    ) {
        log.info("REST request to query personal transaction history");

        PageResponse<TransactionSummaryResponse> response = transactionHistoryService
                .getMyTransactionHistory(filterRequest);

        return ApiResponse.ok(response);
    }

    @GetMapping("/{transactionCode}")
    public ApiResponse<TransactionResponse> getTransactionDetail(
            @PathVariable String transactionCode
    ) {
        log.info("REST request to get transaction detail: {}", transactionCode);

        TransactionResponse response = transactionHistoryService
                .getTransactionDetail(transactionCode);

        return ApiResponse.ok(response);
    }
}
