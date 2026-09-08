package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountResponse {

    private UUID id;
    private String accountNumber;
    private BigDecimal balance;
    private BigDecimal frozenBalance;
    private BigDecimal availableBalance;
    private String currency;
    private AccountType accountType;
    private AccountStatus status;
    private Instant openedAt;
    private Instant closedAt;
}