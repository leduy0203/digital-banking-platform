package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.TransactionStatus;
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
public class TransferInitiateResponse {

    private String transactionCode;
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private String targetAccountName;
    private BigDecimal amount;
    private BigDecimal feeAmount;
    private String description;
    private TransactionStatus status;
    private int expiresInSeconds;
}