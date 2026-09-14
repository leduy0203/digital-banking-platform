package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.request.ChangePasswordRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.UserMeResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j(topic = "USER-CONTROLLER")
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    public ApiResponse<UserMeResponse> getMyProfile() {

        UUID currentUserId = securityUtils.getCurrentUserId();

        log.info("Fetching profile for user: {}", currentUserId);

        UserMeResponse response = userService.getMyProfile(currentUserId);

        return ApiResponse.ok("Fetch user profile successfully", response);
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        UUID currentUserId = securityUtils.getCurrentUserId();
        log.info("Change password request for user: {}", currentUserId);

        userService.changePassword(currentUserId, request);

        return ApiResponse.ok("Password changed successfully. Please log in again.");
    }
}
