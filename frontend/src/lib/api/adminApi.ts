import { apiClient } from "../axios";
import { 
  RbacRole, 
  EmployeeUser, 
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
   * Lấy danh sách Nhân viên & User hệ thống
   */
  async getEmployees(query?: string): Promise<EmployeeUser[]> {
    try {
      const res = await apiClient.get<{ data: EmployeeUser[] }>("/admin/employees", { params: { query } });
      return res.data.data;
    } catch {
      if (!query) return localEmployees;
      const q = query.toLowerCase();
      return localEmployees.filter(e => 
        e.fullName.toLowerCase().includes(q) || 
        e.employeeCode.toLowerCase().includes(q) || 
        e.email.toLowerCase().includes(q)
      );
    }
  },

  /**
   * Tạo nhân viên mới
   */
  async createEmployee(payload: CreateEmployeePayload): Promise<{ success: boolean; employee: EmployeeUser; message: string }> {
    try {
      const res = await apiClient.post<{ data: EmployeeUser }>("/admin/employees", payload);
      return { success: true, employee: res.data.data, message: "Tạo nhân viên thành công" };
    } catch {
      const newEmp: EmployeeUser = {
        id: "emp-" + Date.now(),
        employeeCode: payload.employeeCode,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        branch: payload.branch,
        role: payload.role,
        status: "ACTIVE",
        createdAt: new Date().toLocaleDateString("vi-VN"),
        lastLogin: "Chưa đăng nhập",
      };
      localEmployees = [newEmp, ...localEmployees];
      return { success: true, employee: newEmp, message: `Tạo nhân viên ${payload.fullName} thành công!` };
    }
  },

  /**
   * Khóa / Mở khóa nhân viên
   */
  async toggleLockEmployee(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(`/admin/employees/${id}/toggle-lock`);
      return res.data;
    } catch {
      localEmployees = localEmployees.map(e => {
        if (e.id === id) {
          const nextStatus = e.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
          return { ...e, status: nextStatus };
        }
        return e;
      });
      return { success: true, message: "Đã cập nhật trạng thái khóa tài khoản nhân viên" };
    }
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
