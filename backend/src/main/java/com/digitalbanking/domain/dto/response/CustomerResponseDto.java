package com.digitalbanking.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponseDto {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String address;
    private String avatarUrl;
    private Instant createdAt;
    private Instant updatedAt;
}