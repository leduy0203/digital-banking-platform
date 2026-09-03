package com.digitalbanking.repository;

import com.digitalbanking.domain.entity.OtpCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCodeEntity, UUID> {

    @Query(value = "SELECT * FROM otp_codes " +
            "WHERE user_id = :userId " +
            "AND purpose = :purpose " +
            "AND is_used = FALSE " +
            "ORDER BY created_at DESC " +
            "LIMIT 1",
            nativeQuery = true)
    Optional<OtpCodeEntity> findLatestValidOtp(
            @Param("userId") UUID userId,
            @Param("purpose") String purpose
    );
}
