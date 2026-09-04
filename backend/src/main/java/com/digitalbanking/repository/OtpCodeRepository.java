package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.OtpCodeEntity;
import com.digitalbanking.domain.enums.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCodeEntity, UUID> {

    @Query("SELECT o FROM OtpCodeEntity o " +
            "WHERE o.user.id = :userId " +
            "AND o.purpose = :purpose " +
            "AND o.isUsed = false " +
            "AND o.expiresAt > CURRENT_TIMESTAMP " +
            "ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpCodeEntity> findLatestValidOtp(
            @Param("userId") UUID userId,
            @Param("purpose") OtpPurpose purpose
    );
}