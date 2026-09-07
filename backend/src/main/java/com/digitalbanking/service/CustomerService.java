package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.CustomerOnboardingRequest;
import com.digitalbanking.domain.dto.request.UpdateProfileRequest;
import com.digitalbanking.domain.dto.response.CustomerResponse;

import java.util.UUID;

public interface CustomerService {

    CustomerResponse completeOnboarding(UUID userId, CustomerOnboardingRequest request);

    CustomerResponse getMyProfile(UUID userId);

    CustomerResponse updateProfile(UUID userId, UpdateProfileRequest request);
}
