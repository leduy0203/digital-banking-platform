package com.digitalbanking.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Username (email or phone number) is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
