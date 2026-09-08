package com.digitalbanking.service;

import com.digitalbanking.domain.dto.response.AccountResponse;

import java.util.List;
import java.util.UUID;

public interface AccountService {
    List<AccountResponse> getMyAccounts(UUID currentUserId);
}
