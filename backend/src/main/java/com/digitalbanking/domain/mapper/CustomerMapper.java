package com.digitalbanking.domain.mapper;

import com.digitalbanking.domain.dto.response.CustomerResponseDto;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponseDto toResponseDto(CustomerEntity customer) {
        if (customer == null) {
            return null;
        }

        UserEntity user = customer.getUser();

        return CustomerResponseDto.builder()
                .id(customer.getId())
                .userId(user != null ? user.getId() : null)
                .fullName(customer.getFullName())
                .email(user != null ? user.getEmail() : null)
                .phoneNumber(user != null ? user.getPhoneNumber() : null)
                .nationalId(customer.getNationalId())
                .dateOfBirth(customer.getDateOfBirth())
                .address(customer.getAddress())
                .avatarUrl(customer.getAvatarUrl())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
