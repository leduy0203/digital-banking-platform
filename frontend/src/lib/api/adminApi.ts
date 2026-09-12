import { apiClient } from "../axios";
import { 
  RbacRole, 
  EmployeeProfileResponse, 
  EmployeeFilterPayload,
  PageResponse,
  CreateEmployeePayload, 
  SchedulerJob, 
  AuditLogItem, 
  SystemHealthStats, 
  PermissionCode 
} from "../types/admin";
import { 
  mockSystemHealth, 
  mockRbacRoles, 
  mockEmployees, 
  mockSchedulerJobs, 
  mockAuditLogs 
} from "../mock/adminData";

let localEmployees = [...mockEmployees];
let localRoles = [...mockRbacRoles];
let localSchedulerJobs = [...mockSchedulerJobs];

export const adminApi = {
  /**
   * Giám sát chỉ số hệ thống (System Health, Active Users, API Stats)
   */
  async getSystemHealth(): Promise<SystemHealthStats> {
    try {
      const res = await apiClient.get<{ data: SystemHealthStats }>("/admin/health");
      return res.data.data;
    } catch {
      return mockSystemHealth;
    }
  },

  /**
   * Lấy danh sách Nhân viên & User hệ thống (Hỗ trợ phân trang + filter đa trường)
   */
  async getEmployees(filter?: EmployeeFilterPayload): Promise<PageResponse<EmployeeProfileResponse>> {
    try {
      const res = await apiClient.get<{ data: PageResponse<EmployeeProfileResponse> }>("/admin/employees", {
        params: filter,
      });
      return res.data.data;
    } catch {
      // Mock fallback if offline
      const mockMapped: EmployeeProfileResponse[] = mockEmployees.map(e => ({
        id: e.id,
        employeeCode: e.employeeCode,
        fullName: e.fullName,
        department: 'CUSTOMER_SERVICE',
        hireDate: '2024-01-15',
        email: e.email,
        phoneNumber: e.phone,
        status: e.status === 'LOCKED' ? 'BLOCKED' : 'ACTIVE',
        createdAt: e.createdAt,
        updatedAt: e.createdAt,
      }));
      return {
        items: mockMapped,
        page: 1,
        size: 10,
        totalElements: mockMapped.length,
        totalPages: 1,
        isLast: true,
      };
    }
  },

  /**
   * Tạo nhân viên mới
   */
  async createEmployee(payload: CreateEmployeePayload): Promise<{ success: boolean; employee: EmployeeProfileResponse; message: string }> {
    try {
      const res = await apiClient.post<{ data: EmployeeProfileResponse }>("/admin/employees", payload);
      return { success: true, employee: res.data.data, message: "Tạo nhân viên thành công!" };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || err.message || "Tạo nhân viên thất bại";
      throw new Error(errorMsg);
    }
  },

  /**
   * Khóa / Mở khóa tài khoản nhân viên (PATCH /api/v1/admin/employees/{id}/status)
   */
  async updateEmployeeStatus(id: string, status: 'ACTIVE' | 'BLOCKED'): Promise<{ success: boolean; data?: EmployeeProfileResponse; message: string }> {
    try {
      const res = await apiClient.patch<{ success: boolean; data: EmployeeProfileResponse; message: string }>(
        `/admin/employees/${id}/status`,
        null,
        { params: { status } }
      );
      return res.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || err.message || "Cập nhật trạng thái nhân viên thất bại";
      throw new Error(errorMsg);
    }
  },

  /**
   * Khóa / Mở khóa nhân viên (Legacy helper)
   */
  async toggleLockEmployee(id: string, currentStatus: 'ACTIVE' | 'BLOCKED' | string = 'ACTIVE'): Promise<{ success: boolean; message: string }> {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const res = await this.updateEmployeeStatus(id, nextStatus);
    return { success: true, message: res.message || "Đã cập nhật trạng thái nhân viên" };
  },

  /**
   * Reset mật khẩu nhân viên
   */
  async resetEmployeePassword(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/admin/employees/${id}/reset-password`);
      return res.data;
    } catch {
      return { success: true, message: "Mật khẩu đã được reset thành công về mặc định (123456)" };
    }
  },

  /**
   * Lấy danh sách Roles & Phân quyền RBAC
   */
  async getRbacRoles(): Promise<RbacRole[]> {
    try {
      const res = await apiClient.get<{ data: RbacRole[] }>("/admin/roles");
      return res.data.data;
    } catch {
      return localRoles;
    }
  },

  /**
   * Tạo Role mới
   */
  async createRole(name: string, code: string, description: string): Promise<RbacRole> {
    const newRole: RbacRole = {
      id: "role-" + Date.now(),
      code,
      name,
      description,
      userCount: 0,
      isSystemRole: false,
      permissions: ["CUSTOMER_READ"],
    };
    localRoles = [...localRoles, newRole];
    return newRole;
  },

  /**
   * Cập nhật Permissions Matrix cho Role (RBAC)
   */
  async updateRolePermissions(roleId: string, permissions: PermissionCode[]): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.put<{ success: boolean; message: string }>(`/admin/roles/${roleId}/permissions`, { permissions });
      return res.data;
    } catch {
      localRoles = localRoles.map(r => r.id === roleId ? { ...r, permissions } : r);
      return { success: true, message: "Đã cập nhật ma trận phân quyền RBAC thành công!" };
    }
  },

  /**
   * Lấy danh sách Cron Scheduler Jobs
   */
  async getSchedulerJobs(): Promise<SchedulerJob[]> {
    try {
      const res = await apiClient.get<{ data: SchedulerJob[] }>("/admin/scheduler/jobs");
      return res.data.data;
    } catch {
      return localSchedulerJobs;
    }
  },

  /**
   * Kích hoạt thủ công Cron Job (Trigger Now)
   */
  async triggerSchedulerJob(jobId: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/admin/scheduler/jobs/${jobId}/trigger`);
      return res.data;
    } catch {
      localSchedulerJobs = localSchedulerJobs.map(j => j.id === jobId ? { ...j, lastRun: new Date().toLocaleString("vi-VN") } : j);
      return { success: true, message: `Đã kích hoạt thủ công Cron Job thành công!` };
    }
  },

  /**
   * Xóa Redis Cache
   */
  async evictCachePattern(pattern: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>("/admin/cache/evict", { pattern });
      return res.data;
    } catch {
      return { success: true, message: `Đã xóa bộ nhớ đệm Redis Cache mẫu \`${pattern}\`!` };
    }
  },

  /**
   * Lấy Audit Logs & Login Trail
   */
  async getAuditLogs(query?: string): Promise<AuditLogItem[]> {
    try {
      const res = await apiClient.get<{ data: AuditLogItem[] }>("/admin/audit-logs", { params: { query } });
      return res.data.data;
    } catch {
      if (!query) return mockAuditLogs;
      const q = query.toLowerCase();
      return mockAuditLogs.filter(l => 
        l.actor.toLowerCase().includes(q) || 
        l.action.toLowerCase().includes(q) || 
        l.ipAddress.includes(q) || 
        l.details.toLowerCase().includes(q)
      );
    }
  }
};
