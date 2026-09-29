package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.KycStatus;
import com.digitalbanking.domain.enums.UserStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDetailResponse {

    private UUID customerId;
    private UUID userId;
    private String customerCode;
    private String fullName;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String address;
    private String avatarUrl;
    private String email;
    private String phoneNumber;
    private UserStatus userStatus;

    private KycStatus kycStatus;
    private Instant kycSubmittedAt;
    private Instant kycVerifiedAt;

    private BigDecimal totalBalance;
    private int totalAccounts;

    private List<CustomerAccountSummaryDto> accounts;

    private boolean hasTransactionPin;

    private Instant createdAt;
    private Instant updatedAt;
}