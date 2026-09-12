export type SystemRole = 'ROLE_CUSTOMER' | 'ROLE_EMPLOYEE' | 'ROLE_SUPERVISOR' | 'ROLE_ADMIN' | 'ROLE_AUDITOR';

export type PermissionCode = 
  | 'CUSTOMER_READ'
  | 'KYC_VERIFY'
  | 'ACCOUNT_FREEZE'
  | 'ACCOUNT_UNFREEZE'
  | 'CASH_DEPOSIT'
  | 'CASH_WITHDRAW'
  | 'ROLLBACK_REQUEST'
  | 'ROLLBACK_APPROVE'
  | 'EMPLOYEE_MANAGE'
  | 'ROLE_MANAGE'
  | 'SCHEDULER_MANAGE'
  | 'CACHE_EVICT'
  | 'SYSTEM_CONFIG'
  | 'AUDIT_LOG_VIEW';

export interface RbacRole {
  id: string;
  code: SystemRole | string;
  name: string;
  description: string;
  userCount: number;
  permissions: PermissionCode[];
  isSystemRole: boolean;
}

export type DepartmentType = 
  | 'CUSTOMER_SERVICE'
  | 'KYC_VERIFICATION'
  | 'RISK_MANAGEMENT'
  | 'CARD_OPERATIONS'
  | 'IT_OPERATIONS';

export interface EmployeeProfileResponse {
  id: string;
  employeeCode: string;
  fullName: string;
  department: DepartmentType;
  hireDate: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeUser {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  role: string;
  status: "ACTIVE" | "LOCKED";
  createdAt: string;
  lastLogin: string;
}

export interface CreateEmployeePayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  department: DepartmentType;
  role: 'ROLE_TELLER' | 'ROLE_ADMIN';
}

export interface EmployeeFilterPayload {
  keyword?: string;
  department?: DepartmentType;
  status?: 'ACTIVE' | 'BLOCKED' | 'PENDING';
  role?: 'ROLE_TELLER' | 'ROLE_ADMIN';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface SchedulerJob {
  id: string;
  jobName: string;
  cronExpression: string;
  description: string;
  status: 'RUNNING' | 'PAUSED' | 'FAILED';
  lastRun: string;
  nextRun: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetModule: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
  details: string;
}

export interface SystemHealthStats {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  dbPoolActive: number;
  dbPoolMax: number;
  redisLatencyMs: number;
  activeConcurrentUsers: number;
  apiRequestsPerMin: number;
  apiErrorRatePercent: number;
  apiLatencyP99Ms: number;
}
