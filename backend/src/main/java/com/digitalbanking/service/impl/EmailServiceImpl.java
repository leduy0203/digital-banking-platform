package com.digitalbanking.service.impl;

import com.digitalbanking.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "EMAIL-SERVICE")
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendOtpEmail(String email, String otp) {
        // Implement OTP email sending logic here
        log.info("Sending OTP email to: {}, OTP: {}", email, otp);
    }
}
