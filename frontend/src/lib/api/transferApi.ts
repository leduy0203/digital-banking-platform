import { apiClient } from '../axios';

export interface InternalTransferInitiatePayload {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  description?: string;
}

export interface TransferInitiateResponseData {
  transactionCode: string;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  targetAccountName: string;
  amount: number;
  feeAmount: number;
  description?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  expiresInSeconds: number;
}

export interface InternalTransferInitiateApiResponse {
  success: boolean;
  message: string;
  data: TransferInitiateResponseData;
  timestamp: string;
}

export interface InternalTransferConfirmPayload {
  transactionCode: string;
  otpCode: string; // 6-digit Smart PIN
}

export interface TransactionResponseData {
  id: string;
  transactionCode: string;
  sourceAccountNumber: string;
  sourceAccountName?: string;
  targetAccountNumber: string;
  targetAccountName?: string;
  targetBankCode?: string;
  targetBankName?: string;
  amount: number;
  feeAmount: number;
  description?: string;
  transactionType: 'INTERNAL_TRANSFER' | 'EXTERNAL_TRANSFER' | 'BILL_PAYMENT' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  completedAt?: string;
  createdAt: string;
}

export interface InternalTransferConfirmApiResponse {
  success: boolean;
  message: string;
  data: TransactionResponseData;
  timestamp: string;
}

export const transferApi = {
  /**
   * POST /api/v1/transfers/internal/initiate
   * Step 1: Initiate internal money transfer
   */
  async initiateInternalTransfer(payload: InternalTransferInitiatePayload): Promise<InternalTransferInitiateApiResponse> {
    const res = await apiClient.post<InternalTransferInitiateApiResponse>('/transfers/internal/initiate', payload);
    return res.data;
  },

  /**
   * POST /api/v1/transfers/internal/confirm
   * Step 2: Confirm internal money transfer with 6-digit Smart PIN
   */
  async confirmInternalTransfer(payload: InternalTransferConfirmPayload): Promise<InternalTransferConfirmApiResponse> {
    const res = await apiClient.post<InternalTransferConfirmApiResponse>('/transfers/internal/confirm', payload);
    return res.data;
  },
};
