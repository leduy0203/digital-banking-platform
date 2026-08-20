package com.digitalbanking.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j(topic = "GLOBAL_EXCEPTION_HANDLER")
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetail> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("Business Exception triggered on [{}]: {} - {}", request.getRequestURI()
                , ex.getErrorCode().getCode(), ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.getErrorCode().getHttpStatus(), ex.getMessage());
        problem.setType(URI.create("https://digitalbank.vn/errors/" + ex.getErrorCode().getCode()));
        problem.setTitle(ex.getErrorCode().name());
        problem.setProperty("errorCode", ex.getErrorCode().getCode());
        problem.setProperty("timestamp", Instant.now());
        problem.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity.status(ex.getErrorCode().getHttpStatus()).body(problem);
    }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleAuthenticationException(
            AuthenticationException ex,
            HttpServletRequest request
    ) {
        log.warn("Authentication Exception on [{}]: {}", request.getRequestURI(), ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                ErrorCode.UNAUTHENTICATED.getHttpStatus(),
                ErrorCode.UNAUTHENTICATED.getMessage()
        );

        problem.setType(URI.create("https://digitalbank.vn/errors/" + ErrorCode.UNAUTHENTICATED.getCode()));
        problem.setTitle(ErrorCode.UNAUTHENTICATED.name());
        problem.setProperty("errorCode", ErrorCode.UNAUTHENTICATED.getCode());
        problem.setProperty("timestamp", Instant.now());
        problem.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity.status(ErrorCode.UNAUTHENTICATED.getHttpStatus()).body(problem);
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(
            AccessDeniedException ex
            , HttpServletRequest request
    ) {
        log.warn("Access Denied on [{}]: {}", request.getRequestURI(), ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                ErrorCode.UNAUTHORIZED.getHttpStatus(),
                ErrorCode.UNAUTHORIZED.getMessage()
        );

        problem.setType(URI.create("https://digitalbank.vn/errors/" + ErrorCode.UNAUTHORIZED.getCode()));
        problem.setTitle(ErrorCode.UNAUTHORIZED.name());
        problem.setProperty("errorCode", ErrorCode.UNAUTHORIZED.getCode());
        problem.setProperty("timestamp", Instant.now());
        problem.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity.status(ErrorCode.UNAUTHORIZED.getHttpStatus()).body(problem);
    }


    @Override
    @Nullable
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, "Input validation failed");
        problem.setType(URI.create("https://digitalbank.vn/errors/VALIDATION_ERROR"));
        problem.setTitle("VALIDATION_ERROR");
        problem.setProperty("errorCode", ErrorCode.VALIDATION_ERROR.getCode());
        problem.setProperty("errors", errors);
        problem.setProperty("timestamp", Instant.now());

        if (request instanceof ServletWebRequest servletWebRequest) {
            problem.setInstance(URI.create(servletWebRequest.getRequest().getRequestURI()));
        }

        return createResponseEntity(problem, headers, status, request);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Internal Server Error on [{}]: ", request.getRequestURI(), ex);

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                ErrorCode.UNCATEGORIZED_EXCEPTION.getHttpStatus(),
                ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage()
        );

        problem.setType(URI.create("https://digitalbank.vn/errors/" + ErrorCode.UNCATEGORIZED_EXCEPTION.getCode()));
        problem.setTitle("INTERNAL_SERVER_ERROR");
        problem.setProperty("errorCode", ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        problem.setProperty("timestamp", Instant.now());
        problem.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity.internalServerError().body(problem);
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ProblemDetail> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        log.warn("Database Constraint Violation on [{}]: {}", request.getRequestURI(), ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                org.springframework.http.HttpStatus.CONFLICT,
                "Resource already exists or violates database integrity constraints"
        );

        problem.setTitle("DATA_INTEGRITY_VIOLATION");
        problem.setProperty("errorCode", "SYS_CONFLICT");
        problem.setProperty("timestamp", Instant.now());
        problem.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT).body(problem);
    }
}
