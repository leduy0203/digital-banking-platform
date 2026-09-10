 package com.digitalbanking.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j(topic = "RATE-LIMIT")
public class Bucket4jRateLimiterService {

    private static final int REQUEST_LIMIT = 30;
    private static final Duration REQUEST_REFILL_PERIOD = Duration.ofMinutes(1);

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final Duration ACCOUNT_LOCK_DURATION = Duration.ofMinutes(15);

    private final Map<String, Bucket> rateLimitBuckets = new ConcurrentHashMap<>();
    private final Map<String, Integer> failedAttempts = new ConcurrentHashMap<>();
    private final Map<String, Instant> lockedAccounts = new ConcurrentHashMap<>();

    /**
     * Checks whether the client has exceeded the request limit.
     *
     * @param clientIp client IP address
     * @return true if the client is rate limited
     */
    public boolean isRateLimited(String clientIp) {
        Bucket bucket = rateLimitBuckets.computeIfAbsent(
                clientIp,
                key -> createRateLimitBucket()
        );

        return !bucket.tryConsume(1);
    }

    /**
     * Checks whether an account is temporarily locked.
     *
     * @param username account username
     * @return true if the account is currently locked
     */
    public boolean isAccountLocked(String username) {
        Instant unlockAt = lockedAccounts.get(username);

        if (unlockAt == null) {
            return false;
        }

        if (Instant.now().isAfter(unlockAt)) {
            unlockAccount(username);
            return false;
        }

        return true;
    }

    /**
     * Records a failed authentication attempt.
     *
     * @param username account username
     * @return current number of failed attempts
     */
    public int recordFailedAttempt(String username) {
        int attempts = failedAttempts.merge(username, 1, Integer::sum);

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            lockAccount(username);
        }

        return attempts;
    }

    /**
     * Clears failed attempts and removes any temporary account lock.
     *
     * @param username account username
     */
    public void resetFailedAttempts(String username) {
        failedAttempts.remove(username);
        lockedAccounts.remove(username);
    }

    private Bucket createRateLimitBucket() {
        Bandwidth limit = Bandwidth.builder()
                .capacity(REQUEST_LIMIT)
                .refillIntervally(REQUEST_LIMIT, REQUEST_REFILL_PERIOD)
                .build();

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private void lockAccount(String username) {
        Instant unlockAt = Instant.now().plus(ACCOUNT_LOCK_DURATION);

        lockedAccounts.put(username, unlockAt);

        log.warn(
                "Account temporarily locked after reaching {} failed login attempts. username={}, unlockAt={}",
                MAX_FAILED_ATTEMPTS,
                username,
                unlockAt
        );
    }

    private void unlockAccount(String username) {
        lockedAccounts.remove(username);
        failedAttempts.remove(username);

        log.info("Temporary account lock expired. username={}", username);
    }
}
