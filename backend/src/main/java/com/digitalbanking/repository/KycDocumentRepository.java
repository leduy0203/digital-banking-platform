package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.KycDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface KycDocumentRepository extends JpaRepository<KycDocumentEntity, Long> {

    Optional<KycDocumentEntity> findTopByCustomerIdOrderBySubmittedAtDesc(UUID customerId);
}
