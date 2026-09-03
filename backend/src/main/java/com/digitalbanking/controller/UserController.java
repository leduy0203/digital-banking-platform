package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.UserMeResponse;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
