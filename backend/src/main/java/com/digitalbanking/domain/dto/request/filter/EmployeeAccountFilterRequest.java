package com.digitalbanking.domain.dto.request.filter;

import com.digitalbanking.domain.dto.request.PaginationRequest;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class EmployeeAccountFilterRequest extends PaginationRequest {

    private String keyword;
    private AccountStatus status;
    private AccountType accountType;
}