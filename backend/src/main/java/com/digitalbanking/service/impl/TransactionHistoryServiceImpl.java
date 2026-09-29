package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.filter.TransactionHistoryFilterRequest;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.service.TransactionHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "TRANSACTION-HISTORY-SERVICE")
public class TransactionHistoryServiceImpl implements TransactionHistoryService {
    @Override
    public PageResponse<TransactionResponse> getMyTransactionHistory(TransactionHistoryFilterRequest filterRequest) {
        return null;
    }

    @Override
    public TransactionResponse getTransactionDetail(String transactionCode) {
        return null;
    }
}
