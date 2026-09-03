package com.digitalbanking.domain.dto.response;

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
public class CustomerProfileDto {
    private UUID id;
    private String customerCode;
    private String fullName;
    private String nationalId;
    private LocalDate dateOfBirth;
    private String address;
    private String avatarUrl;
    private Instant createdAt;
    private Instant updatedAt;
}