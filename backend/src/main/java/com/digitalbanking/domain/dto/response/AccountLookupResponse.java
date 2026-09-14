package com.digitalbanking.domain.dto.response;

import com.digitalbanking.domain.enums.AccountStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountLookupResponse {
    private String accountNumber;
    private String accountName;
    private AccountStatus status;
    private String bankName;
}
