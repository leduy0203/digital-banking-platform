import { 
  KycApplication, 
  Customer360, 
  AccountItem, 
  EmployeeTransaction, 
  EmployeeDashboardStats 
} from "../types/employee";

export const mockDashboardStats: EmployeeDashboardStats = {
  totalCustomers: 124580,
  customerGrowthPercent: 12.4,
  todayTransactionVolume: 45200000000,
  todayTransactionCount: 1420,
  pendingKycCount: 28,
  frozenAccountCount: 5,
};

export const mockKycList: KycApplication[] = [
  {
    id: "KYC-001",
    cif: "CIF-90124",
    fullName: "Trần Thị Bích Ngọc",
    dob: "15/08/1995",
    idNumber: "079201998812",
    issueDate: "20/04/2021",
    address: "124 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    phone: "0908123456",
    email: "bichngoc.tran@gmail.com",
    aiScore: 98.5,
    submittedAt: "10:25 AM - 29/07/2026",
    status: "PENDING",
    frontImg: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=500&auto=format&fit=crop&q=60",
    backImg: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60",
    selfieImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "KYC-002",
    cif: "CIF-90125",
    fullName: "Lê Văn Hùng",
    dob: "22/11/1991",
    idNumber: "031092883491",
    issueDate: "12/01/2019",
    address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    phone: "0912345678",
    email: "hung.levan@yahoo.com",
    aiScore: 72.1,
    submittedAt: "10:30 AM - 29/07/2026",
    status: "PENDING",
    frontImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
    backImg: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60",
    selfieImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "KYC-003",
    cif: "CIF-90126",
    fullName: "Phạm Hoàng Nam",
    dob: "04/03/1988",
    idNumber: "001095001293",
    issueDate: "05/09/2022",
    address: "88 Trần Hưng Đạo, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
    phone: "0987654321",
    email: "hoangnam.pham@outlook.com",
    aiScore: 95.0,
    submittedAt: "11:15 AM - 29/07/2026",
    status: "PENDING",
    frontImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
    backImg: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60",
    selfieImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60",
  }
];

export const mockCustomersList: Customer360[] = [
  {
    cif: "CIF-90124",
    fullName: "Trần Thị Bích Ngọc",
    phone: "0908123456",
    email: "bichngoc.tran@gmail.com",
    idNumber: "079201998812",
    registeredDate: "15/01/2024",
    kycStatus: "VERIFIED",
    address: "124 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    accounts: [
      { accountNumber: "1019283746", accountType: "CHECKING", balance: 145200000, currency: "VND", status: "ACTIVE" },
      { accountNumber: "SAV-889102", accountType: "SAVINGS", balance: 500000000, currency: "VND", status: "ACTIVE" },
    ]
  },
  {
    cif: "CIF-90125",
    fullName: "Lê Văn Hùng",
    phone: "0912345678",
    email: "hung.levan@yahoo.com",
    idNumber: "031092883491",
    registeredDate: "10/03/2024",
    kycStatus: "PENDING",
    address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    accounts: [
      { accountNumber: "1028374651", accountType: "CHECKING", balance: 28500000, currency: "VND", status: "ACTIVE" }
    ]
  },
  {
    cif: "CIF-90126",
    fullName: "Phạm Hoàng Nam",
    phone: "0987654321",
    email: "hoangnam.pham@outlook.com",
    idNumber: "001095001293",
    registeredDate: "05/06/2025",
    kycStatus: "VERIFIED",
    address: "88 Trần Hưng Đạo, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh",
    accounts: [
      { accountNumber: "1039485762", accountType: "CHECKING", balance: 12500000, currency: "VND", status: "FROZEN" }
    ]
  }
];

export const mockAccountsList: AccountItem[] = [
  {
    accountNumber: "1019283746",
    cif: "CIF-90124",
    customerName: "Trần Thị Bích Ngọc",
    accountType: "CHECKING",
    balance: 145200000,
    status: "ACTIVE",
    updatedAt: "25/07/2026 14:20",
  },
  {
    accountNumber: "1039485762",
    cif: "CIF-90126",
    customerName: "Phạm Hoàng Nam",
    accountType: "CHECKING",
    balance: 12500000,
    status: "FROZEN",
    frozenReason: "Khách hàng báo mất thiết bị đăng nhập & nghi vấn gian lận",
    refCode: "CV-2026/8812-BCA",
    updatedAt: "28/07/2026 09:15",
  },
  {
    accountNumber: "1028374651",
    cif: "CIF-90125",
    customerName: "Lê Văn Hùng",
    accountType: "CHECKING",
    balance: 28500000,
    status: "ACTIVE",
    updatedAt: "20/07/2026 11:30",
  }
];

export const mockTransactionsList: EmployeeTransaction[] = [
  {
    id: "TX-1001",
    txHash: "FT20268819203",
    senderAcc: "1019283746",
    senderName: "Trần Thị Bích Ngọc",
    receiverAcc: "1028374651",
    receiverName: "Lê Văn Hùng",
    amount: 15000000,
    type: "TRANSFER",
    status: "SUCCESS",
    timestamp: "29/07/2026 10:20:15",
    canRollback: true,
  },
  {
    id: "TX-1002",
    txHash: "FT20268819204",
    senderAcc: "1028374651",
    senderName: "Lê Văn Hùng",
    receiverAcc: "CASH-COUNTER",
    receiverName: "Nạp tiền mặt tại quầy",
    amount: 50000000,
    type: "DEPOSIT",
    status: "SUCCESS",
    timestamp: "29/07/2026 09:45:00",
    canRollback: false,
  },
  {
    id: "TX-1003",
    txHash: "FT20268819205",
    senderAcc: "1039485762",
    senderName: "Phạm Hoàng Nam",
    receiverAcc: "9908123456",
    receiverName: "Nguyễn Minh Châu",
    amount: 2000000,
    type: "TRANSFER",
    status: "PENDING",
    timestamp: "29/07/2026 11:05:22",
    canRollback: true,
  }
];
