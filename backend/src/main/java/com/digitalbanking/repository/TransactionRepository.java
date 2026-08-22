package com.digitalbanking.repository;

import com.digitalbanking.domain.enums.TransactionStatus;
import com.digitalbanking.domain.entity.TransactionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    Optional<TransactionEntity> findByTransactionCode(String transactionCode);

    Optional<TransactionEntity> findByIdempotencyKey(String idempotencyKey);

    boolean existsByIdempotencyKey(String idempotencyKey);

    // Query to find transaction
    @Query("SELECT t FROM TransactionEntity t WHERE t.sourceAccount.id = :accountId OR t.targetAccount.id = :accountId")
    Page<TransactionEntity> findAllByAccountId(@Param("accountId") UUID accountId, Pageable pageable);

    Page<TransactionEntity> findBySourceAccountIdAndStatus(UUID sourceAccountId, TransactionStatus status, Pageable pageable);
}
