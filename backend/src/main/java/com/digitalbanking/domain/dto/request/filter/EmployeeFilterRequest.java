package com.digitalbanking.domain.dto.request.filter;

import com.digitalbanking.domain.dto.request.PaginationRequest;
import com.digitalbanking.domain.enums.DepartmentType;
import com.digitalbanking.domain.enums.UserStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeFilterRequest extends PaginationRequest {

    private String keyword;

    private UserStatus status;

    private DepartmentType department;
}