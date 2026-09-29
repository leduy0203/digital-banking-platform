package com.digitalbanking.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetupPinRequest {

    @NotBlank(message = "Transaction PIN is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Transaction PIN must be exactly 6 digits")
    private String pin;

    @NotBlank(message = "Confirm PIN is required")
    private String confirmPin;
}
