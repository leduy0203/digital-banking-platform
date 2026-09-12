package com.digitalbanking.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMeResponse {
    private UUID id;
    private String email;
    private String phoneNumber;
    private String status;
    private Set<String> roles;
    private Set<String> permissions;
}
