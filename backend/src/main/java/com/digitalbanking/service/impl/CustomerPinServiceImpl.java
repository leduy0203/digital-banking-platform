package com.digitalbanking.service.impl;

import com.digitalbanking.domain.dto.request.ChangePinRequest;
import com.digitalbanking.domain.dto.request.SetupPinRequest;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.UserEntity;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.repository.CustomerRepository;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CustomerPinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "CUSTOMER-PIN-SERVICE")
public class CustomerPinServiceImpl implements CustomerPinService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final CustomerRepository customerRepository;
    private final SecurityUtils securityUtils;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void setupPin(SetupPinRequest request) {
        CustomerEntity customer = getCurrentCustomer();

        if (customer.getTransactionPinHash() != null) {
            throw new BusinessException(ErrorCode.TRANSACTION_PIN_ALREADY_SETUP);
        }

        if (!request.getPin().equals(request.getConfirmPin())) {
            throw new BusinessException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        customer.setTransactionPinHash(passwordEncoder.encode(request.getPin()));
        customer.setPinFailedAttempts(0);
        customer.setPinLockedUntil(null);
        customerRepository.save(customer);

        log.info("Transaction PIN created for customer: {}", customer.getCustomerCode());
    }

    @Override
    @Transactional
    public void changePin(ChangePinRequest request) {
        CustomerEntity customer = getCurrentCustomer();

        checkPinLocked(customer);

        if (customer.getTransactionPinHash() == null) {
            throw new BusinessException(ErrorCode.TRANSACTION_PIN_NOT_SET);
        }

        if (!passwordEncoder.matches(request.getCurrentPin(), customer.getTransactionPinHash())) {
            handleFailedPinAttempt(customer);
            throw new BusinessException(ErrorCode.INVALID_TRANSACTION_PIN);
        }

        if (!request.getNewPin().equals(request.getConfirmNewPin())) {
            throw new BusinessException(ErrorCode.PIN_NOT_MATCH);
        }

        customer.setTransactionPinHash(passwordEncoder.encode(request.getNewPin()));
        customer.setPinFailedAttempts(0);
        customer.setPinLockedUntil(null);
        customerRepository.save(customer);

        log.info("Transaction PIN updated successfully for customer: {}", customer.getCustomerCode());
    }

    @Override
    public void verifyPin(CustomerEntity customer, String rawPin) {
        checkPinLocked(customer);

        if (customer.getTransactionPinHash() == null) {
            throw new BusinessException(ErrorCode.TRANSACTION_PIN_NOT_SET);
        }

        if (!passwordEncoder.matches(rawPin, customer.getTransactionPinHash())) {
            handleFailedPinAttempt(customer);
            throw new BusinessException(ErrorCode.INVALID_TRANSACTION_PIN);
        }

        if (customer.getPinFailedAttempts() != null && customer.getPinFailedAttempts() > 0) {
            customer.setPinFailedAttempts(0);
            customer.setPinLockedUntil(null);
            customerRepository.save(customer);
        }
    }

    private void checkPinLocked(CustomerEntity customer) {
        if (customer.getPinLockedUntil() != null) {
            if (customer.getPinLockedUntil().isAfter(Instant.now())) {
                throw new BusinessException(ErrorCode.TRANSACTION_PIN_LOCKED);
            } else {
                customer.setPinLockedUntil(null);
                customer.setPinFailedAttempts(0);
                customerRepository.save(customer);
            }
        }
    }

    private void handleFailedPinAttempt(CustomerEntity customer) {
        int currentAttempts = (customer.getPinFailedAttempts() == null ? 0 : customer.getPinFailedAttempts()) + 1;
        customer.setPinFailedAttempts(currentAttempts);

        if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
            customer.setPinLockedUntil(Instant.now().plus(LOCK_MINUTES, ChronoUnit.MINUTES));
            customer.setPinFailedAttempts(0);
            log.warn("Customer {} transaction PIN locked for 15 minutes", customer.getCustomerCode());
        }

        customerRepository.save(customer);
    }

    private CustomerEntity getCurrentCustomer() {
        UserEntity currentUser = securityUtils.getCurrentUser();
        return customerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.CUSTOMER_NOT_FOUND));
    }
}
