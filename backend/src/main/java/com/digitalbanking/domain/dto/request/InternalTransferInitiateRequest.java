package com.digitalbanking.domain.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternalTransferInitiateRequest {

    @NotBlank(message = "Source account number is required")
    @Size(max = 30, message = "Source account number cannot exceed 30 characters")
    private String sourceAccountNumber;

    @NotBlank(message = "Target account number is required")
    @Size(max = 30, message = "Target account number cannot exceed 30 characters")
    private String targetAccountNumber;

    @NotNull(message = "Transfer amount is required")
    @DecimalMin(value = "1000.00", message = "Minimum transfer amount is 1,000 VND")
    private BigDecimal amount;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;
}