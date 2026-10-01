package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.filter.TransactionHistoryFilterRequest;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransactionSummaryResponse;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.TransactionEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.repository.TransactionRepository;
import com.digitalbanking.repository.specification.TransactionSpecification;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.TransactionHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "TRANSACTION-HISTORY-SERVICE")
public class TransactionHistoryServiceImpl implements TransactionHistoryService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final SecurityUtils securityUtils;

    @Override
    public PageResponse<TransactionSummaryResponse> getMyTransactionHistory(
            TransactionHistoryFilterRequest filterRequest
    ) {
        log.info("Fetching transaction history for current customer with filter: {}", filterRequest);

        CustomerEntity currentCustomer = getCurrentCustomer();

        Specification<TransactionEntity> spec = TransactionSpecification.filterHistory(
                currentCustomer.getId(),
                filterRequest
        );

        Page<TransactionEntity> page = transactionRepository.findAll(
                spec,
                filterRequest.toPageable("createdAt")
        );

        Page<TransactionSummaryResponse> summaryPage = page
                .map(txn -> mapToSummary(txn, currentCustomer.getId()));

        return PageResponse.from(summaryPage);
    }

    @Override
    public TransactionResponse getTransactionDetail(String transactionCode) {
        log.info("Fetching transaction detail for transaction code: {}", transactionCode);

        UserEntity currentUser = securityUtils.getCurrentUser();

        TransactionEntity txn = transactionRepository.findByTransactionCode(transactionCode)
                .orElseThrow(() -> new BusinessException(ErrorCode.TRANSACTION_FAILED));

        if (!isOwner(txn, currentUser.getId())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        return mapToDetail(txn);
    }


    private TransactionSummaryResponse mapToSummary(TransactionEntity txn, UUID customerId) {
        boolean isOutgoing = txn.getSourceAccount() != null
                && txn.getSourceAccount().getCustomer() != null
                && txn.getSourceAccount().getCustomer().getId().equals(customerId);

        String counterpartAcc = isOutgoing
                ? (txn.getTargetAccount() != null ? txn.getTargetAccount().getAccountNumber() : txn.getTargetAccountNumber())
                : (txn.getSourceAccount() != null ? txn.getSourceAccount().getAccountNumber() : null);

        String counterpartName = isOutgoing
                ? (txn.getTargetAccount() != null && txn.getTargetAccount().getCustomer() != null
                ? txn.getTargetAccount().getCustomer().getFullName() : txn.getTargetAccountName())
                : (txn.getSourceAccount() != null && txn.getSourceAccount().getCustomer() != null
                ? txn.getSourceAccount().getCustomer().getFullName() : "Cash deposit");

        return TransactionSummaryResponse.builder()
                .id(txn.getId())
                .transactionCode(txn.getTransactionCode())
                .amount(txn.getAmount())
                .direction(isOutgoing ? "OUT" : "IN")
                .counterpartAccountNumber(counterpartAcc)
                .counterpartName(counterpartName)
                .description(txn.getDescription())
                .transactionType(txn.getTransactionType())
                .status(txn.getStatus())
                .createdAt(txn.getCreatedAt())
                .build();
    }

    private TransactionResponse mapToDetail(TransactionEntity txn) {
        String sourceAccNum = txn.getSourceAccount() != null ? txn.getSourceAccount().getAccountNumber() : null;

        String sourceAccName = (txn.getSourceAccount() != null && txn.getSourceAccount().getCustomer() != null)
                ? txn.getSourceAccount().getCustomer().getFullName() : null;

        String targetAccNum = txn.getTargetAccount() != null
                ? txn.getTargetAccount().getAccountNumber()
                : txn.getTargetAccountNumber();

        String targetAccName = (txn.getTargetAccount() != null && txn.getTargetAccount().getCustomer() != null)
                ? txn.getTargetAccount().getCustomer().getFullName()
                : txn.getTargetAccountName();

        return TransactionResponse.builder()
                .id(txn.getId())
                .transactionCode(txn.getTransactionCode())
                .sourceAccountNumber(sourceAccNum)
                .sourceAccountName(sourceAccName)
                .targetAccountNumber(targetAccNum)
                .targetAccountName(targetAccName)
                .targetBankCode(txn.getTargetBankCode())
                .targetBankName(txn.getTargetBankName())
                .amount(txn.getAmount())
                .feeAmount(txn.getFeeAmount())
                .description(txn.getDescription())
                .transactionType(txn.getTransactionType())
                .status(txn.getStatus())
                .completedAt(txn.getCompletedAt())
                .createdAt(txn.getCreatedAt())
                .build();
    }

    private boolean isOwner(TransactionEntity txn, UUID userId) {
        return isAccountOwner(txn.getSourceAccount(), userId)
                || isAccountOwner(txn.getTargetAccount(), userId);
    }

    private boolean isAccountOwner(AccountEntity account, UUID userId) {
        return account != null
                && account.getCustomer() != null
                && account.getCustomer().getUser() != null
                && account.getCustomer().getUser().getId().equals(userId);
    }

    private CustomerEntity getCurrentCustomer() {
        UserEntity currentUser = securityUtils.getCurrentUser();
        return customerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));
    }
}
