package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.*;
import com.digitalbanking.domain.dto.response.AuthResponse;
import com.digitalbanking.domain.dto.response.RegisterResponse;
import com.digitalbanking.domain.entity.*;
import com.digitalbanking.domain.enums.OtpPurpose;
import com.digitalbanking.domain.enums.UserRole;
import com.digitalbanking.domain.enums.UserStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.*;
import com.digitalbanking.security.JwtTokenProvider;
import com.digitalbanking.service.AuthService;
import com.digitalbanking.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "AUTHENTICATION-SERVICE")
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OtpService otpService;


    @Value("${app.security.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.security.jwt.access-token-expiration-ms:900000}")
    private long accessTokenExpirationMs;


    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("User with email {} already exists", request.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            log.warn("User with phone number {} already exists", request.getPhoneNumber());
            throw new BusinessException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        RoleEntity customerRole = roleRepository
                .findByRoleCode(UserRole.ROLE_CUSTOMER)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .roles(Set.of(customerRole))
                .status(UserStatus.PENDING)
                .build();

        UserEntity savedUser = userRepository.save(user);
        log.info("User registered successfully with id={}", savedUser.getId());


        SendOtpRequest otpRequest = new SendOtpRequest();
        otpRequest.setEmail(savedUser.getEmail());
        otpRequest.setPurpose(OtpPurpose.EMAIL_VERIFICATION);

        otpService.sendOtp(otpRequest);
        log.info("OTP Sent successfully with id={}", savedUser.getId());

        return RegisterResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .build();
    }


    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login request for identifier: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserEntity user = (UserEntity) authentication.getPrincipal();

        Set<String> roleCodes = user.getRoles().stream()
                .map(role -> role.getRoleCode().toString())
                .collect(Collectors.toSet());

        String fullName = null;
        boolean isProfileCompleted = false;

        if (roleCodes.contains(UserRole.ROLE_CUSTOMER.name())) {
            // if user is customer
            Optional<CustomerEntity> customerOpt = customerRepository.findByUserId(user.getId());

            if (customerOpt.isPresent()) {
                fullName = customerOpt.get().getFullName();
                isProfileCompleted = true;
            }
        } else if (roleCodes.contains(UserRole.ROLE_TELLER.name()) ||
                roleCodes.contains(UserRole.ROLE_ADMIN.name())) {

            // if user is employee or admin
            Optional<EmployeeEntity> employeeOpt = employeeRepository.findByUserId(user.getId());

            fullName = employeeOpt.map(EmployeeEntity::getFullName).orElse("System Administrator");
            isProfileCompleted = true;
        }


        log.info("User ID {} ({}) logged in successfully with roles {}", user.getId(), fullName, roleCodes);

        return generateTokensAndBuildResponse(user, fullName, isProfileCompleted, null);
    }


    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Processing refresh token request");

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            log.warn("Refresh token validation failed: Invalid or expired JWT signature");
            throw new BusinessException(ErrorCode.UNAUTHENTICATED);
        }

        String hashedIncomingToken = hashToken(request.getRefreshToken());

        RefreshTokenEntity tokenEntity = refreshTokenRepository.findByTokenHash(hashedIncomingToken)
                .orElseThrow(() -> {
                    log.warn("Refresh token not found in database for hash: {}", hashedIncomingToken);
                    return new BusinessException(ErrorCode.UNAUTHENTICATED);
                });

        if (Boolean.TRUE.equals(tokenEntity.getIsRevoked())) {
            log.warn("Security Alert: Attempted use of revoked refresh token ID: {}", tokenEntity.getId());
            throw new BusinessException(ErrorCode.UNAUTHENTICATED);
        }

        if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Refresh token ID {} has expired at {}", tokenEntity.getId(), tokenEntity.getExpiresAt());
            throw new BusinessException(ErrorCode.UNAUTHENTICATED);
        }

        UserEntity user= tokenEntity.getUser();

        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            log.warn("Refresh token rejected: Account ID {} status is {}", user.getId(), user.getStatus());
            throw new BusinessException(ErrorCode.ACCOUNT_INACTIVE);
        }

        Optional<CustomerEntity> customerOpt = customerRepository.findByUserId(user.getId());

        String fullName = customerOpt.map(CustomerEntity::getFullName).orElse(null);

        boolean isProfileCompleted = customerOpt.isPresent();

        //get expires of old token
        Instant originalExpiresAt = tokenEntity.getExpiresAt();

        // set revoked and last used at
        tokenEntity.setIsRevoked(true);
        tokenEntity.setLastUsedAt(Instant.now());
        log.info("Revoked old refresh token ID {} for user ID {}", tokenEntity.getId(), user.getId());

        refreshTokenRepository.save(tokenEntity);

        return generateTokensAndBuildResponse(user, fullName, isProfileCompleted, originalExpiresAt);
    }


    @Override
    @Transactional
    public void logout(String refreshToken) {
        log.info("Processing logout request for refresh token");

        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        String hashedToken = hashToken(refreshToken);
        Optional<RefreshTokenEntity> tokenOpt = refreshTokenRepository.findByTokenHash(hashedToken);

        if (tokenOpt.isPresent()) {
            RefreshTokenEntity tokenEntity = tokenOpt.get();

            tokenEntity.setIsRevoked(true);
            refreshTokenRepository.save(tokenEntity);

            log.info("Successfully revoked refresh token on logout for user ID: {}", tokenEntity.getUser().getId());
        }
    }

    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        log.info("Verifying OTP for email: {}", request.getEmail());

        boolean isValid = otpService.verifyOtp(request);
        if (!isValid) {
            throw new BusinessException(ErrorCode.INVALID_OTP);
        }

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Optional<CustomerEntity> customerOpt = customerRepository.findByUserId(user.getId());
        String fullName = customerOpt.map(CustomerEntity::getFullName).orElse(null);

        boolean isProfileCompleted = customerOpt.isPresent();
        log.info("User {} verified OTP successfully, generating tokens", user.getEmail());

        return generateTokensAndBuildResponse(user, fullName, isProfileCompleted, null);
    }


    private AuthResponse generateTokensAndBuildResponse(
            UserEntity user,
            String fullName,
            boolean isProfileCompleted ,
            Instant originalExpiresAt
    ) {
        log.info("Generating tokens for user with email: {}", user.getEmail());

        Instant expiry = (originalExpiresAt != null)
                ? originalExpiresAt
                : Instant.now().plusMillis(refreshTokenExpirationMs);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenStr = jwtTokenProvider.generateRefreshTokenWithExpiry(user , expiry);

        String hashToken = hashToken(refreshTokenStr);

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                .user(user)
                .tokenHash(hashToken)
                .isRevoked(false)
                .expiresAt(expiry)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
        log.info("Save successful tokens for user with email: {}", user.getEmail());

        Set<String> roles = new HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> roles.add(role.getRoleCode().toString()));
        }

        AuthResponse.UserSummary userSummary = AuthResponse.UserSummary.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .fullName(fullName)
                .isProfileCompleted(isProfileCompleted)
                .roles(roles)
                .build();


        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(userSummary)
                .build();
    }


    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing token", e);
        }
    }
}
