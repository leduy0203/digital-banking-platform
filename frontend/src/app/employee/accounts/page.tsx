"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { AccountItem } from "@/lib/types/employee";

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcc, setSelectedAcc] = useState<AccountItem | null>(null);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [unfreezeModalOpen, setUnfreezeModalOpen] = useState(false);

  // Freeze Modal State
  const [lockType, setLockType] = useState<"FROZEN" | "DEBIT_LOCKED">("FROZEN");
  const [reason, setReason] = useState("Khách hàng báo mất thiết bị đăng nhập & nghi vấn gian lận");
  const [refCode, setRefCode] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await employeeApi.getAccounts(searchTerm);
      setAccounts(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  const handleFreezeConfirm = async () => {
    if (!selectedAcc) return;
    const res = await employeeApi.freezeAccount({
      accountNumber: selectedAcc.accountNumber,
      lockType,
      reason,
      refCode,
    });
    
    // Refresh list
    const updated = await employeeApi.getAccounts(searchTerm);
    setAccounts(updated);
    setFreezeModalOpen(false);
    showToast(res.message);
  };

  const handleUnfreezeConfirm = async () => {
    if (!selectedAcc) return;
    const res = await employeeApi.unfreezeAccount(selectedAcc.accountNumber);
    
    // Refresh list
    const updated = await employeeApi.getAccounts(searchTerm);
    setAccounts(updated);
    setUnfreezeModalOpen(false);
    showToast(res.message);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#A3E635]" /> Quản Lý & Phong Tỏa Tài Khoản (Account Freeze / Unfreeze)
          </h1>
          <p className="text-xs text-slate-400">Tra cứu trạng thái tài khoản thanh toán và xử lý phong tỏa/mở khóa theo quy trình</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Số tài khoản, Mã CIF hoặc Tên chủ tài khoản..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A3E635] animate-spin" /> Đang tải dữ liệu tài khoản...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1527] text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Số Tài Khoản</th>
                  <th className="px-6 py-4">Chủ Tài Khoản / CIF</th>
                  <th className="px-6 py-4">Số Dư Khả Dụng</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Cập Nhật Sau Cùng</th>
                  <th className="px-6 py-4 text-right">Thao Tác Quầy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {accounts.map((acc) => (
                  <tr key={acc.accountNumber} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white text-sm">{acc.accountNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{acc.customerName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{acc.cif}</p>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#A3E635] text-sm font-mono">
                      ₫ {acc.balance.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        acc.status === "ACTIVE" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {acc.status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "ĐÃ PHONG TỎA (FROZEN)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{acc.updatedAt}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {acc.status === "ACTIVE" ? (
                        <button
                          onClick={() => {
                            setSelectedAcc(acc);
                            setFreezeModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Lock className="w-3.5 h-3.5" /> Khóa Tài Khoản
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAcc(acc);
                            setUnfreezeModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Unlock className="w-3.5 h-3.5" /> Mở Khóa Tài Khoản
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Freeze Modal */}
      {freezeModalOpen && selectedAcc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Xác nhận Khóa / Phong Tỏa Tài Khoản
              </h3>
              <button onClick={() => setFreezeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-red-950/60 rounded-2xl border border-red-500/30 text-xs text-red-200 space-y-1">
              <p className="font-bold">Đang phong tỏa tài khoản: {selectedAcc.accountNumber}</p>
              <p>Chủ tài khoản: <strong>{selectedAcc.customerName}</strong> (CIF: {selectedAcc.cif})</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Loại Hình Phong Tỏa</label>
                <select
                  value={lockType}
                  onChange={(e) => setLockType(e.target.value as any)}
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-medium text-white"
                >
                  <option value="FROZEN">Khóa toàn bộ (Khóa cả Ghi nợ & Ghi có)</option>
                  <option value="DEBIT_LOCKED">Khóa chiều Ghi nợ (Chỉ cho nạp tiền, không cho rút)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Lý Do Phong Tỏa</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 text-xs text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Số Công Văn / Mã Tham Chiếu Pháp Lý (Nếu có)</label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="VD: CV-2026/8812-BCA..."
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-red-500 font-mono text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setFreezeModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
                Hủy bỏ
              </button>
              <button onClick={handleFreezeConfirm} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md">
                Xác Nhận Phong Tỏa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unfreeze Modal */}
      {unfreezeModalOpen && selectedAcc && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-[#A3E635]" /> Xác nhận Mở Khóa Tài Khoản
              </h3>
              <button onClick={() => setUnfreezeModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Bạn có chắc chắn muốn mở khóa cho tài khoản <strong>{selectedAcc.accountNumber}</strong> ({selectedAcc.customerName})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setUnfreezeModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
                Hủy bỏ
              </button>
              <button onClick={handleUnfreezeConfirm} className="px-5 py-2.5 bg-[#A3E635] text-slate-950 font-bold text-xs rounded-xl shadow-md">
                Xác Nhận Mở Khóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
