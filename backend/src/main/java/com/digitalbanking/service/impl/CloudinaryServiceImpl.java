package com.digitalbanking.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.digitalbanking.exception.BusinessException;
import com.digitalbanking.exception.ErrorCode;
import com.digitalbanking.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "CLOUDINARY-SERVICE")
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, String> uploadTempKycImage(MultipartFile file, UUID userId, String docType) {
        try {
            String folder = "digital_banking/temp/kyc/" + userId;
            String fileName = docType + "_" + System.currentTimeMillis();

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", fileName,
                    "overwrite", true,
                    "resource_type", "image"
            ));

            log.info("Upload temp KYC image: {}", result.get("public_id"));
            return Map.of(
                    "publicId", (String) result.get("public_id"),
                    "url", (String) result.get("secure_url")
            );
        } catch (IOException e) {
            log.error("Error upload image !!: ", e);
            throw new BusinessException(ErrorCode.EXTERNAL_SERVICE_ERROR, "Cannot upload image to storage.");
        }
    }

    @Override
    public String moveToOfficialKycFolder(String urlOrPublicId, UUID customerId, String docType) {

        String sourcePublicId = extractPublicId(urlOrPublicId);

        if (!StringUtils.hasText(sourcePublicId)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Invalid image URL or Public ID");
        }

        String targetPublicId = "digital_banking/kyc/" + customerId + "/" + docType;

        try {
            log.info("Moving Cloudinary file from [{}] to [{}]", sourcePublicId, targetPublicId);
            Map<?, ?> result = cloudinary.uploader().rename(sourcePublicId, targetPublicId, ObjectUtils.asMap(
                    "overwrite", true,
                    "invalidate", true
            ));
            return (String) result.get("secure_url");
        } catch (IOException e) {
            log.error("Failed to rename file on Cloudinary. Source: {}, Target: {}", sourcePublicId, targetPublicId, e);
            throw new BusinessException(ErrorCode.EXTERNAL_SERVICE_ERROR, "Failed to move KYC image on cloud storage");
        }
    }

    public String extractPublicId(String urlOrPublicId) {
        if (!StringUtils.hasText(urlOrPublicId)) {
            return "";
        }
        String cleaned = urlOrPublicId.trim();
        if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
            return cleaned;
        }
        if (cleaned.contains("/upload/")) {
            String pathAfterUpload = cleaned.substring(cleaned.indexOf("/upload/") + 8);
            pathAfterUpload = pathAfterUpload.replaceFirst("^v[0-9]+/", "");

            int lastDot = pathAfterUpload.lastIndexOf('.');
            if (lastDot > 0) {
                pathAfterUpload = pathAfterUpload.substring(0, lastDot);
            }
            return pathAfterUpload;
        }
        return cleaned;
    }
}