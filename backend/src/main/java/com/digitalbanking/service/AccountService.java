package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.OpenAccountRequest;
import com.digitalbanking.domain.dto.response.AccountLookupResponse;
import com.digitalbanking.domain.dto.response.AccountResponse;
import com.digitalbanking.domain.enums.AccountStatus;

import java.util.List;
import java.util.UUID;

public interface AccountService {

    List<AccountResponse> getMyAccounts(UUID currentUserId);

    AccountResponse getAccountBalance(String accountNumber, UUID currentUserId);

    AccountLookupResponse lookupAccount(String accountNumber);

    // for employee

    AccountResponse openAccount(OpenAccountRequest request);

    AccountResponse updateAccountStatus(String accountNumber, AccountStatus status);
}
