package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.InternalTransferConfirmRequest;
import com.digitalbanking.domain.dto.request.InternalTransferInitiateRequest;
import com.digitalbanking.domain.dto.response.TransactionResponse;
import com.digitalbanking.domain.dto.response.TransferInitiateResponse;

public interface TransferService {

    TransferInitiateResponse initiateInternalTransfer(InternalTransferInitiateRequest request);

    TransactionResponse confirmInternalTransfer(InternalTransferConfirmRequest request);
}
