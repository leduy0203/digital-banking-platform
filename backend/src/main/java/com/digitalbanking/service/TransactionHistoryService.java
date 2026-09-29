package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.filter.TransactionHistoryFilterRequest;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;

public interface TransactionHistoryService {
    PageResponse<TransactionResponse> getMyTransactionHistory(TransactionHistoryFilterRequest filterRequest);

    TransactionResponse getTransactionDetail(String transactionCode);
}
