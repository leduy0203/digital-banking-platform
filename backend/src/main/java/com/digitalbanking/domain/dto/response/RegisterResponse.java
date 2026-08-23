package com.digitalbanking.domain.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private UUID userId;
    private String email;
    private String phoneNumber;
    private String fullName;
    private String customerCode;
}