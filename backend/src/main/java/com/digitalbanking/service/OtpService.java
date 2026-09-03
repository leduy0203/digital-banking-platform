package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.SendOtpRequest;
import com.digitalbanking.domain.dto.request.VerifyOtpRequest;

public interface OtpService {

    void sendOtp(SendOtpRequest request);

    boolean verifyOtp(VerifyOtpRequest request);
}
