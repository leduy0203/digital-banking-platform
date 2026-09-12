package com.digitalbanking.domain.dto.request;

import com.digitalbanking.domain.enums.DepartmentType;
import com.digitalbanking.domain.enums.UserRole;
import com.digitalbanking.domain.enums.UserStatus;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeFilterRequest {

    private String keyword;

    private UserStatus status;

    private DepartmentType department;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDir = "DESC";
}