import { apiClient } from "../axios";
import { 
  KycApplication, 
  Customer360, 
  AccountItem, 
  FreezeAccountPayload, 
  CashOpPayload, 
  EmployeeTransaction, 
  EmployeeDashboardStats 
} from "../types/employee";
import { 
  mockDashboardStats, 
  mockKycList, 
  mockCustomersList, 
  mockAccountsList, 
  mockTransactionsList 
} from "../mock/employeeData";

// In-memory state for mock fallback manipulation
let localKycList = [...mockKycList];
let localAccountsList = [...mockAccountsList];
let localTransactionsList = [...mockTransactionsList];

export const employeeApi = {
  /**
   * Lấy chỉ số tổng quan cho Teller Dashboard
   */
  async getDashboardStats(): Promise<EmployeeDashboardStats> {
    try {
      const res = await apiClient.get<{ data: EmployeeDashboardStats }>("/employee/dashboard/stats");
      return res.data.data;
    } catch {
      return mockDashboardStats;
    }
  },

  /**
   * Lấy danh sách hồ sơ eKYC cần thẩm định
   */
  async getKycApplications(): Promise<KycApplication[]> {
    try {
      const res = await apiClient.get<{ data: KycApplication[] }>("/employee/kyc");
      return res.data.data;
    } catch {
      return localKycList;
    }
  },

  /**
   * Phê duyệt hồ sơ eKYC
   */
  async approveKyc(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/employee/kyc/${id}/approve`);
      return res.data;
    } catch {
      localKycList = localKycList.map(item => item.id === id ? { ...item, status: "APPROVED" } : item);
      return { success: true, message: `Đã phê duyệt thành công hồ sơ eKYC ${id}` };
    }
  },

  /**
   * Từ chối hồ sơ eKYC
   */
  async rejectKyc(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/employee/kyc/${id}/reject`, { reason });
      return res.data;
    } catch {
      localKycList = localKycList.map(item => item.id === id ? { ...item, status: "REJECTED", rejectReason: reason } : item);
      return { success: true, message: `Đã từ chối hồ sơ eKYC ${id}` };
    }
  },

  /**
   * Tra cứu danh sách Khách hàng (Customer 360)
   */
  async getCustomers(query?: string): Promise<Customer360[]> {
    try {
      const res = await apiClient.get<{ data: Customer360[] }>("/employee/customers", { params: { query } });
      return res.data.data;
    } catch {
      if (!query) return mockCustomersList;
      const q = query.toLowerCase();
      return mockCustomersList.filter(c => 
        c.fullName.toLowerCase().includes(q) || 
        c.cif.toLowerCase().includes(q) || 
        c.phone.includes(q) || 
        c.idNumber.includes(q)
      );
    }
  },

  /**
   * Lấy thông tin hồ sơ 360° theo Mã CIF
   */
  async getCustomerByCif(cif: string): Promise<Customer360 | null> {
    try {
      const res = await apiClient.get<{ data: Customer360 }>(`/employee/customers/${cif}`);
      return res.data.data;
    } catch {
      return mockCustomersList.find(c => c.cif === cif) || mockCustomersList[0];
    }
  },

  /**
   * Lấy danh sách Tài khoản quản lý
   */
  async getAccounts(query?: string): Promise<AccountItem[]> {
    try {
      const res = await apiClient.get<{ data: AccountItem[] }>("/employee/accounts", { params: { query } });
      return res.data.data;
    } catch {
      if (!query) return localAccountsList;
      const q = query.toLowerCase();
      return localAccountsList.filter(a => 
        a.accountNumber.includes(q) || 
        a.customerName.toLowerCase().includes(q) || 
        a.cif.toLowerCase().includes(q)
      );
    }
  },

  /**
   * Khóa / Phong tỏa tài khoản
   */
  async freezeAccount(payload: FreezeAccountPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>("/employee/accounts/freeze", payload);
      return res.data;
    } catch {
      localAccountsList = localAccountsList.map(a => 
        a.accountNumber === payload.accountNumber 
          ? { 
              ...a, 
              status: payload.lockType, 
              frozenReason: payload.reason, 
              refCode: payload.refCode, 
              updatedAt: new Date().toLocaleString() 
            } 
          : a
      );
      return { success: true, message: `Đã phong tỏa tài khoản ${payload.accountNumber} thành công` };
    }
  },

  /**
   * Mở khóa tài khoản
   */
  async unfreezeAccount(accountNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/employee/accounts/${accountNumber}/unfreeze`);
      return res.data;
    } catch {
      localAccountsList = localAccountsList.map(a => 
        a.accountNumber === accountNumber 
          ? { ...a, status: "ACTIVE", frozenReason: undefined, refCode: undefined, updatedAt: new Date().toLocaleString() } 
          : a
      );
      return { success: true, message: `Đã mở khóa tài khoản ${accountNumber} thành công` };
    }
  },

  /**
   * Thực hiện giao dịch tại quầy (Nạp/Rút/Chuyển)
   */
  async executeCashOp(payload: CashOpPayload): Promise<{ success: boolean; txHash: string; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; txHash: string; message: string }>("/employee/cash-ops", payload);
      return res.data;
    } catch {
      const txHash = "FT" + Date.now();
      return {
        success: true,
        txHash,
        message: `Giao dịch ${payload.type} thành công tại quầy`
      };
    }
  },

  /**
   * Tra cứu lịch sử giao dịch toàn hệ thống
   */
  async getTransactions(query?: string): Promise<EmployeeTransaction[]> {
    try {
      const res = await apiClient.get<{ data: EmployeeTransaction[] }>("/employee/transactions", { params: { query } });
      return res.data.data;
    } catch {
      if (!query) return localTransactionsList;
      const q = query.toLowerCase();
      return localTransactionsList.filter(t => 
        t.txHash.toLowerCase().includes(q) || 
        t.senderAcc.includes(q) || 
        t.receiverAcc.includes(q)
      );
    }
  },

  /**
   * Khởi tạo Yêu cầu Rollback giao dịch
   */
  async requestRollback(txHash: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/employee/transactions/${txHash}/rollback`, { reason });
      return res.data;
    } catch {
      localTransactionsList = localTransactionsList.map(t => 
        t.txHash === txHash ? { ...t, status: "REVERSED", canRollback: false, rollbackReason: reason } : t
      );
      return { success: true, message: `Đã gửi yêu cầu Rollback cho giao dịch ${txHash} đến Kiểm soát viên` };
    }
  }
};
