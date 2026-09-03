package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.SendOtpRequest;
import com.digitalbanking.domain.dto.request.VerifyOtpRequest;
import com.digitalbanking.domain.entity.OtpCodeEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.OtpCodeRepository;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.service.EmailService;
import com.digitalbanking.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "OTP-SERVICE")
public class OtpServiceImpl implements OtpService {

    private final OtpCodeRepository otpCodeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();


    @Override
    @Transactional
    public void sendOtp(SendOtpRequest request) {
        log.debug("Sending OTP request: {}", request);

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        //Create & hash OTP
        String rawOtp = String.format("%06d", secureRandom.nextInt(1000000));
        String hashedOtp = DigestUtils.sha256Hex(rawOtp);

        // Save DB
        OtpCodeEntity otpEntity = OtpCodeEntity.builder()
                .user(user)
                .purpose(request.getPurpose())
                .codeHash(hashedOtp)
                .attemptCount(0)
                .maxAttempts(3)
                .isUsed(false)
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .build();

        otpCodeRepository.save(otpEntity);

        emailService.sendOtpEmail(user.getEmail(), rawOtp);
    }


    @Override
    @Transactional
    public boolean verifyOtp(VerifyOtpRequest request) {
        log.debug("Verifying OTP request: {}", request);

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        OtpCodeEntity otpCode = otpCodeRepository
                .findLatestValidOtp(user.getId(), request.getPurpose())
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_NOT_FOUND));

        // Check AttemptCount
        if (otpCode.getAttemptCount() >= otpCode.getMaxAttempts()) {
            throw new BusinessException(ErrorCode.OTP_MAX_ATTEMPTS_EXCEEDED);
        }

        // Check Expires of OTP
        if (otpCode.getExpiresAt().isBefore(Instant.now())) {
            throw new BusinessException(ErrorCode.OTP_EXPIRED);
        }

        // Compare OTP request vs OPT DB
        String hashedInputOtp = DigestUtils.sha256Hex(request.getCode());
        if (!otpCode.getCodeHash().equals(hashedInputOtp)) {
            otpCode.setAttemptCount(otpCode.getAttemptCount() + 1);
            otpCodeRepository.save(otpCode);
            throw new BusinessException(ErrorCode.INVALID_OTP);
        }

        otpCode.setIsUsed(true);
        otpCodeRepository.save(otpCode);

        return true;
    }
}
