package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.LoginRequest;
import com.digitalbanking.domain.dto.request.RefreshTokenRequest;
import com.digitalbanking.domain.dto.request.RegisterRequest;
import com.digitalbanking.domain.dto.response.AuthResponse;
import com.digitalbanking.domain.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String refreshToken);
}
