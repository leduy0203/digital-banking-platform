package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.LoginRequest;
import com.digitalbanking.domain.dto.request.RefreshTokenRequest;
import com.digitalbanking.domain.dto.request.RegisterRequest;
import com.digitalbanking.domain.dto.response.AuthResponse;
import com.digitalbanking.domain.dto.response.RegisterResponse;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.RefreshTokenEntity;
import com.digitalbanking.domain.entity.RoleEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.domain.enums.UserRole;
import com.digitalbanking.domain.enums.UserStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.repository.RefreshTokenRepository;
import com.digitalbanking.repository.RoleRepository;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.security.JwtTokenProvider;
import com.digitalbanking.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "AUTHENTICATION-SERVICE")
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;


    @Value("${app.security.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.security.jwt.access-token-expiration-ms:900000}")
    private long accessTokenExpirationMs;


    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("User with email {} already exists", request.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            log.warn("User with phone number {} already exists", request.getPhoneNumber());
            throw new BusinessException(ErrorCode.PHONE_NUMBER_ALREADY_EXISTS);
        }

        if (customerRepository.existsByNationalId(request.getNationalId())) {
            log.warn("Customer registration failed: national ID already exists");
            throw new BusinessException(ErrorCode.NATIONAL_ID_ALREADY_EXISTS);
        }

        RoleEntity customerRole = roleRepository
                .findByRoleCode(UserRole.ROLE_CUSTOMER)
                .orElseThrow(() -> {
                    log.info("Role with code ROLE_CUSTOMER not found");
                    return new BusinessException(ErrorCode.ROLE_NOT_FOUND);
                });

        Set<RoleEntity> roles = new HashSet<>();
        roles.add(customerRole);

        UserEntity user = UserEntity.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .roles(roles)
                .build();

        UserEntity savedUser = userRepository.save(user);
        log.info("User registered successfully with id={}", savedUser.getId());

        CustomerEntity customer = CustomerEntity.builder()
                .user(savedUser)
                .customerCode("CUST-" + savedUser.getId())
                .nationalId(request.getNationalId())
                .fullName(request.getFullName())
                .build();


        customerRepository.save(customer);
        log.info("Customer registered successfully with id={}", savedUser.getId());

        return RegisterResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .fullName(customer.getFullName())
                .customerCode(customer.getCustomerCode())
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

        CustomerEntity customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> {
                    log.error("Data integrity error: Customer profile missing for user ID {}", user.getId());
                    return new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND);
                });

        log.info("User ID {} ({}) logged in successfully", user.getId(), customer.getFullName());

        return generateTokensAndBuildResponse(user, customer.getFullName());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        return null;
    }

    @Override
    public void logout(String refreshToken) {

    }


    private AuthResponse generateTokensAndBuildResponse(UserEntity user, String fullName) {
        log.info("Generating tokens for user with email: {}", user.getEmail());

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user);

        RefreshTokenEntity refreshTokenEntity = RefreshTokenEntity.builder()
                .user(user)
                .tokenHash(refreshTokenStr)
                .isRevoked(false)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpirationMs))
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
}
