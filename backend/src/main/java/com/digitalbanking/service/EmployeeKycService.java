package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.KycFilterRequest;
import com.digitalbanking.domain.dto.request.RejectKycRequest;
import com.digitalbanking.domain.dto.response.KycDocumentResponse;
import com.digitalbanking.domain.dto.response.PageResponse;

import java.util.UUID;

public interface EmployeeKycService {

    PageResponse<KycDocumentResponse> getPendingKycs(KycFilterRequest filterRequest);

    KycDocumentResponse getKycDetail(UUID kycId);

    KycDocumentResponse approveKyc(UUID kycId);

    KycDocumentResponse rejectKyc(UUID kycId, RejectKycRequest request);
}
