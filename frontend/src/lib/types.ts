/**
 * Global Banking Types
 */

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'PAYROLL';
  balance: number;
  availableBalance: number;
  currency: string;
  isDefault: boolean;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  createdAt: string;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  currency: string;
  description?: string;
}

export type TransactionStatus = 'COMPLETED' | 'PENDING_OTP' | 'FAILED' | 'REJECTED';

export interface TransferReceipt {
  transactionReference: string;
  sourceAccountNumber: string;
  targetAccountNumber: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
  executedAt: string;
  otpExpiresInSeconds?: number;
}

export interface OtpVerificationPayload {
  transactionReference: string;
  otpCode: string;
}

export interface Beneficiary {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  nickname?: string;
  isFavorite: boolean;
}

export interface CreateBeneficiaryPayload {
  accountNumber: string;
  accountName: string;
  bankName: string;
  nickname?: string;
}

export interface CreateSavingsContractPayload {
  sourceAccountNumber: string;
  depositAmount: number;
  termMonths: number;
  autoRollover: boolean;
}

export interface SavingsContractReceipt {
  contractNumber: string;
  sourceAccountNumber: string;
  principalAmount: number;
  termMonths: number;
  interestRate: number;
  estimatedInterestEarned: number;
  maturityDate: string;
  createdAt: string;
}
