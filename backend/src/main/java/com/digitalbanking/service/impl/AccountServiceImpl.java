package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.entity.AccountEntity;
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
                .openedAt(account.getOpenedAt())
                .closedAt(account.getClosedAt())
                .build();
    }
}
