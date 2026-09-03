package com.digitalbanking.service;

public interface EmailService {
    void sendOtpEmail(String email, String otp);
}
