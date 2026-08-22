package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.LedgerEntryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntryEntity, UUID> {

    List<LedgerEntryEntity> findByTransactionId(UUID transactionId);

    Page<LedgerEntryEntity> findByAccountIdOrderByEntryTimeDesc(UUID accountId, Pageable pageable);
}
