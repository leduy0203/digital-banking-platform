package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.OpenAccountRequest;
import com.digitalbanking.domain.dto.response.AccountLookupResponse;
import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.AccountRepository;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "ACCOUNT-SERVICE")
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getMyAccounts(UUID currentUserId) {
        log.info("Fetching accounts for current user {}", currentUserId);

        if (!customerRepository.existsByUserId(currentUserId)) {
            throw new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND);
        }

        List<AccountEntity> accountEntities = accountRepository.findByCustomerUserId(currentUserId);

        return accountEntities.stream()
                .map(this::mapToAccountResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AccountResponse getAccountBalance(String accountNumber, UUID currentUserId) {
        log.info("Fetching account balance for account number {} by user {}", accountNumber, currentUserId);

        AccountEntity accountEntity = findByAccountNumber(accountNumber);

        if (!accountEntity.getCustomer().getUser().getId().equals(currentUserId)) {
            log.warn("Access denied: User {} tried to view balance of account {}", currentUserId, accountNumber);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        return mapToAccountResponse(accountEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountLookupResponse lookupAccount(String accountNumber) {
        log.info("Looking up account for account number {}", accountNumber);

        AccountEntity accountEntity = findByAccountNumber(accountNumber);

        String accountName = accountEntity.getCustomer() != null 
                ? accountEntity.getCustomer().getFullName().toUpperCase() 
                : "UNKNOWN";

        return AccountLookupResponse.builder()
                .accountNumber(accountEntity.getAccountNumber())
                .accountName(accountName)
                .bankName("DIGITAL BANK")
                .status(accountEntity.getStatus())
                .build();
    }

    @Override
    public AccountResponse openAccount(OpenAccountRequest request) {
        log.info("Opening new account for customer {} with initial deposit {}"
                , request.getCustomerId(), request.getInitialDeposit());

        CustomerEntity customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));

        long checkingAccountCount = accountRepository
                .countByCustomerIdAndAccountType(customer.getId(), AccountType.CHECKING);

        if (checkingAccountCount >= 5) {
            throw new BusinessException(ErrorCode.MAX_ACCOUNT_LIMIT_REACHED);
        }

        AccountEntity newAccount = AccountEntity.builder()
                .accountNumber(generateUniqueAccountNumber())
                .accountType(request.getAccountType())
                .customer(customer)
                .balance(BigDecimal.ZERO)
                .isDefault(false)
                .status(AccountStatus.ACTIVE)
                .build();

        accountRepository.save(newAccount);
        log.info("Successfully opened account {} for customer", newAccount.getAccountNumber());

        return mapToAccountResponse(newAccount);
    }

    @Override
    public AccountResponse updateAccountStatus(String accountNumber, AccountStatus status) {
        log.info("Updating account status for account number {} to {}", accountNumber, status);

        AccountEntity account = findByAccountNumber(accountNumber);
        account.setStatus(status);

        if (status == AccountStatus.CLOSED) {
            account.setClosedAt(Instant.now());
        } else {
            account.setClosedAt(null);
        }

        accountRepository.save(account);
        log.info("Successfully updated account {} status to {}", accountNumber, status);

        return mapToAccountResponse(account);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            long randomSuffix = (long) (Math.random() * 90000000L) + 10000000L;
            accountNumber = "88" + randomSuffix;
        } while (accountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }

    private AccountEntity findByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_NOT_FOUND));
    }

    private AccountResponse mapToAccountResponse(AccountEntity account) {

        BigDecimal availableBal = account.getAvailableBalance() != null
                ? account.getAvailableBalance()
                : account.getBalance().subtract(account.getFrozenBalance() != null ? account.getFrozenBalance() : BigDecimal.ZERO);

        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .frozenBalance(account.getFrozenBalance())
                .availableBalance(availableBal)
                .currency(account.getCurrency())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .isDefault(Boolean.TRUE.equals(account.getIsDefault()))
                .openedAt(account.getOpenedAt())
                .closedAt(account.getClosedAt())
                .build();
    }
}
