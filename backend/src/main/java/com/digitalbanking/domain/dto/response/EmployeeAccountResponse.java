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
public class EmployeeAccountResponse {

    private UUID id;
    private String accountNumber;
    private String cif;
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private AccountType accountType;
    private BigDecimal balance;
    private BigDecimal frozenBalance;
    private BigDecimal availableBalance;
    private String currency;
    private AccountStatus status;
    private Boolean isDefault;
    private Instant openedAt;
    private Instant closedAt;
    private Instant updatedAt;
}
