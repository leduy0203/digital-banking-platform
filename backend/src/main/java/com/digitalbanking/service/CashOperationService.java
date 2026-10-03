package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.DepositCashRequest;
import com.digitalbanking.domain.dto.request.WithdrawCashRequest;
import com.digitalbanking.domain.dto.response.CashTransactionResponse;
import jakarta.validation.Valid;

import java.util.UUID;

public interface CashOperationService {
    CashTransactionResponse depositCash(DepositCashRequest request, UUID employeeUserId);

    CashTransactionResponse withdrawCash(WithdrawCashRequest request, UUID employeeUserId);
}
