import { apiClient } from "../axios";
import { 
  KycApplication, 
  KycDocumentResponse,
  KycFilterPayload,
  Customer360, 
  AccountItem, 
  FreezeAccountPayload, 
  CashOpPayload, 
  EmployeeTransaction, 
  EmployeeDashboardStats 
} from "../types/employee";
import { PageResponse } from "../types/admin";
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
   * Lấy hồ sơ thông tin của Nhân viên đang đăng nhập (GET /api/v1/employee/profile/me)
   */
  async getMyProfile(): Promise<{
    id: string;
    employeeCode: string;
    fullName: string;
    department: string;
    hireDate: string;
    email: string;
    phoneNumber: string;
    status?: string;
  }> {
    try {
      const res = await apiClient.get<{ data: any }>("/employee/profile/me");
      return res.data.data;
    } catch {
      return {
        id: "emp-me",
        employeeCode: "EMP102948",
        fullName: "Nguyễn Văn An",
        department: "KYC_VERIFICATION",
        hireDate: "2024-01-15",
        email: "an.nguyen@bank.com",
        phoneNumber: "0912345678",
        status: "ACTIVE",
      };
    }
  },

  /**
   * Lấy danh sách thống kê Dashboard
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
   * Lấy danh sách hồ sơ eKYC dạng mảng (Helper cho Dashboard)
   */
  async getKycApplications(): Promise<KycApplication[]> {
    try {
      const res = await this.getPendingKycs();
      return (res.items || []).map(doc => ({
        id: doc.id,
        cif: doc.customerCode || "",
        fullName: doc.fullName,
        dob: doc.dateOfBirth || "",
        idNumber: doc.nationalId,
        issueDate: "",
        address: doc.address || "",
        phone: doc.phoneNumber,
        email: doc.email,
        aiScore: 98,
        submittedAt: doc.submittedAt,
        status: doc.status as any,
        frontImg: doc.frontIdCardUrl,
        backImg: doc.backIdCardUrl,
        selfieImg: doc.selfiePhotoUrl,
        rejectReason: doc.rejectionReason,
      }));
    } catch {
      return localKycList;
    }
  },

  /**
   * Lấy danh sách hồ sơ eKYC cần thẩm định (GET /api/v1/employee/kyc/pending)
   */
  async getPendingKycs(filter?: KycFilterPayload): Promise<PageResponse<KycDocumentResponse>> {
    try {
      const res = await apiClient.get<{ data: PageResponse<KycDocumentResponse> }>("/employee/kyc/pending", {
        params: filter,
      });
      return res.data.data;
    } catch {
      // Mock fallback
      let items: KycDocumentResponse[] = localKycList.map(k => ({
        id: k.id,
        status: (k.status === "APPROVED" ? "VERIFIED" : k.status) as any,
        frontIdCardUrl: k.frontImg || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        backIdCardUrl: k.backImg || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        selfiePhotoUrl: k.selfieImg || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
        rejectionReason: k.rejectReason,
        submittedAt: k.submittedAt,
        customerId: k.id,
        customerCode: k.cif,
        fullName: k.fullName,
        nationalId: k.idNumber,
        dateOfBirth: k.dob,
        address: k.address,
        email: k.email,
        phoneNumber: k.phone,
      }));

      if (filter?.status) {
        items = items.filter(i => i.status === filter.status);
      }
      if (filter?.keyword) {
        const q = filter.keyword.toLowerCase();
        items = items.filter(i => 
          i.fullName.toLowerCase().includes(q) ||
          i.nationalId.includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phoneNumber.includes(q) ||
          (i.customerCode && i.customerCode.toLowerCase().includes(q))
        );
      }

      return {
        items,
        page: 1,
        size: 10,
        totalElements: items.length,
        totalPages: 1,
        isLast: true,
      };
    }
  },

  /**
   * Lấy chi tiết 1 hồ sơ eKYC (GET /api/v1/employee/kyc/{id})
   */
  async getKycDetail(id: string): Promise<KycDocumentResponse> {
    try {
      const res = await apiClient.get<{ data: KycDocumentResponse }>(`/employee/kyc/${id}`);
      return res.data.data;
    } catch {
      const found = localKycList.find(k => k.id === id) || localKycList[0];
      return {
        id: found.id,
        status: (found.status === "APPROVED" ? "VERIFIED" : found.status) as any,
        frontIdCardUrl: found.frontImg,
        backIdCardUrl: found.backImg,
        selfiePhotoUrl: found.selfieImg,
        rejectionReason: found.rejectReason,
        submittedAt: found.submittedAt,
        customerId: found.id,
        customerCode: found.cif,
        fullName: found.fullName,
        nationalId: found.idNumber,
        dateOfBirth: found.dob,
        address: found.address,
        email: found.email,
        phoneNumber: found.phone,
      };
    }
  },

  /**
   * Phê duyệt hồ sơ eKYC (PUT /api/v1/employee/kyc/{id}/approve)
   */
  async approveKyc(id: string): Promise<{ success: boolean; data?: KycDocumentResponse; message: string }> {
    try {
      const res = await apiClient.put<{ success: boolean; data: KycDocumentResponse; message: string }>(`/employee/kyc/${id}/approve`);
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || err.message || "Phê duyệt eKYC thất bại";
      throw new Error(errorMsg);
    }
  },

  /**
   * Từ chối hồ sơ eKYC (PUT /api/v1/employee/kyc/{id}/reject)
   */
  async rejectKyc(id: string, reason: string): Promise<{ success: boolean; data?: KycDocumentResponse; message: string }> {
    try {
      const res = await apiClient.put<{ success: boolean; data: KycDocumentResponse; message: string }>(`/employee/kyc/${id}/reject`, { reason });
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || err.message || "Từ chối eKYC thất bại";
      throw new Error(errorMsg);
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
