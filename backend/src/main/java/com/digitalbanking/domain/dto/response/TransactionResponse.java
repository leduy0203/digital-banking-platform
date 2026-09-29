package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.TransactionStatus;
import com.digitalbanking.domain.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private UUID id;
    private String transactionCode;
    private String sourceAccountNumber;
    private String sourceAccountName;
    private String targetAccountNumber;
    private String targetAccountName;
    private String targetBankCode;
    private String targetBankName;
    private BigDecimal amount;
    private BigDecimal feeAmount;
    private String description;
    private TransactionType transactionType;
    private TransactionStatus status;
    private Instant completedAt;
    private Instant createdAt;
}