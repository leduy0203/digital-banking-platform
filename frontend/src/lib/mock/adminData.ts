import { 
  RbacRole, 
  EmployeeUser, 
  SchedulerJob, 
  AuditLogItem, 
  SystemHealthStats 
} from "../types/admin";

export const mockSystemHealth: SystemHealthStats = {
  cpuUsagePercent: 18.5,
  memoryUsagePercent: 42.1,
  dbPoolActive: 12,
  dbPoolMax: 50,
  redisLatencyMs: 2,
  activeConcurrentUsers: 3420,
  apiRequestsPerMin: 12450,
  apiErrorRatePercent: 0.01,
  apiLatencyP99Ms: 42,
};

export const mockRbacRoles: RbacRole[] = [
  {
    id: "role-1",
    code: "ROLE_ADMIN",
    name: "Quản Trị Viên Hệ Thống (System Admin)",
    description: "Toàn quyền quản trị tài khoản nhân viên, cấu hình cache, scheduler và phân quyền RBAC",
    userCount: 3,
    isSystemRole: true,
    permissions: [
      "CUSTOMER_READ", "KYC_VERIFY", "ACCOUNT_FREEZE", "ACCOUNT_UNFREEZE",
      "CASH_DEPOSIT", "CASH_WITHDRAW", "ROLLBACK_REQUEST", "ROLLBACK_APPROVE",
      "EMPLOYEE_MANAGE", "ROLE_MANAGE", "SCHEDULER_MANAGE", "CACHE_EVICT",
      "SYSTEM_CONFIG", "AUDIT_LOG_VIEW"
    ]
  },
  {
    id: "role-2",
    code: "ROLE_EMPLOYEE",
    name: "Giao Dịch Viên Quầy (Teller Staff)",
    description: "Nghiệp vụ quầy hằng ngày: Nạp/Rút/Chuyển tiền, thẩm định KYC và phong tỏa tài khoản",
    userCount: 45,
    isSystemRole: true,
    permissions: [
      "CUSTOMER_READ", "KYC_VERIFY", "ACCOUNT_FREEZE", "ACCOUNT_UNFREEZE",
      "CASH_DEPOSIT", "CASH_WITHDRAW", "ROLLBACK_REQUEST"
    ]
  },
  {
    id: "role-3",
    code: "ROLE_SUPERVISOR",
    name: "Kiểm Soát Viên (Checker / Supervisor)",
    description: "Phê duyệt các giao dịch giá trị lớn, duyệt lệnh Rollback và kiểm tra tuân thủ",
    userCount: 12,
    isSystemRole: true,
    permissions: [
      "CUSTOMER_READ", "KYC_VERIFY", "ACCOUNT_FREEZE", "ACCOUNT_UNFREEZE",
      "ROLLBACK_APPROVE", "AUDIT_LOG_VIEW"
    ]
  },
  {
    id: "role-4",
    code: "ROLE_AUDITOR",
    name: "Chuyên Viên Kiểm Toán (Security Auditor)",
    description: "Chỉ đọc log hệ thống, giám sát nhật ký đăng nhập và báo cáo tuân thủ ISO 27001",
    userCount: 5,
    isSystemRole: false,
    permissions: ["AUDIT_LOG_VIEW", "CUSTOMER_READ"]
  }
];

export const mockEmployees: EmployeeUser[] = [
  {
    id: "emp-101",
    employeeCode: "EMP-8821",
    fullName: "Nguyễn Văn An",
    email: "nhanvien@vcb.com",
    phone: "0908881234",
    branch: "CN Bến Thành - TPHCM",
    role: "ROLE_EMPLOYEE",
    status: "ACTIVE",
    createdAt: "10/01/2025",
    lastLogin: "29/07/2026 22:40",
  },
  {
    id: "emp-102",
    employeeCode: "EMP-9902",
    fullName: "Phạm Minh Hoàng",
    email: "admin.system@digitalbank.vn",
    phone: "0912999888",
    branch: "Hội Sở Chính - TPHCM",
    role: "ROLE_ADMIN",
    status: "ACTIVE",
    createdAt: "01/01/2024",
    lastLogin: "29/07/2026 23:05",
  },
  {
    id: "emp-103",
    employeeCode: "EMP-7712",
    fullName: "Lê Thị Thu Thảo",
    email: "thao.le@vcb.com",
    phone: "0987111222",
    branch: "CN Bến Thành - TPHCM",
    role: "ROLE_SUPERVISOR",
    status: "ACTIVE",
    createdAt: "15/03/2025",
    lastLogin: "29/07/2026 18:20",
  },
  {
    id: "emp-104",
    employeeCode: "EMP-6601",
    fullName: "Trần Quốc Tuấn",
    email: "tuan.tran@vcb.com",
    phone: "0933444555",
    branch: "CN Thủ Đức - TPHCM",
    role: "ROLE_EMPLOYEE",
    status: "LOCKED",
    createdAt: "20/06/2025",
    lastLogin: "20/07/2026 14:15",
  }
];

export const mockSchedulerJobs: SchedulerJob[] = [
  {
    id: "job-1",
    jobName: "Nightly Savings Interest Cron Engine",
    cronExpression: "0 0 0 * * ?",
    description: "Tự động tính lãi dự chi và nhập gốc/lãi cho tài khoản tiết kiệm định kỳ hàng đêm",
    status: "RUNNING",
    lastRun: "29/07/2026 00:00:00",
    nextRun: "30/07/2026 00:00:00",
  },
  {
    id: "job-2",
    jobName: "Daily Customer Statement Generator",
    cronExpression: "0 0 2 * * ?",
    description: "Sinh file PDF sao kê tài khoản tự động gửi email cho khách hàng đăng ký",
    status: "RUNNING",
    lastRun: "29/07/2026 02:00:00",
    nextRun: "30/07/2026 02:00:00",
  },
  {
    id: "job-[#3]",
    jobName: "Auto Dormant Account Lock Processor",
    cronExpression: "0 0 3 1 * ?",
    description: "Quét tài khoản không hoạt động quá 12 tháng để chuyển trạng thái DORMANT",
    status: "PAUSED",
    lastRun: "01/07/2026 03:00:00",
    nextRun: "01/08/2026 03:00:00",
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: "log-9001",
    timestamp: "29/07/2026 22:45:10",
    actor: "Nguyễn Văn An (EMP-8821)",
    actorRole: "ROLE_EMPLOYEE",
    action: "KYC_APPROVE",
    targetModule: "eKYC Engine",
    ipAddress: "192.168.100.157",
    status: "SUCCESS",
    details: "Phê duyệt thành công hồ sơ eKYC CIF-90124 (Trần Thị Bích Ngọc)",
  },
  {
    id: "log-9002",
    timestamp: "29/07/2026 22:30:15",
    actor: "Nguyễn Văn An (EMP-8821)",
    actorRole: "ROLE_EMPLOYEE",
    action: "CASH_DEPOSIT",
    targetModule: "Teller Operations",
    ipAddress: "192.168.100.157",
    status: "SUCCESS",
    details: "Hạch toán nạp tiền mặt ₫ 5,000,000 vào STK 1019283746",
  },
  {
    id: "log-9003",
    timestamp: "29/07/2026 21:15:00",
    actor: "Phạm Minh Hoàng (EMP-9902)",
    actorRole: "ROLE_ADMIN",
    action: "CACHE_EVICT",
    targetModule: "Redis Cache",
    ipAddress: "10.0.0.4",
    status: "SUCCESS",
    details: "Evict cache pattern `account_cache:*`",
  },
  {
    id: "log-9004",
    timestamp: "29/07/2026 20:05:22",
    actor: "Khách hàng khachhang@vcb.com",
    actorRole: "ROLE_CUSTOMER",
    action: "LOGIN_AUTH",
    targetModule: "Spring Security Auth",
    ipAddress: "113.161.44.12",
    status: "SUCCESS",
    details: "Đăng nhập thành công qua thiết bị iOS Mobile App",
  }
];
