package com.digitalbanking.domain.entity;

import com.digitalbanking.common.AccountStatus;
import com.digitalbanking.common.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountEntity extends BaseEntity {

    @Column(name = "account_number", nullable = false, unique = true, length = 30)
    private String accountNumber;

    @Column(name = "balance", nullable = false, precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "frozen_balance", nullable = false, precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal frozenBalance = BigDecimal.ZERO;

    @Column(name = "available_balance", insertable = false, updatable = false, precision = 18, scale = 2)
    private BigDecimal availableBalance;

    @Column(name = "currency", nullable = false, length = 3)
    @Builder.Default
    private String currency = "VND";

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, length = 20)
    @Builder.Default
    private AccountType accountType = AccountType.CHECKING;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column(name = "opened_at", nullable = false)
    @Builder.Default
    private Instant openedAt = Instant.now();

    @Column(name = "closed_at")
    private Instant closedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private CustomerEntity customer;
}
