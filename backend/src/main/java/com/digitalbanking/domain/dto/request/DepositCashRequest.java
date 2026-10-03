package com.digitalbanking.domain.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepositCashRequest {

    @NotBlank(message = "Recipient account number cannot be blank")
    @Size(max = 30, message = "Account number must not exceed 30 characters")
    private String accountNumber;

    @NotNull(message = "Deposit amount cannot be null")
    @DecimalMin(value = "10000.00", message = "Minimum deposit amount is 10,000 VND")
    private BigDecimal amount;

    @NotBlank(message = "Depositor name cannot be blank")
    @Size(max = 150, message = "Depositor name must not exceed 150 characters")
    private String depositorName;

    @Size(max = 20, message = "Depositor national ID must not exceed 20 characters")
    private String depositorNationalId;

    @Size(max = 255, message = "Transaction description must not exceed 255 characters")
    private String description;
}
