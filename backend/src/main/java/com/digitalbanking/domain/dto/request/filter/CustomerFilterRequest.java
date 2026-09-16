package com.digitalbanking.domain.dto.request.filter;

import com.digitalbanking.domain.dto.request.PaginationRequest;
import com.digitalbanking.domain.enums.KycStatus;
import com.digitalbanking.domain.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerFilterRequest extends PaginationRequest {

    private String keyword;
    private KycStatus kycStatus;
    private UserStatus status;
}
