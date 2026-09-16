export type KycStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycDocumentResponse {
  id: string;
  status: KycStatus;
  frontIdCardUrl: string;
  backIdCardUrl: string;
  selfiePhotoUrl: string;
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedByEmployeeCode?: string;
  verifiedByEmployeeName?: string;
  customerId?: string;
  customerCode?: string;
  fullName: string;
  nationalId: string;
  dateOfBirth?: string;
  address?: string;
  email: string;
  phoneNumber: string;
}

export interface KycFilterPayload {
  keyword?: string;
  status?: KycStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface KycApplication {
  id: string;
  cif: string;
  fullName: string;
  dob: string;
  idNumber: string;
  issueDate: string;
  address: string;
  phone: string;
  email: string;
  aiScore: number;
  submittedAt: string;
  status: "PENDING" | "VERIFIED" | "APPROVED" | "REJECTED";
  frontImg: string;
  backImg: string;
  selfieImg: string;
  rejectReason?: string;
}

export interface CustomerAccount {
  accountNumber: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  frozenBalance?: number;
  availableBalance?: number;
  currency: string;
  status: "ACTIVE" | "FROZEN" | "CLOSED" | "DEBIT_LOCKED";
  isDefault?: boolean;
  openedAt?: string;
}

export interface CustomerSummaryItem {
  id: string;
  customerCode: string;
  fullName: string;
  nationalId: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
  userStatus?: "ACTIVE" | "BLOCKED";
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  createdAt: string;
}

export interface CustomerDetailView {
  customerId: string;
  customerCode: string;
  fullName: string;
  nationalId: string;
  dateOfBirth?: string;
  address?: string;
  avatarUrl?: string;
  email?: string;
  phoneNumber?: string;
  userStatus?: "ACTIVE" | "BLOCKED";
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  kycSubmittedAt?: string;
  kycVerifiedAt?: string;
  totalBalance: number;
  totalAccounts: number;
  accounts: CustomerAccount[];
  createdAt: string;
  updatedAt?: string;
}

export interface Customer360 {
  cif: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  avatarUrl?: string;
  registeredDate: string;
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED" | "NOT_SUBMITTED";
  address: string;
  accounts: CustomerAccount[];
}

export interface AccountItem {
  id?: string;
  accountNumber: string;
  cif: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  frozenBalance?: number;
  availableBalance?: number;
  currency?: string;
  status: "ACTIVE" | "FROZEN" | "BLOCKED" | "CLOSED" | "DEBIT_LOCKED";
  isDefault?: boolean;
  openedAt?: string;
  closedAt?: string | null;
  frozenReason?: string;
  refCode?: string;
  updatedAt: string;
}

export interface AccountFilterPayload {
  keyword?: string;
  status?: string;
  accountType?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface FreezeAccountPayload {
  accountNumber: string;
  lockType: "FROZEN" | "DEBIT_LOCKED";
  reason: string;
  refCode?: string;
}

export interface CashOpPayload {
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  accountNumber: string;
  amount: number;
  depositorName?: string;
  otp?: string;
}

export interface EmployeeTransaction {
  id: string;
  txHash: string;
  senderAcc: string;
  senderName: string;
  receiverAcc: string;
  receiverName: string;
  amount: number;
  type: "TRANSFER" | "DEPOSIT" | "WITHDRAW";
  status: "SUCCESS" | "PENDING" | "FAILED" | "REVERSED";
  timestamp: string;
  canRollback: boolean;
  rollbackReason?: string;
}

export interface EmployeeDashboardStats {
  totalCustomers: number;
  customerGrowthPercent: number;
  todayTransactionVolume: number;
  todayTransactionCount: number;
  pendingKycCount: number;
  frozenAccountCount: number;
}
