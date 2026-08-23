package com.digitalbanking.security;

import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    public UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }

        return UUID.fromString(authentication.getName());
    }

    public UserEntity getCurrentUser() {
        log.info("Fetching current authenticated user");
        UUID userId = getCurrentUserId();

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
