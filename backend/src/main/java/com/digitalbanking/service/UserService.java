package com.digitalbanking.service;

import com.digitalbanking.domain.dto.response.UserMeResponse;

import java.util.UUID;

public interface UserService {

    UserMeResponse getMyProfile(UUID userId);
}
