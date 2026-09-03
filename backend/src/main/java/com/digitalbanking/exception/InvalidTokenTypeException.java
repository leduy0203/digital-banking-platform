package com.digitalbanking.exception;

import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class InvalidTokenTypeException extends AuthenticationException {
    private final ErrorCode errorCode;

    public InvalidTokenTypeException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public InvalidTokenTypeException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
