package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.filter.TransactionHistoryFilterRequest;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransactionSummaryResponse;

public interface TransactionHistoryService {
    PageResponse<TransactionSummaryResponse> getMyTransactionHistory(
            TransactionHistoryFilterRequest filterRequest
    );

    TransactionResponse getTransactionDetail(String transactionCode);
}
