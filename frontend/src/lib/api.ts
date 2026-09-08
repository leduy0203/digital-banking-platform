import { apiClient } from './axios';
import { 
  BankAccount, 
  TransferRequest, 
  TransferReceipt, 
  OtpVerificationPayload, 
  Beneficiary, 
  CreateBeneficiaryPayload,
  CreateSavingsContractPayload,
  SavingsContractReceipt
} from './types';
import { mockCustomerAccounts, mockBeneficiaries } from './mock/customerData';

export { employeeApi } from './api/employeeApi';
export { adminApi } from './api/adminApi';
export { authApi } from './api/authApi';
export { mediaApi } from './api/mediaApi';
export { customerApi } from './api/customerApi';
export type { RegisterPayload, RegisterResponse, SendOtpPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse, LoginPayload, LoginResponse, AuthResponseData, UserSummary } from './api/authApi';
export type { UploadKycImageResponse, KycDocType } from './api/mediaApi';
export type { CustomerOnboardingPayload, CustomerProfile, CustomerResponse, UpdateProfilePayload } from './api/customerApi';

export * from './types/employee';
export * from './types/admin';


export { accountApi } from './api/accountApi';
export type { AccountResponseData, AccountsListResponse } from './api/accountApi';

export const transferApi = {
  async executeTransfer(payload: TransferRequest): Promise<TransferReceipt> {
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'IDEM-' + Date.now();

    try {
      const res = await apiClient.post<{ data: TransferReceipt }>('/transfers', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
      return res.data.data;
    } catch {
      return {
        transactionReference: 'FT-' + Math.floor(100000 + Math.random() * 900000),
        sourceAccountNumber: payload.sourceAccountNumber,
        targetAccountNumber: payload.targetAccountNumber,
        amount: payload.amount,
        fee: 0,
        executedAt: new Date().toISOString(),
        status: 'COMPLETED',
      };
    }
  },

  async verifyOtp(payload: OtpVerificationPayload): Promise<TransferReceipt> {
    try {
      const res = await apiClient.post<{ data: TransferReceipt }>('/transfers/verify-otp', payload);
      return res.data.data;
    } catch {
      return {
        transactionReference: payload.transactionReference,
        sourceAccountNumber: '9333436513',
        targetAccountNumber: '8880987654',
        amount: 500000,
        fee: 0,
        executedAt: new Date().toISOString(),
        status: 'COMPLETED',
      };
    }
  },
};

export const beneficiaryApi = {
  async getBeneficiaries(): Promise<Beneficiary[]> {
    try {
      const res = await apiClient.get<{ data: Beneficiary[] }>('/beneficiaries');
      return res.data.data;
    } catch {
      return mockBeneficiaries;
    }
  },

  async addBeneficiary(payload: CreateBeneficiaryPayload): Promise<Beneficiary> {
    try {
      const res = await apiClient.post<{ data: Beneficiary }>('/beneficiaries', payload);
      return res.data.data;
    } catch {
      return {
        id: 'ben-' + Date.now(),
        accountNumber: payload.accountNumber,
        accountName: payload.accountName,
        bankName: payload.bankName || 'Digital Bank Core',
        nickname: payload.nickname,
        isFavorite: false,
      };
    }
  },
};

export const savingsApi = {
  async openSavingsContract(payload: CreateSavingsContractPayload): Promise<SavingsContractReceipt> {
    try {
      const res = await apiClient.post<{ data: SavingsContractReceipt }>('/savings', payload);
      return res.data.data;
    } catch {
      const estimatedInterest = (payload.depositAmount * 0.058 * payload.termMonths) / 12;
      return {
        contractNumber: 'SAV-' + Math.floor(100000 + Math.random() * 900000),
        sourceAccountNumber: payload.sourceAccountNumber,
        principalAmount: payload.depositAmount,
        termMonths: payload.termMonths,
        interestRate: 5.8,
        estimatedInterestEarned: estimatedInterest,
        maturityDate: new Date(Date.now() + payload.termMonths * 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };
    }
  },
};
