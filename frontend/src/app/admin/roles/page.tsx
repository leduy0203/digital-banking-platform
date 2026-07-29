"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Shield, 
  Plus, 
  CheckCircle2, 
  Save, 
  X
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { RbacRole, PermissionCode } from "@/lib/types/admin";

const ALL_PERMISSIONS: { code: PermissionCode; name: string; category: string }[] = [
  { code: "CUSTOMER_READ", name: "Xem thông tin Khách Hàng (Customer 360)", category: "Nghiệp Vụ Khách Hàng" },
  { code: "KYC_VERIFY", name: "Phê duyệt / Từ chối eKYC Hồ sơ", category: "Nghiệp Vụ Khách Hàng" },
  { code: "ACCOUNT_FREEZE", name: "Khóa / Phong tỏa Tài Khoản", category: "Quản Lý Tài Khoản" },
  { code: "ACCOUNT_UNFREEZE", name: "Mở khóa Tài Khoản", category: "Quản Lý Tài Khoản" },
  { code: "CASH_DEPOSIT", name: "Nạp tiền mặt tại quầy (Deposit)", category: "Nghiệp Vụ Quầy" },
  { code: "CASH_WITHDRAW", name: "Rút tiền mặt tại quầy (Withdraw)", category: "Nghiệp Vụ Quầy" },
  { code: "ROLLBACK_REQUEST", name: "Khởi tạo Yêu cầu Hoàn Tiền (Rollback)", category: "Giao Dịch & Đảo Sổ" },
  { code: "ROLLBACK_APPROVE", name: "Kiểm soát & Duyệt Lệnh Rollback (Maker-Checker)", category: "Giao Dịch & Đảo Sổ" },
  { code: "EMPLOYEE_MANAGE", name: "Tạo / Sửa / Khóa Tài Khoản Nhân Viên (CRUD)", category: "Quản Trị Hệ Thống" },
  { code: "ROLE_MANAGE", name: "Tạo Role & Phân Quyền Ma Trận RBAC", category: "Quản Trị Hệ Thống" },
  { code: "SCHEDULER_MANAGE", name: "Điều khiển Cron Scheduler Engine", category: "Quản Trị Hệ Thống" },
  { code: "CACHE_EVICT", name: "Quản lý & Evict Redis Cache", category: "Quản Trị Hệ Thống" },
  { code: "SYSTEM_CONFIG", name: "Chỉnh sửa Cấu hình Tham số Hệ thống", category: "Quản Trị Hệ Thống" },
  { code: "AUDIT_LOG_VIEW", name: "Tra cứu Nhật ký Audit & Security Logs", category: "Kiểm Toán & Giám Sát" },
];

export default function RbacRoleManagementPage() {
  const [roles, setRoles] = useState<RbacRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Role Modal
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("ROLE_");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminApi.getRbacRoles();
      setRoles(data);
      if (data.length > 0 && !selectedRoleId) {
        setSelectedRoleId(data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (permissionCode: PermissionCode) => {
    if (!selectedRole) return;
    const hasPerm = selectedRole.permissions.includes(permissionCode);
    const updatedPerms = hasPerm
      ? selectedRole.permissions.filter(p => p !== permissionCode)
      : [...selectedRole.permissions, permissionCode];

    setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, permissions: updatedPerms } : r));
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    const res = await adminApi.updateRolePermissions(selectedRole.id, selectedRole.permissions);
    showToast(res.message);
  };

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName || !newRoleCode) return;
    const created = await adminApi.createRole(newRoleName, newRoleCode, newRoleDesc);
    setRoles(prev => [...prev, created]);
    setSelectedRoleId(created.id);
    setCreateRoleModalOpen(false);
    showToast(`Đã khởi tạo Role ${created.code} thành công!`);
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
            <ShieldCheck className="w-6 h-6 text-blue-400" /> Ma Trận Phân Quyền RBAC
          </h1>
          <p className="text-xs text-slate-400">Định nghĩa Role hệ thống và gán mã quyền (Permissions Authority) chi tiết</p>
        </div>

        <button
          onClick={() => setCreateRoleModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Tạo Role Hệ Thống Mới
        </button>
      </div>

      {/* Main Grid: Left Roles Selector (4 cols) + Right Permissions Matrix Table (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Roles Cards List */}
        <div className="lg:col-span-4 bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider px-1">Danh sách Roles ({roles.length})</h2>

          <div className="space-y-2">
            {roles.map((r) => {
              const isSelected = selectedRole && r.id === selectedRole.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleId(r.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? "border-blue-500 bg-[#0B0F17] shadow-sm" 
                      : "border-slate-800 hover:border-slate-700 bg-[#0B0F17]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 bg-blue-950/80 rounded border border-blue-500/30">
                      {r.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {r.userCount} Nhân viên
                    </span>
                  </div>

                  <p className="font-bold text-white text-xs mt-2">{r.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Permission Matrix Interactive Checkboxes Table */}
        {selectedRole && (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm p-5 lg:p-6 space-y-5">
            {/* Selected Role Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-950/80 text-blue-400 border border-blue-500/30 rounded">
                    {selectedRole.code}
                  </span>
                  <span className="text-xs text-slate-400">{selectedRole.userCount} nhân viên sở hữu Role này</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedRole.name}</h2>
              </div>

              <button
                onClick={handleSavePermissions}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Lưu Ma Trận Phân Quyền
              </button>
            </div>

            {/* Permissions Matrix Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Gán Quyền Hạn Chi Tiết (Permissions Checkbox Matrix)
              </h3>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0B0F17] text-slate-400 font-semibold uppercase border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Mã Quyền (Permission Code)</th>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3">Mô Tả Quyền Hạn</th>
                      <th className="px-4 py-3 text-center">Cho Phép</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isGranted = selectedRole.permissions.includes(perm.code);
                      return (
                        <tr 
                          key={perm.code} 
                          onClick={() => handleTogglePermission(perm.code)}
                          className={`cursor-pointer transition-colors ${
                            isGranted ? "bg-blue-950/20 hover:bg-blue-950/40" : "hover:bg-[#0B0F17]"
                          }`}
                        >
                          <td className="px-4 py-3 font-mono font-bold text-white text-xs">
                            {perm.code}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-400">
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px]">
                              {perm.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-200">
                            {perm.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => {}}
                              className="w-4 h-4 rounded border-slate-700 bg-[#0B0F17] text-blue-600 focus:ring-0 accent-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Role Modal */}
      {createRoleModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" /> Tạo Role Hệ Thống Mới (RBAC)
              </h3>
              <button onClick={() => setCreateRoleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Mã Role (Role Code Code-name)</label>
                <input
                  type="text"
                  required
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value)}
                  placeholder="Ví dụ: ROLE_CHIEF_AUDITOR"
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Tên Role Hiển Thị</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Ví dụ: Trưởng Phòng Kiểm Toán Khách Hàng"
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Mô Tả Phạm Vi Quyền Hạn</label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Mô tả chức năng công việc của Role..."
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-xs text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Xác Nhận Tạo Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
