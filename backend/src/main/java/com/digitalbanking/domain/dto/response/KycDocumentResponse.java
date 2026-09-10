package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDocumentResponse {

    private UUID id;
    private KycStatus status;
    private String frontIdCardUrl;
    private String backIdCardUrl;
    private String selfiePhotoUrl;
    private String rejectionReason;
    private Instant submittedAt;
    private Instant verifiedAt;

    private String verifiedByEmployeeCode;
    private String verifiedByEmployeeName;

    private UUID customerId;
    private String customerCode;
    private String fullName;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String address;
    private String email;
    private String phoneNumber;
}