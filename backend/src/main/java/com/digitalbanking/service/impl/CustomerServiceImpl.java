package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.CustomerOnboardingRequest;
import com.digitalbanking.domain.dto.request.UpdateProfileRequest;
import com.digitalbanking.domain.dto.response.CustomerResponse;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.KycDocumentEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.domain.enums.AccountStatus;
import com.digitalbanking.domain.enums.AccountType;
import com.digitalbanking.domain.enums.KycStatus;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.AccountRepository;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.repository.KycDocumentRepository;
import com.digitalbanking.repository.UserRepository;
import com.digitalbanking.service.CloudinaryService;
import com.digitalbanking.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-SERVICE")
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final KycDocumentRepository kycDocumentRepository;
    private final AccountRepository accountRepository;
    private final CloudinaryService cloudinaryService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional
    public CustomerResponse completeOnboarding(UUID userId, CustomerOnboardingRequest request) {
        log.info("Completing onboarding for user {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(customerRepository.existsByUserId(userId)){
            throw new BusinessException(ErrorCode.CUSTOMER_PROFILE_ALREADY_EXISTS);
        }

        if (customerRepository.existsByNationalId(request.getNationalId())) {
            throw new BusinessException(ErrorCode.NATIONAL_ID_ALREADY_EXISTS);
        }

        // Create customer

        String customerCode = "CUST" + String.format("%07d", secureRandom.nextInt(10000000));
        CustomerEntity customer = CustomerEntity.builder()
                .user(user)
                .customerCode(customerCode)
                .fullName(request.getFullName().trim().toUpperCase())
                .nationalId(request.getNationalId().trim())
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress().trim())
                .avatarUrl(request.getSelfiePhotoUrl())
                .build();

        CustomerEntity savedCustomer = customerRepository.saveAndFlush(customer);
        log.info("Saving customer into DB {}", savedCustomer);


        String officialFrontUrl = cloudinaryService.moveToOfficialKycFolder(
                request.getFrontIdCardUrl(), savedCustomer.getId(), "front_card"
        );
        String officialBackUrl = cloudinaryService.moveToOfficialKycFolder(
                request.getBackIdCardUrl(), savedCustomer.getId(), "back_card"
        );
        String officialSelfieUrl = cloudinaryService.moveToOfficialKycFolder(
                request.getSelfiePhotoUrl(), savedCustomer.getId(), "selfie"
        );

        savedCustomer.setAvatarUrl(officialSelfieUrl);

        // Create kyc
        KycDocumentEntity kycDoc = KycDocumentEntity.builder()
                .customer(savedCustomer)
                .frontIdCardUrl(officialFrontUrl)
                .backIdCardUrl(officialBackUrl)
                .selfiePhotoUrl(officialSelfieUrl)
                .status(KycStatus.PENDING)
                .submittedAt(Instant.now())
                .build();

        kycDocumentRepository.save(kycDoc);

        // Auto create account
        String accountNumber = generateUniqueAccountNumber();
        AccountEntity defaultAccount = AccountEntity.builder()
                .customer(savedCustomer)
                .accountNumber(accountNumber)
                .balance(BigDecimal.ZERO)
                .frozenBalance(BigDecimal.ZERO)
                .currency("VND")
                .accountType(AccountType.CHECKING)
                .status(AccountStatus.ACTIVE)
                .openedAt(Instant.now())
                .build();

        accountRepository.save(defaultAccount);
        log.info("Customer onboarding completed: code={}, account={}", customerCode, accountNumber);

        return CustomerResponse.builder()
                .id(savedCustomer.getId())
                .customerCode(savedCustomer.getCustomerCode())
                .fullName(savedCustomer.getFullName())
                .nationalId(savedCustomer.getNationalId())
                .dateOfBirth(savedCustomer.getDateOfBirth())
                .address(savedCustomer.getAddress())
                .avatarUrl(savedCustomer.getAvatarUrl())
                .kycStatus(kycDoc.getStatus())
                .defaultAccountNumber(defaultAccount.getAccountNumber())
                .defaultBalance(defaultAccount.getBalance())
                .createdAt(savedCustomer.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getMyProfile(UUID userId) {
        log.info("Getting profile for user {}", userId);

        CustomerEntity customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));

        return mapToCustomerResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        log.info("Updating profile for user {}", userId);

        CustomerEntity customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));

        if (StringUtils.hasText(request.getAddress())) {
            customer.setAddress(request.getAddress().trim());
        }
        if (StringUtils.hasText(request.getAvatarUrl())) {
            customer.setAvatarUrl(request.getAvatarUrl().trim());
        }

        return mapToCustomerResponse(customer);
    }

    private String generateUniqueAccountNumber() {
        String accNum;
        do {
            accNum = "9333" + String.format("%06d", secureRandom.nextInt(1000000));
        } while (accountRepository.existsByAccountNumber(accNum));
        return accNum;
    }


    private CustomerResponse mapToCustomerResponse(CustomerEntity customer) {
        KycStatus kycStatus = kycDocumentRepository.findTopByCustomerIdOrderBySubmittedAtDesc(customer.getId())
                .map(KycDocumentEntity::getStatus)
                .orElse(KycStatus.NOT_SUBMITTED);

        AccountEntity defaultAccount = accountRepository
                .findFirstByCustomerIdAndAccountTypeAndStatus(customer.getId(), AccountType.CHECKING, AccountStatus.ACTIVE)
                .orElse(null);

        return CustomerResponse.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .fullName(customer.getFullName())
                .nationalId(customer.getNationalId())
                .dateOfBirth(customer.getDateOfBirth())
                .address(customer.getAddress())
                .avatarUrl(customer.getAvatarUrl())
                .kycStatus(kycStatus)
                .defaultAccountNumber(defaultAccount != null ? defaultAccount.getAccountNumber() : null)
                .defaultBalance(defaultAccount != null ? defaultAccount.getBalance() : BigDecimal.ZERO)
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
