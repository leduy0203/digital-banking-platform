package com.digitalbanking.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

public interface CloudinaryService {

    Map<String, String> uploadTempKycImage(MultipartFile file, UUID userId, String docType);

    String moveToOfficialKycFolder(String tempPublicId, UUID customerId, String docType);
}
