package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.ChangePasswordRequest;
import com.digitalbanking.domain.dto.response.UserMeResponse;
import jakarta.validation.Valid;

import java.util.UUID;

public interface UserService {

    UserMeResponse getMyProfile(UUID userId);

    void changePassword(UUID currentUserId, ChangePasswordRequest request);
}
