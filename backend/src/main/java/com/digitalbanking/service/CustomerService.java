package com.digitalbanking.service;

import com.digitalbanking.domain.dto.response.CustomerResponseDto;

import java.util.UUID;

public interface CustomerService {

    CustomerResponseDto getCustomerProfileByUserId(UUID id);

}
