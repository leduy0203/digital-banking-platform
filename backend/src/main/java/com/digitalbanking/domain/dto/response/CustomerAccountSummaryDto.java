package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAccountSummaryDto {

    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private BigDecimal frozenBalance;
    private BigDecimal availableBalance;
    private String currency;
    private AccountStatus status;
    private Boolean isDefault;
    private Instant openedAt;
}
