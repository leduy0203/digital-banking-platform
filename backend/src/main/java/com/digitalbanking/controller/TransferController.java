package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.InternalTransferConfirmRequest;
import com.digitalbanking.domain.dto.request.InternalTransferInitiateRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransferInitiateResponse;
import com.digitalbanking.service.TransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
@Slf4j(topic = "TRANSFER-CONTROLLER")
public class TransferController {

    private final TransferService transferService;

    @PostMapping("/internal/initiate")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TransferInitiateResponse> initiateInternalTransfer(
            @Valid @RequestBody InternalTransferInitiateRequest request
    ) {
        log.info("REST request to initiate internal transfer from account: {}", request.getSourceAccountNumber());

        TransferInitiateResponse response = transferService.initiateInternalTransfer(request);

        return ApiResponse.ok(
                "Transfer initiated successfully. Please check your email for OTP.",
                response
        );
    }

    @PostMapping("/internal/confirm")
    public ApiResponse<TransactionResponse> confirmInternalTransfer(
            @Valid @RequestBody InternalTransferConfirmRequest request
    ) {
        log.info("REST request to confirm internal transfer: {}", request.getTransactionCode());

        TransactionResponse response = transferService.confirmInternalTransfer(request);

        return ApiResponse.ok("Transfer completed successfully", response);
    }
}
