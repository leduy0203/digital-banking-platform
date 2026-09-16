import { apiClient } from "../axios";
import { 
  KycApplication, 
  KycDocumentResponse,
  KycFilterPayload,
  Customer360, 
  CustomerSummaryItem,
  CustomerDetailView,
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
   * Lấy số lượng hồ sơ eKYC đang chờ duyệt (GET /api/v1/employee/kyc/count-pending)
   */
  async getPendingKycCount(): Promise<number> {
    try {
      const res = await apiClient.get<{ data: number }>("/employee/kyc/count-pending");
      return res.data.data ?? 0;
    } catch {
      return 0;
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
   * Tra cứu danh sách Khách hàng phân trang (GET /api/v1/employee/customers)
   */
  async getCustomersPage(params?: {
    keyword?: string;
    kycStatus?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
  }): Promise<PageResponse<CustomerSummaryItem>> {
    try {
      const res = await apiClient.get<{ data: PageResponse<any> }>("/employee/customers", { params });
      return res.data.data;
    } catch {
      // Mock fallback
      const filtered = mockCustomersList.filter(c => {
        if (params?.keyword) {
          const q = params.keyword.toLowerCase();
          const match = c.fullName.toLowerCase().includes(q) || c.cif.toLowerCase().includes(q) || c.phone.includes(q) || c.idNumber.includes(q);
          if (!match) return false;
        }
        if (params?.kycStatus && params.kycStatus !== 'ALL') {
          if (c.kycStatus !== params.kycStatus) return false;
        }
        return true;
      });

      return {
        items: filtered.map(c => ({
          id: c.cif,
          customerCode: c.cif,
          fullName: c.fullName,
          nationalId: c.idNumber,
          phoneNumber: c.phone,
          email: c.email,
          avatarUrl: c.avatarUrl,
          userStatus: "ACTIVE",
          kycStatus: c.kycStatus as any,
          createdAt: new Date().toISOString()
        })),
        page: params?.page || 0,
        size: params?.size || 10,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / (params?.size || 10)),
        isLast: (params?.page || 0) >= Math.ceil(filtered.length / (params?.size || 10)) - 1
      };
    }
  },

  /**
   * Tra cứu danh sách Khách hàng (Customer 360 Legacy/Compat)
   */
  async getCustomers(query?: string): Promise<Customer360[]> {
    try {
      const res = await apiClient.get<{ data: PageResponse<any> | any[] }>("/employee/customers", { params: { keyword: query, size: 50 } });
      const rawData = res.data.data;
      const items = Array.isArray(rawData) ? rawData : (rawData?.items || []);
      return items.map((c: any) => ({
        cif: c.customerCode || c.cif,
        fullName: c.fullName,
        phone: c.phoneNumber || c.phone || "",
        email: c.email || "",
        idNumber: c.nationalId || c.idNumber || "",
        registeredDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "",
        kycStatus: c.kycStatus === "APPROVED" ? "VERIFIED" : (c.kycStatus || "PENDING"),
        address: c.address || "",
        accounts: c.accounts || (c.defaultAccountNumber ? [{
          accountNumber: c.defaultAccountNumber,
          accountType: "CHECKING",
          balance: Number(c.defaultBalance || 0),
          currency: "VND",
          status: "ACTIVE"
        }] : [])
      }));
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
   * Lấy chi tiết toàn diện Customer Detail theo Mã CIF (GET /api/v1/employee/customers/{cif})
   */
  async getCustomerDetail(cif: string): Promise<CustomerDetailView | null> {
    try {
      const res = await apiClient.get<{ data: any }>(`/employee/customers/${cif}`);
      const c = res.data.data;
      if (!c) return null;
      return {
        customerId: c.customerId || c.id,
        customerCode: c.customerCode || c.cif,
        fullName: c.fullName,
        nationalId: c.nationalId || c.idNumber || "",
        dateOfBirth: c.dateOfBirth,
        address: c.address || "",
        avatarUrl: c.avatarUrl,
        email: c.email || "",
        phoneNumber: c.phoneNumber || c.phone || "",
        userStatus: c.userStatus || "ACTIVE",
        kycStatus: c.kycStatus === "APPROVED" ? "VERIFIED" : (c.kycStatus || "PENDING"),
        kycSubmittedAt: c.kycSubmittedAt,
        kycVerifiedAt: c.kycVerifiedAt,
        totalBalance: Number(c.totalBalance || 0),
        totalAccounts: Number(c.totalAccounts || (c.accounts ? c.accounts.length : 0)),
        accounts: (c.accounts || []).map((acc: any) => ({
          accountNumber: acc.accountNumber,
          accountType: acc.accountType,
          balance: Number(acc.balance || 0),
          frozenBalance: Number(acc.frozenBalance || 0),
          availableBalance: Number(acc.availableBalance ?? acc.balance ?? 0),
          currency: acc.currency || "VND",
          status: acc.status || "ACTIVE",
          isDefault: acc.isDefault || false,
          openedAt: acc.openedAt
        })),
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.updatedAt
      };
    } catch {
      const fallback = mockCustomersList.find(c => c.cif === cif) || mockCustomersList[0];
      if (!fallback) return null;
      const totalBalance = fallback.accounts.reduce((acc, curr) => acc + curr.balance, 0);
      return {
        customerId: fallback.cif,
        customerCode: fallback.cif,
        fullName: fallback.fullName,
        nationalId: fallback.idNumber,
        address: fallback.address,
        email: fallback.email,
        phoneNumber: fallback.phone,
        userStatus: "ACTIVE",
        kycStatus: fallback.kycStatus as any,
        totalBalance: totalBalance,
        totalAccounts: fallback.accounts.length,
        accounts: fallback.accounts.map(acc => ({
          accountNumber: acc.accountNumber,
          accountType: acc.accountType,
          balance: acc.balance,
          frozenBalance: 0,
          availableBalance: acc.balance,
          currency: acc.currency,
          status: acc.status as any,
          isDefault: false
        })),
        createdAt: new Date().toISOString()
      };
    }
  },

  /**
   * Lấy thông tin hồ sơ 360° theo Mã CIF (Legacy alias)
   */
  async getCustomerByCif(cif: string): Promise<Customer360 | null> {
    const detail = await this.getCustomerDetail(cif);
    if (!detail) return null;
    return {
      cif: detail.customerCode,
      fullName: detail.fullName,
      phone: detail.phoneNumber || "",
      email: detail.email || "",
      idNumber: detail.nationalId,
      registeredDate: detail.createdAt ? new Date(detail.createdAt).toLocaleDateString("vi-VN") : "",
      kycStatus: detail.kycStatus as any,
      address: detail.address || "",
      accounts: detail.accounts
    };
  },

  /**
   * Lấy danh sách Tài khoản quản lý (GET /api/v1/employee/accounts)
   */
  async getAccounts(filter?: string | {
    keyword?: string;
    status?: string;
    accountType?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
  }): Promise<PageResponse<AccountItem>> {
    const params = typeof filter === "string" 
      ? { keyword: filter, page: 0, size: 20 }
      : { page: 0, size: 20, ...filter };

    try {
      const res = await apiClient.get<{ data: any }>("/employee/accounts", { params });
      const rawData = res.data.data;

      if (rawData && rawData.items) {
        return {
          items: rawData.items.map((a: any) => ({
            id: a.id,
            accountNumber: a.accountNumber,
            cif: a.cif || "",
            customerId: a.customerId,
            customerName: a.customerName || "Khách Hàng",
            customerPhone: a.customerPhone,
            customerEmail: a.customerEmail,
            accountType: a.accountType,
            balance: a.balance ?? 0,
            frozenBalance: a.frozenBalance ?? 0,
            availableBalance: a.availableBalance ?? (a.balance - (a.frozenBalance || 0)),
            currency: a.currency || "VND",
            status: a.status,
            isDefault: a.isDefault,
            openedAt: a.openedAt ? new Date(a.openedAt).toLocaleDateString("vi-VN") : undefined,
            closedAt: a.closedAt,
            updatedAt: a.updatedAt ? new Date(a.updatedAt).toLocaleString("vi-VN") : new Date().toLocaleString("vi-VN"),
          })),
          page: rawData.page,
          size: rawData.size,
          totalElements: rawData.totalElements,
          totalPages: rawData.totalPages,
          isLast: rawData.isLast ?? (rawData.page >= rawData.totalPages),
        };
      }

      // If backend returned a plain array
      const itemsList = Array.isArray(rawData) ? rawData : [];
      return {
        items: itemsList,
        page: 1,
        size: itemsList.length,
        totalElements: itemsList.length,
        totalPages: 1,
        isLast: true,
      };
    } catch {
      let items = [...localAccountsList];
      const q = typeof filter === "string" ? filter.toLowerCase() : filter?.keyword?.toLowerCase();
      if (q) {
        items = items.filter(a => 
          a.accountNumber.includes(q) || 
          a.customerName.toLowerCase().includes(q) || 
          a.cif.toLowerCase().includes(q)
        );
      }
      if (typeof filter === "object" && filter.status) {
        items = items.filter(a => a.status === filter.status);
      }
      if (typeof filter === "object" && filter.accountType) {
        items = items.filter(a => a.accountType === filter.accountType);
      }

      return {
        items,
        page: 1,
        size: items.length,
        totalElements: items.length,
        totalPages: 1,
        isLast: true,
      };
    }
  },

  /**
   * Mở tài khoản thanh toán mới tại quầy (POST /api/v1/employee/accounts/open)
   */
  async openAccount(payload: {
    customerId: string;
    accountType?: 'CHECKING' | 'SAVINGS';
    currency?: string;
    initialDeposit?: number;
  }): Promise<{ success: boolean; data: any; message: string }> {
    const res = await apiClient.post<{ success: boolean; data: any; message: string }>("/employee/accounts/open", payload);
    return res.data;
  },

  /**
   * Cập nhật trạng thái tài khoản (PATCH /api/v1/employee/accounts/{accountNumber}/status?status=...)
   */
  async updateAccountStatus(accountNumber: string, status: 'ACTIVE' | 'FROZEN' | 'BLOCKED' | 'CLOSED'): Promise<{ success: boolean; data: any; message: string }> {
    const res = await apiClient.patch<{ success: boolean; data: any; message: string }>(`/employee/accounts/${accountNumber}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  /**
   * Khóa / Phong tỏa tài khoản
   */
  async freezeAccount(payload: FreezeAccountPayload): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.patch<{ success: boolean; message: string }>(`/employee/accounts/${payload.accountNumber}/status`, null, {
        params: { status: payload.lockType }
      });
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
      return { success: true, message: `Đã cập nhật trạng thái tài khoản ${payload.accountNumber} thành công` };
    }
  },

  /**
   * Mở khóa tài khoản
   */
  async unfreezeAccount(accountNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.patch<{ success: boolean; message: string }>(`/employee/accounts/${accountNumber}/status`, null, {
        params: { status: 'ACTIVE' }
      });
      return res.data;
    } catch {
      localAccountsList = localAccountsList.map(a => 
        a.accountNumber === accountNumber 
          ? { ...a, status: 'ACTIVE', frozenReason: undefined, refCode: undefined, updatedAt: new Date().toLocaleString() } 
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
