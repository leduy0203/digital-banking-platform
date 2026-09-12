package com.digitalbanking.service.impl;

import com.digitalbanking.repository.TokenRepository;
import com.digitalbanking.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j(topic = "TOKEN-SERVICE")
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;

    @Override
    public void revokeAllByUserId(UUID userId) {
        tokenRepository.revokeAllByUserId(userId);
        log.info("Revoked all active refresh token(s) for user ID: {}", userId);
    }

    @Override
    public int revokeByTokenHash(String tokenHash) {
        return tokenRepository.revokeByTokenHash(tokenHash);
    }
}
