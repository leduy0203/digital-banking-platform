import { BankAccount, Beneficiary } from "../types";

export const mockCustomerAccounts: BankAccount[] = [
  {
    id: "acc-1",
    accountNumber: "9333436513",
    accountName: "Tài Khoản Thanh Toán Mặc Định",
    accountType: "CHECKING",
    balance: 125500000,
    availableBalance: 125500000,
    currency: "VND",
    isDefault: true,
    status: "ACTIVE",
    createdAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "acc-2",
    accountNumber: "8880987654",
    accountName: "Tài Khoản Tiết Kiệm Tích Lũy",
    accountType: "SAVINGS",
    balance: 50000.0,
    availableBalance: 50000.0,
    currency: "USD",
    isDefault: false,
    status: "ACTIVE",
    createdAt: "2025-03-10T10:30:00Z",
  },
];

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: "ben-1",
    accountNumber: "8880987654",
    accountName: "NGUYEN VAN A",
    bankName: "Digital Bank Core",
    nickname: "Bạn Thân",
    isFavorite: true,
  },
  {
    id: "ben-2",
    accountNumber: "9991234567",
    accountName: "TRAN THI B",
    bankName: "Digital Bank Core",
    nickname: "Đối Tác Kinh Doanh",
    isFavorite: false,
  },
];
