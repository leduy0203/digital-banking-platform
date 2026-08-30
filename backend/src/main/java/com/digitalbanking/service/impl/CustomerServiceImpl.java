package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.response.CustomerResponseDto;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.mapper.CustomerMapper;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-SERVICE")
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDto getCustomerProfileByUserId(UUID userId) {
        log.info("Fetching customer profile for userId: {}", userId);

        CustomerEntity customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.warn("Customer profile not found for userId: {}", userId);
                    return new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND);
                });

        return customerMapper.toResponseDto(customer);
    }
}
