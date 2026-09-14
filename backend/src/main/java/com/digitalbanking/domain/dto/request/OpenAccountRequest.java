package com.digitalbanking.domain.dto.request;

import com.digitalbanking.domain.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OpenAccountRequest {

    @NotNull(message = "Customer ID is required")
    private UUID customerId;

    private AccountType accountType = AccountType.CHECKING;

    private String currency = "VND";

    private BigDecimal initialDeposit = BigDecimal.ZERO;
}