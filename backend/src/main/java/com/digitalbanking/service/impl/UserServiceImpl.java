package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.response.CustomerProfileDto;
import com.digitalbanking.domain.dto.response.UserMeResponse;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Override
    @Transactional(readOnly = true)
    public UserMeResponse getMyProfile(UUID userId) {
        log.info("Fetching profile for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for id: {}", userId);
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });

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

        Object profile = null;
        CustomerEntity customer = user.getCustomer();
        if (customer != null) {
            profile = CustomerProfileDto.builder()
                    .id(customer.getId())
                    .customerCode(customer.getCustomerCode())
                    .fullName(customer.getFullName())
                    .nationalId(customer.getNationalId())
                    .dateOfBirth(customer.getDateOfBirth())
                    .address(customer.getAddress())
                    .avatarUrl(customer.getAvatarUrl())
                    .createdAt(customer.getCreatedAt())
                    .updatedAt(customer.getUpdatedAt())
                    .build();
        }

        // fetch employee profile

        return UserMeResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus().name())
                .roles(roles)
                .permissions(permissions)
                .profile(profile)
                .build();
    }

}
