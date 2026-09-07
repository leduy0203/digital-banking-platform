package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.KycStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private UUID id;
    private String customerCode;
    private String fullName;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String address;
    private String avatarUrl;
    private KycStatus kycStatus;
    private String defaultAccountNumber;
    private BigDecimal defaultBalance;
    private Instant createdAt;
}