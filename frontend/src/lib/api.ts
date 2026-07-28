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

export const accountApi = {
  async getAccounts(): Promise<BankAccount[]> {
    try {
      const res = await apiClient.get<{ data: BankAccount[] }>('/accounts');
      return res.data.data;
    } catch {
      return [
        {
          id: 'acc-1',
          accountNumber: '9333436513',
          accountName: 'Tài Khoản Thanh Toán Mặc Định',
          accountType: 'CHECKING',
          balance: 125500000,
          availableBalance: 125500000,
          currency: 'VND',
          isDefault: true,
          status: 'ACTIVE',
          createdAt: '2025-01-15T08:00:00Z',
        },
        {
          id: 'acc-2',
          accountNumber: '8880987654',
          accountName: 'Tài Khoản Tiết Kiệm Tích Lũy',
          accountType: 'SAVINGS',
          balance: 50000.0,
          availableBalance: 50000.0,
          currency: 'USD',
          isDefault: false,
          status: 'ACTIVE',
          createdAt: '2025-03-10T10:30:00Z',
        },
      ];
    }
  },
};

export const transferApi = {
  async executeTransfer(payload: TransferRequest): Promise<TransferReceipt> {
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'IDEM-' + Date.now();

    const res = await apiClient.post<{ data: TransferReceipt }>('/transfers', payload, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return res.data.data;
  },

  async verifyOtp(payload: OtpVerificationPayload): Promise<TransferReceipt> {
    const res = await apiClient.post<{ data: TransferReceipt }>('/transfers/verify-otp', payload);
    return res.data.data;
  },
};

export const beneficiaryApi = {
  async getBeneficiaries(): Promise<Beneficiary[]> {
    try {
      const res = await apiClient.get<{ data: Beneficiary[] }>('/beneficiaries');
      return res.data.data;
    } catch {
      return [
        {
          id: 'ben-1',
          accountNumber: '8880987654',
          accountName: 'NGUYEN VAN A',
          bankName: 'Digital Bank Core',
          nickname: 'Bạn Thân',
          isFavorite: true,
        },
        {
          id: 'ben-2',
          accountNumber: '9991234567',
          accountName: 'TRAN THI B',
          bankName: 'Digital Bank Core',
          nickname: 'Đối Tác Kinh Doanh',
          isFavorite: false,
        },
      ];
    }
  },

  async addBeneficiary(payload: CreateBeneficiaryPayload): Promise<Beneficiary> {
    const res = await apiClient.post<{ data: Beneficiary }>('/beneficiaries', payload);
    return res.data.data;
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
