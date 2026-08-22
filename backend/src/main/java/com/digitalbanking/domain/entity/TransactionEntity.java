package com.digitalbanking.domain.entity;


import com.digitalbanking.domain.common.BaseEntity;
import com.digitalbanking.domain.enums.TransactionStatus;
import com.digitalbanking.domain.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEntity extends BaseEntity {

    @Column(name = "transaction_code", nullable = false, unique = true, length = 50)
    private String transactionCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_account_id")
    private AccountEntity sourceAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_account_id")
    private AccountEntity targetAccount;

    @Column(name = "target_bank_code", length = 20)
    private String targetBankCode;

    @Column(name = "target_bank_name", length = 150)
    private String targetBankName;

    @Column(name = "target_account_number", length = 30)
    private String targetAccountNumber;

    @Column(name = "target_account_name", length = 150)
    private String targetAccountName;

    @Column(name = "amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "fee_amount", nullable = false, precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal feeAmount = BigDecimal.ZERO;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "idempotency_key", unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "completed_at")
    private Instant completedAt;
}
