package com.digitalbanking.service;

import java.util.UUID;

public interface TokenService {

    void revokeAllByUserId(UUID userID);

    int revokeByTokenHash(String tokenHash);
}
