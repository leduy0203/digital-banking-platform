package com.digitalbanking.domain.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 255, message = "Địa chỉ không vượt quá 255 ký tự")
    private String address;

    @Size(max = 500, message = "Đường dẫn Avatar không vượt quá 500 ký tự")
    private String avatarUrl;
}
