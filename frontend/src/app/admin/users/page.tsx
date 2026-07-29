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
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { EmployeeUser } from "@/lib/types/admin";

export default function UserManagementPage() {
  const [employees, setEmployees] = useState<EmployeeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [employeeCode, setEmployeeCode] = useState("EMP-9905");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("CN Bến Thành - TPHCM");
  const [role, setRole] = useState("ROLE_EMPLOYEE");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminApi.getEmployees(searchTerm);
      setEmployees(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const res = await adminApi.createEmployee({
      employeeCode,
      fullName,
      email,
      phone,
      branch,
      role,
    });

    const updated = await adminApi.getEmployees(searchTerm);
    setEmployees(updated);
    setCreateModalOpen(false);
    showToast(res.message);

    // Reset form
    setFullName("");
    setEmail("");
    setPhone("");
  };

  const handleToggleLock = async (id: string) => {
    const res = await adminApi.toggleLockEmployee(id);
    const updated = await adminApi.getEmployees(searchTerm);
    setEmployees(updated);
    showToast(res.message);
  };

  const handleResetPassword = async (id: string) => {
    const res = await adminApi.resetEmployeePassword(id);
    showToast(res.message);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p>{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Quản Lý Nhân Viên & Phân Vai Trò
          </h1>
          <p className="text-xs text-slate-400">Thêm mới nhân viên, reset mật khẩu khẩn cấp và khóa/mở khóa quyền truy cập</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Thêm Mới Nhân Viên
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#141C2E] p-3.5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Mã NV (EMP-xxx), Họ tên, Email..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" /> Đang tải danh sách nhân viên...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F17] text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Mã NV</th>
                  <th className="px-5 py-3.5">Họ và Tên</th>
                  <th className="px-5 py-3.5">Email / SĐT</th>
                  <th className="px-5 py-3.5">Chi Nhánh</th>
                  <th className="px-5 py-3.5">Vai Trò (Role)</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác Quản Trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-white text-xs">{emp.employeeCode}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{emp.fullName}</p>
                      <p className="text-slate-400 text-[10px]">Tạo ngày: {emp.createdAt}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-200">{emp.email}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{emp.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-medium">{emp.branch}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        emp.role === "ROLE_ADMIN" 
                          ? "bg-purple-950/80 text-purple-300 border border-purple-500/30" 
                          : emp.role === "ROLE_SUPERVISOR"
                          ? "bg-blue-950/80 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
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
                        title="Reset mật khẩu về mặc định 123456"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Reset Pass
                      </button>

                      <button
                        onClick={() => handleToggleLock(emp.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer ${
                          emp.status === "ACTIVE"
                            ? "bg-red-600/80 hover:bg-red-600 text-white"
                            : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
                        }`}
                      >
                        {emp.status === "ACTIVE" ? (
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
                <UserPlus className="w-4 h-4 text-blue-400" /> Thêm Mới Nhân Viên Vào Hệ Thống
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Mã Nhân Viên (Employee Code)</label>
                <input
                  type="text"
                  required
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Họ và Tên Nhân Viên</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Công Việc</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mai.nguyen@vcb.com"
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Chi Nhánh Quản Lý</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-medium"
                  >
                    <option value="CN Bến Thành - TPHCM">CN Bến Thành - TPHCM</option>
                    <option value="CN Thủ Đức - TPHCM">CN Thủ Đức - TPHCM</option>
                    <option value="Hội Sở Chính - TPHCM">Hội Sở Chính - TPHCM</option>
                    <option value="CN Ba Đình - Hà Nội">CN Ba Đình - Hà Nội</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Vai Trò RBAC (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-medium"
                  >
                    <option value="ROLE_EMPLOYEE">ROLE_EMPLOYEE (Giao dịch viên)</option>
                    <option value="ROLE_SUPERVISOR">ROLE_SUPERVISOR (Kiểm soát viên)</option>
                    <option value="ROLE_ADMIN">ROLE_ADMIN (Quản trị viên)</option>
                  </select>
                </div>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Xác Nhận Thêm Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
