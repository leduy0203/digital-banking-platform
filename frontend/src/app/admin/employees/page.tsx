"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  Lock, 
  Unlock, 
  KeyRound, 
  CheckCircle2, 
  X,
  Sparkles,
  Filter,
  Building2,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { EmployeeProfileResponse, DepartmentType } from "@/lib/types/admin";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";

export const DEPARTMENT_LABELS: Record<DepartmentType, string> = {
  CUSTOMER_SERVICE: "Dịch vụ Khách hàng & Tiếp quỹ",
  KYC_VERIFICATION: "Thẩm định & Xác minh eKYC",
  RISK_MANAGEMENT: "Quản trị Rủi ro & Kiểm soát",
  CARD_OPERATIONS: "Vận hành Thẻ & Thanh toán",
  IT_OPERATIONS: "Công nghệ & Quản trị Hệ thống",
};

const departmentFilterOptions: CustomSelectOption[] = [
  { value: "ALL", label: "Tất cả Phòng Ban" },
  { value: "KYC_VERIFICATION", label: "Thẩm định & eKYC" },
  { value: "CUSTOMER_SERVICE", label: "Dịch vụ KH & Quầy" },
  { value: "CARD_OPERATIONS", label: "Vận hành Thẻ" },
  { value: "RISK_MANAGEMENT", label: "Quản trị Rủi ro" },
  { value: "IT_OPERATIONS", label: "Công nghệ & Hệ thống" },
];

const statusFilterOptions: CustomSelectOption[] = [
  { value: "ALL", label: "Tất cả Trạng Thái" },
  { value: "ACTIVE", label: "Đang Hoạt Động" },
  { value: "BLOCKED", label: "Đang Tạm Khóa" },
];

const modalDepartmentOptions: CustomSelectOption[] = [
  { value: "KYC_VERIFICATION", label: "Thẩm định & Xác minh eKYC" },
  { value: "CUSTOMER_SERVICE", label: "Dịch vụ Khách hàng & Tiếp quỹ" },
  { value: "CARD_OPERATIONS", label: "Vận hành Thẻ & Thanh toán" },
  { value: "RISK_MANAGEMENT", label: "Quản trị Rủi ro & Kiểm soát" },
  { value: "IT_OPERATIONS", label: "Công nghệ & Quản trị Hệ thống" },
];

const modalRoleOptions: CustomSelectOption[] = [
  { value: "ROLE_TELLER", label: "ROLE_TELLER (Giao dịch viên)" },
  { value: "ROLE_ADMIN", label: "ROLE_ADMIN (Quản trị viên)" },
];

export default function AdminEmployeeManagementPage() {
  const [employees, setEmployees] = useState<EmployeeProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  
  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("Password@123");
  const [department, setDepartment] = useState<DepartmentType>("KYC_VERIFICATION");
  const [role, setRole] = useState<"ROLE_TELLER" | "ROLE_ADMIN">("ROLE_TELLER");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getEmployees({
        keyword: searchTerm.trim() || undefined,
        department: selectedDepartment !== "ALL" ? (selectedDepartment as DepartmentType) : undefined,
        status: selectedStatus !== "ALL" ? (selectedStatus as any) : undefined,
      });
      setEmployees(data.items || []);
    } catch (err) {
      console.error("Error loading employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setSubmitting(true);
    try {
      const res = await adminApi.createEmployee({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        password: password,
        department: department,
        role: role,
      });

      setCreateModalOpen(false);
      showToast(res.message, "success");

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("Password@123");
      loadData();
    } catch (err: any) {
      showToast(err.message || "Tạo nhân viên thất bại!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleToggleLock = async (emp: EmployeeProfileResponse) => {
    const nextStatus = emp.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setActionLoadingId(emp.id);
    try {
      await adminApi.updateEmployeeStatus(emp.id, nextStatus);
      showToast(
        nextStatus === "BLOCKED"
          ? `Đã khóa tài khoản cán bộ ${emp.fullName} (${emp.employeeCode})`
          : `Đã mở khóa tài khoản cán bộ ${emp.fullName} (${emp.employeeCode})`,
        "success"
      );
      loadData();
    } catch (err: any) {
      showToast(err.message || "Cập nhật trạng thái thất bại!", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetPassword = async (id: string) => {
    const res = await adminApi.resetEmployeePassword(id);
    showToast(res.message, "success");
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const isFiltered = Boolean(searchTerm || selectedDepartment !== "ALL" || selectedStatus !== "ALL");

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Floating Notification Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200 max-w-md w-full sm:w-auto">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-[#0D1E22]/95 border-emerald-500/60 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                : "bg-[#241215]/95 border-red-500/60 text-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === "success"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              )}
            </div>

            <div className="flex-1 pr-2">
              <p className="font-bold text-xs text-white">
                {toast.type === "success" ? "Thông báo thành công" : "Có lỗi xảy ra"}
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" /> Quản Lý Cán Bộ & Nhân Viên (Staff IAM)
          </h1>
          <p className="text-xs text-slate-400">Khởi tạo tài khoản công vụ, phân bổ phòng ban chuyên môn và quản lý trạng thái cán bộ</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Cấp Tài Khoản Nhân Viên
        </button>
      </div>

      {/* Compact Search & Filter Bar */}
      <div className="bg-[#141C2E] p-3.5 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search (Compact: 320px width) */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo Mã NV, Họ tên, Email, SĐT..."
              className="w-full pl-9 pr-8 py-2 bg-[#0B0F17] hover:bg-[#101726] border border-slate-800 focus:border-indigo-500/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Department (Custom Smooth Dropdown) */}
          <CustomSelect
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={departmentFilterOptions}
            icon={Building2}
            className="w-full sm:w-56"
            menuWidth="w-64"
          />

          {/* Filter Status (Custom Smooth Dropdown) */}
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusFilterOptions}
            icon={Filter}
            className="w-full sm:w-44"
            menuWidth="w-48"
          />
        </div>

        {/* Clear Filters button */}
        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedDepartment("ALL");
              setSelectedStatus("ALL");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> Đang tải dữ liệu nhân sự...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-medium">
            Không tìm thấy nhân viên nào phù hợp với bộ lọc tìm kiếm.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F17] text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Mã Cán Bộ</th>
                  <th className="px-5 py-3.5">Họ và Tên</th>
                  <th className="px-5 py-3.5">Email / SĐT</th>
                  <th className="px-5 py-3.5">Phòng Ban Công Tác</th>
                  <th className="px-5 py-3.5">Ngày Vào Làm</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400 text-xs">{emp.employeeCode}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{emp.fullName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-200">{emp.email}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{emp.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60 inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        {DEPARTMENT_LABELS[emp.department] || emp.department}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400">{emp.hireDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === "ACTIVE" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {emp.status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(emp.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Reset mật khẩu cán bộ"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Reset Pass
                      </button>

                      <button
                        onClick={() => handleToggleLock(emp)}
                        disabled={actionLoadingId === emp.id}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 ${
                          emp.status === "ACTIVE"
                            ? "bg-red-600/80 hover:bg-red-600 text-white"
                            : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                        }`}
                      >
                        {actionLoadingId === emp.id ? (
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        ) : emp.status === "ACTIVE" ? (
                          <>
                            <Lock className="w-3.5 h-3.5" /> Khóa
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3.5 h-3.5" /> Mở Khóa
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" /> Cấp Mới Tài Khoản Cán Bộ Ngân Hàng
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Họ và Tên Cán Bộ *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-medium focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Công Vụ (@bank.com) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="an.nguyen@bank.com"
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Số Điện Thoại Liên Hệ *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Phòng Ban Công Tác *</label>
                  <CustomSelect
                    value={department}
                    onChange={(val) => setDepartment(val as DepartmentType)}
                    options={modalDepartmentOptions}
                    className="w-full"
                    menuWidth="w-full"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Vai Trò Hệ Thống (Role) *</label>
                  <CustomSelect
                    value={role}
                    onChange={(val) => setRole(val as any)}
                    options={modalRoleOptions}
                    className="w-full"
                    menuWidth="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Mật Khẩu Khởi Tạo *</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Mã cán bộ (EMPxxx) sẽ được hệ thống tự động sinh.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Đang Khởi Tạo..." : "Xác Nhận Tạo Cán Bộ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
