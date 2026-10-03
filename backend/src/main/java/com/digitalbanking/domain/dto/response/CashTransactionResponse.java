package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.CashOperationType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashTransactionResponse {

    private UUID id;
    private String referenceCode;
    private String transactionCode;
    private String accountNumber;
    private String accountName;
    private CashOperationType operationType;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String tellerCode;
    private String tellerName;
    private String depositorName;
    private String description;
    private Instant createdAt;
}
