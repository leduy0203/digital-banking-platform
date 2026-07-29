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
  status: "PENDING" | "APPROVED" | "REJECTED";
  frontImg: string;
  backImg: string;
  selfieImg: string;
  rejectReason?: string;
}

export interface CustomerAccount {
  accountNumber: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  currency: string;
  status: "ACTIVE" | "FROZEN" | "DEBIT_LOCKED";
}

export interface Customer360 {
  cif: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  registeredDate: string;
  kycStatus: "VERIFIED" | "PENDING" | "REJECTED";
  address: string;
  accounts: CustomerAccount[];
}

export interface AccountItem {
  accountNumber: string;
  cif: string;
  customerName: string;
  accountType: "CHECKING" | "SAVINGS";
  balance: number;
  status: "ACTIVE" | "FROZEN" | "DEBIT_LOCKED";
  frozenReason?: string;
  refCode?: string;
  updatedAt: string;
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
