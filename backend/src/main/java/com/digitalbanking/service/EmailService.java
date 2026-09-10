package com.digitalbanking.service;

public interface EmailService {

    void sendOtpEmail(String email, String otp);

    void sendKycApprovedEmail(String toEmail, String customerName);

    void sendKycRejectedEmail(String toEmail, String customerName, String reason);

}
