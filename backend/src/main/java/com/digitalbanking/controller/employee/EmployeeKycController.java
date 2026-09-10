package com.digitalbanking.controller.employee;

import com.digitalbanking.domain.dto.request.KycFilterRequest;
import com.digitalbanking.domain.dto.request.RejectKycRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.KycDocumentResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.service.EmployeeKycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employee/kyc")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-KYC-CONTROLLER")
public class EmployeeKycController {

    private final EmployeeKycService employeeKycService;

    @GetMapping("/pending")
    public ApiResponse<PageResponse<KycDocumentResponse>> getPendingKycs(
            @Valid KycFilterRequest filterRequest) {

        log.info("Fetching pending KYC requests: {}", filterRequest);

        PageResponse<KycDocumentResponse> response = employeeKycService.getPendingKycs(filterRequest);

        return ApiResponse.ok("Pending KYC documents retrieved successfully", response);
    }

    @GetMapping("/{id}")
    public ApiResponse<KycDocumentResponse> getKycDetail(@PathVariable UUID id) {

        log.info("Fetching KYC detail for ID: {}", id);

        KycDocumentResponse response = employeeKycService.getKycDetail(id);

        return ApiResponse.ok("KYC document detail retrieved successfully", response);
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<KycDocumentResponse> approveKyc(@PathVariable UUID id) {

        log.info("Approving KYC document ID: {}", id);

        KycDocumentResponse response = employeeKycService.approveKyc(id);

        return ApiResponse.ok("KYC document approved successfully", response);
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<KycDocumentResponse> rejectKyc(
            @PathVariable UUID id,
            @Valid @RequestBody RejectKycRequest request) {

        log.info("Rejecting KYC document ID: {} with reason: {}", id, request.getReason());

        KycDocumentResponse response = employeeKycService.rejectKyc(id, request);

        return ApiResponse.ok("KYC document rejected successfully", response);
    }
}
