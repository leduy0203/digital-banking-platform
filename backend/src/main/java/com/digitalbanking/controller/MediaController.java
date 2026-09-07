package com.digitalbanking.controller;

import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.security.Bucket4jRateLimiterService;
import com.digitalbanking.security.SecurityUtils;
import com.digitalbanking.service.CloudinaryService;
import com.digitalbanking.utils.FileValidator;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@Slf4j(topic = "MEDIA-CONTROLLER")
public class MediaController {

    private final CloudinaryService cloudinaryService;
    private final FileValidator fileValidator;
    private final Bucket4jRateLimiterService rateLimiterService;
    private final SecurityUtils securityUtils;

    @PostMapping(value = "/kyc/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Map<String, String>> uploadKycImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("docType") String docType, // "front_card" | "back_card" | "selfie"
            HttpServletRequest request
    ) {
        log.info("Uploading KYC image");

        String clientIp = getClientIp(request);
        if (!rateLimiterService.tryConsume(clientIp)) {
            throw new BusinessException(ErrorCode.TOO_MANY_REQUESTS);
        }

        fileValidator.validateKycImage(file);

        UUID currentUserId = securityUtils.getCurrentUserId();
        Map<String, String> uploadResult = cloudinaryService.uploadTempKycImage(file, currentUserId, docType);

        return ApiResponse.ok("Upload successfully", uploadResult);
    }


    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
