package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.*;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.AuthResponse;
import com.digitalbanking.domain.dto.response.RegisterResponse;
import com.digitalbanking.service.AuthService;
import com.digitalbanking.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j(topic = "AUTHENTICATION-CONTROLLER")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register attempt for email: {}", request.getEmail());

        RegisterResponse response = authService.register(request);

        return ApiResponse.ok("User registered successfully", response);
    }


    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getUsername());

        AuthResponse response = authService.login(request);
        return ApiResponse.ok("Login successfully", response);
    }


    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        log.info("Refresh token attempt for refresh toke");

        AuthResponse response = authService.refreshToken(request);
        return ApiResponse.ok("Token refreshed successfully", response);
    }


    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @RequestBody(required = false) RefreshTokenRequest request
    ) {
        log.info("Logout attempt for refresh token: {}", request.getRefreshToken());

        if (request.getRefreshToken() != null) {
            authService.logout(request.getRefreshToken());
        }
        return ApiResponse.ok("Logged out successfully");
    }


    @PostMapping("/send-otp")
    public ApiResponse<Void> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        log.info("Sending OTP to email !!");

        otpService.sendOtp(request);

        return ApiResponse.ok("OTP has been sent successfully");
    }


    @PostMapping("/verify-otp")
    public ApiResponse<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("Verify OTP for email: {}", request.getEmail());

        AuthResponse response = authService.verifyOtp(request);

        return ApiResponse.ok("OTP verified successfully", response);
    }
}
