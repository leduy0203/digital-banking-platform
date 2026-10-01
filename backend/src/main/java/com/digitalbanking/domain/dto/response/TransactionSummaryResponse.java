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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSummaryResponse {

    private UUID id;

    private String transactionCode;

    private BigDecimal amount;

    private String direction;

    private String counterpartAccountNumber;

    private String counterpartName;

    private String description;

    private TransactionType transactionType;

    private TransactionStatus status;

    private Instant createdAt;
}