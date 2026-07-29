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

export interface EmployeeUser {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  role: SystemRole | string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  createdAt: string;
  lastLogin: string;
}

export interface CreateEmployeePayload {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  role: string;
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
