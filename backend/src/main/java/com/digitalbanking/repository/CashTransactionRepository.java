package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.CashTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CashTransactionRepository extends JpaRepository<CashTransactionEntity, UUID> {
    Optional<CashTransactionEntity> findByReferenceCode(String referenceCode);
}