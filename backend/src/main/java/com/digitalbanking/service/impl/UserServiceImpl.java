package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.ChangePasswordRequest;
import com.digitalbanking.domain.dto.response.UserMeResponse;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.service.TokenService;
import com.digitalbanking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "USER-SERVICE")
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    @Transactional(readOnly = true)
    public UserMeResponse getMyProfile(UUID userId) {
        log.info("Fetching profile for userId: {}", userId);

        UserEntity user = findById(userId);

        Set<String> roles = new HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                if (role.getRoleCode() != null) {
                    roles.add(role.getRoleCode().toString());
                }
            });
        }

        Set<String> permissions = new HashSet<>();
        user.getAuthorities().forEach(authority -> {
            String auth = authority.getAuthority();
            if (!auth.startsWith("ROLE_")) {
                permissions.add(auth);
            }
        });

        return UserMeResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus().name())
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    @Transactional
    public void changePassword(UUID currentUserId, ChangePasswordRequest request) {
        log.info("Changing password for userId: {}", currentUserId);

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            log.warn("New password and confirm password do not match for userId: {}", currentUserId);
            throw new BusinessException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        UserEntity user = findById(currentUserId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            log.warn("Current password does not match for userId: {}", currentUserId);
            throw new BusinessException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
        log.info("Password changed successfully for userId: {}", currentUserId);

        tokenService.revokeAllByUserId(currentUserId);
        log.info("Revoked all active tokens for userId: {} due to password change", currentUserId);
    }

    private UserEntity findById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for id: {}", userId);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });
    }
}
