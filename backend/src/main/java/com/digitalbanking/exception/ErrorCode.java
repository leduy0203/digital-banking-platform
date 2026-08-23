package com.digitalbanking.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 1. SYSTEM & GENERAL

    UNCATEGORIZED_EXCEPTION("SYS_001", "Uncategorized system error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY("SYS_002", "Invalid configuration or key", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR("SYS_003", "Invalid input data", HttpStatus.BAD_REQUEST),

    // 2. AUTHENTICATION & AUTHORIZATION

    UNAUTHENTICATED("AUTH_001", "Unauthenticated or session has expired", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("AUTH_002", "Access denied: insufficient permissions", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS("AUTH_003", "Invalid email or password", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("AUTH_004", "Authentication token has expired", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_INVALID("AUTH_005", "Refresh token is invalid or expired", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_REVOKED("AUTH_006", "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
    INVALID_OTP("AUTH_007", "Invalid or expired OTP code", HttpStatus.BAD_REQUEST),
    OTP_MAX_ATTEMPTS_EXCEEDED("AUTH_008", "Maximum OTP verification attempts exceeded", HttpStatus.BAD_REQUEST),

    // 3. USER & CUSTOMER

    USER_NOT_FOUND("USER_001", "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("USER_002", "Email or phone number is already registered", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("USER_003", "Email is already registered", HttpStatus.BAD_REQUEST),
    PHONE_NUMBER_ALREADY_EXISTS("USER_004", "Phone number is already registered", HttpStatus.BAD_REQUEST),
    USER_LOCKED("USER_005", "User account is locked", HttpStatus.FORBIDDEN),
    ACCOUNT_INACTIVE("USER_006", "Account is inactive or blocked", HttpStatus.UNAUTHORIZED),
    ROLE_NOT_FOUND("USER_007", "Default user role not found in system", HttpStatus.INTERNAL_SERVER_ERROR),
    CUSTOMER_NOT_FOUND("CUST_001", "Customer profile not found", HttpStatus.NOT_FOUND),
    KYC_NOT_VERIFIED("CUST_002", "Customer eKYC verification is required", HttpStatus.FORBIDDEN),
    NATIONAL_ID_ALREADY_EXISTS("USER_008", "National ID (CCCD/CMND) is already registered", HttpStatus.BAD_REQUEST),

    // 4. ACCOUNT & LEDGER

    ACCOUNT_NOT_FOUND("ACC_001", "Bank account not found", HttpStatus.NOT_FOUND),
    ACCOUNT_LOCKED("ACC_002", "Bank account is frozen or closed", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_FUNDS("ACC_003", "Insufficient available balance", HttpStatus.BAD_REQUEST),

    // 5. TRANSACTION & TRANSFER

    INVALID_TRANSFER_TARGET("TRF_001", "Source and destination accounts must be different", HttpStatus.BAD_REQUEST),
    TRANSACTION_LIMIT_EXCEEDED("TRF_002", "Transaction amount exceeds allowed limit", HttpStatus.BAD_REQUEST),
    DUPLICATE_IDEMPOTENCY_KEY("TRF_003", "Transaction is already being processed or completed", HttpStatus.CONFLICT),
    TRANSACTION_FAILED("TRF_004", "Transaction execution failed, please try again later", HttpStatus.INTERNAL_SERVER_ERROR),

    // 6. CARD

    CARD_NOT_FOUND("CARD_001", "Bank card not found", HttpStatus.NOT_FOUND),
    CARD_LOCKED("CARD_002", "Bank card is locked", HttpStatus.BAD_REQUEST),
    INVALID_PIN("CARD_003", "Invalid card PIN", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}