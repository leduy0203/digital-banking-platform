package com.digitalbanking.service;

import com.digitalbanking.domain.dto.response.EmployeeProfileResponse;

import java.util.UUID;

public interface EmployeeProfileService {
    EmployeeProfileResponse getMyProfile(UUID userId);
}
