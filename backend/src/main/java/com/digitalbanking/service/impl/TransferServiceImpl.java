package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.InternalTransferConfirmRequest;
import com.digitalbanking.domain.dto.request.InternalTransferInitiateRequest;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransferInitiateResponse;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.TransactionEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.TransactionStatus;
import com.digitalbanking.domain.enums.TransactionType;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.AccountRepository;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.repository.TransactionRepository;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CustomerPinService;
import com.digitalbanking.service.TransferService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "TRANSFER-SERVICE")
public class TransferServiceImpl implements TransferService {

    private final SecurityUtils securityUtils;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CustomerPinService customerPinService;
    private final CustomerRepository customerRepository;
    private final TransferTxExecutor transferTxExecutor;

    @Override
    @Transactional
    public TransferInitiateResponse initiateInternalTransfer(InternalTransferInitiateRequest request) {
        log.info("Initiating internal transfer: {}", request);

        UserEntity currentUser = securityUtils.getCurrentUser();

        if (request.getSourceAccountNumber().equals(request.getTargetAccountNumber())) {
            throw new BusinessException(ErrorCode.INVALID_TRANSFER_TARGET);
        }

        // find source account
        AccountEntity sourceAcc = accountRepository.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (!sourceAcc.getCustomer().getUser().getId().equals(currentUser.getId())) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        if (sourceAcc.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        // Soft balance check
        BigDecimal totalRequired = request.getAmount();
        if (sourceAcc.getBalance()
                .subtract(sourceAcc.getFrozenBalance())
                .compareTo(totalRequired) < 0) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_FUNDS);
        }

        // find target account
        AccountEntity targetAcc = accountRepository.findByAccountNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));

        if (targetAcc.getStatus() != AccountStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.ACCOUNT_LOCKED);
        }

        String txnCode = "TXN-" + UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, 16).toUpperCase();

        TransactionEntity txn = TransactionEntity.builder()
                .transactionCode(txnCode)
                .sourceAccount(sourceAcc)
                .targetAccount(targetAcc)
                .targetAccountNumber(targetAcc.getAccountNumber())
                .targetAccountName(targetAcc.getCustomer().getFullName())
                .amount(request.getAmount())
                .feeAmount(BigDecimal.ZERO)
                .description(request.getDescription())
                .transactionType(TransactionType.INTERNAL_TRANSFER)
                .status(TransactionStatus.PENDING)
                .build();

        transactionRepository.save(txn);
        log.info("Internal transfer transaction created with code: {}", txnCode);

        return TransferInitiateResponse.builder()
                .transactionCode(txnCode)
                .sourceAccountNumber(sourceAcc.getAccountNumber())
                .targetAccountNumber(targetAcc.getAccountNumber())
                .targetAccountName(targetAcc.getCustomer().getFullName())
                .amount(request.getAmount())
                .feeAmount(BigDecimal.ZERO)
                .description(request.getDescription())
                .status(TransactionStatus.PENDING)
                .expiresInSeconds(300)
                .build();
    }

    @Override
    public TransactionResponse confirmInternalTransfer(InternalTransferConfirmRequest request) {
        CustomerEntity currentCustomer = getCurrentCustomer();

        customerPinService.verifyPin(currentCustomer, request.getOtpCode());

        return transferTxExecutor.executeTransfer(
                request.getTransactionCode(), currentCustomer.getId()
        );
    }

    private CustomerEntity getCurrentCustomer() {
        UserEntity currentUser = securityUtils.getCurrentUser();
        return customerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));
    }
}
