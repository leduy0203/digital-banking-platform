package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.ChangePinRequest;
import com.digitalbanking.domain.dto.request.SetupPinRequest;
import com.digitalbanking.domain.entity.CustomerEntity;

public interface CustomerPinService {

    void setupPin(SetupPinRequest request);

    void changePin(ChangePinRequest request);

    void verifyPin(CustomerEntity customer, String rawPin);
}
