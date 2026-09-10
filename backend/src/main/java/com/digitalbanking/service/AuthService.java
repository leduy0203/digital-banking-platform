package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.LoginRequest;
import com.digitalbanking.domain.dto.request.RefreshTokenRequest;
import com.digitalbanking.domain.dto.request.RegisterRequest;
import com.digitalbanking.domain.dto.request.VerifyOtpRequest;
import com.digitalbanking.domain.dto.response.AuthResponse;
import com.digitalbanking.domain.dto.response.RegisterResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request , HttpServletRequest httpServletRequest);

    AuthResponse refreshToken(RefreshTokenRequest request);

    AuthResponse verifyOtp(VerifyOtpRequest request);

    void logout(String refreshToken);
}
