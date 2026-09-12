"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  X
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { Customer360 } from "@/lib/types/employee";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";

const kycFilterOptions: CustomSelectOption[] = [
  { value: "ALL", label: "Tất cả Trạng Thái KYC" },
  { value: "VERIFIED", label: "Đã Định Danh (VERIFIED)" },
  { value: "PENDING", label: "Chờ Thẩm Định (PENDING)" },
  { value: "REJECTED", label: "Từ Chối (REJECTED)" },
];

export default function AdminCustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer360[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kycFilter, setKycFilter] = useState<string>("ALL");
  const [selectedCif, setSelectedCif] = useState<string>("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await employeeApi.getCustomers(searchTerm);
        let filtered = data;
        if (kycFilter !== "ALL") {
          filtered = filtered.filter(c => c.kycStatus === kycFilter);
        }
        setCustomers(filtered);
        if (filtered.length > 0 && (!selectedCif || !filtered.some(c => c.cif === selectedCif))) {
          setSelectedCif(filtered[0].cif);
        }
      } catch (err) {
        console.error("Failed to load customer list", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchTerm, kycFilter]);

  const selectedCustomer = customers.find(c => c.cif === selectedCif) || customers[0];
  const totalBalance = selectedCustomer ? selectedCustomer.accounts.reduce((acc, curr) => acc + curr.balance, 0) : 0;

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

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
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
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
            <Users className="w-6 h-6 text-indigo-400" /> Quản Lý Khách Hàng (Customer 360)
          </h1>
          <p className="text-xs text-slate-400">Tra cứu hồ sơ khách hàng, giám sát hạn mức, số dư tài sản và trạng thái định danh eKYC</p>
        </div>
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
              placeholder="Tra cứu theo Mã CIF, Tên, CCCD, SĐT..."
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

          {/* Filter KYC Status (Custom Smooth Dropdown) */}
          <CustomSelect
            value={kycFilter}
            onChange={setKycFilter}
            options={kycFilterOptions}
            icon={Filter}
            className="w-full sm:w-56"
            menuWidth="w-60"
          />
        </div>

        {/* Clear filter */}
        {(searchTerm || kycFilter !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setKycFilter("ALL");
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Main Grid: Left List (4 cols) + Right Detail 360 (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Customer List Panel */}
        <div className="lg:col-span-4 bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <span>Danh sách kết quả ({customers.length})</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> Đang tải danh sách...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Không tìm thấy khách hàng nào.
            </div>
          ) : (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {customers.map((cust) => {
                const isSelected = selectedCustomer && cust.cif === selectedCustomer.cif;
                return (
                  <div
                    key={cust.cif}
                    onClick={() => setSelectedCif(cust.cif)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-indigo-500 bg-[#1E293B] shadow-sm" 
                        : "border-slate-800/80 hover:border-slate-700 bg-[#0B0F17]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-400">{cust.cif}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.kycStatus === "VERIFIED" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : cust.kycStatus === "PENDING"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {cust.kycStatus === "VERIFIED" ? "ĐÃ KYC" : cust.kycStatus === "PENDING" ? "CHỜ DUYỆT" : "TỪ CHỐI"}
                      </span>
                    </div>

                    <p className="font-bold text-white text-xs mt-1.5">{cust.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">SĐT: {cust.phone}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Customer 360 Overview */}
        {selectedCustomer ? (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm p-6 space-y-6">
            {/* Main Profile Banner */}
            <div className="bg-[#0B0F17] border border-slate-800 text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
                    {selectedCustomer.cif}
                  </span>
                  <span className="text-xs text-slate-400">Mở ngày: {selectedCustomer.registeredDate}</span>
                </div>
                <h2 className="text-xl font-bold mt-1 text-white">{selectedCustomer.fullName}</h2>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 font-mono">
                  <span>CCCD: <strong>{selectedCustomer.idNumber}</strong></span>
                  <span>•</span>
                  <span>SĐT: <strong>{selectedCustomer.phone}</strong></span>
                </p>
              </div>

              <div className="text-left md:text-right bg-[#141C2E] p-3.5 rounded-xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng Tài Sản Quản Lý</p>
                <p className="text-xl font-extrabold text-indigo-400 font-mono">₫ {totalBalance.toLocaleString("vi-VN")}</p>
                <p className="text-[10px] text-slate-400">{selectedCustomer.accounts.length} Tài khoản liên kết</p>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0B0F17] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email liên hệ</span>
                  <span className="font-bold text-white">{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số Điện Thoại Nhận OTP</span>
                  <span className="font-bold font-mono text-white">{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Địa Chỉ Thường Trú Đăng Ký</span>
                  <span className="font-medium text-slate-200">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>

            {/* Linked Bank Accounts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" /> Danh Sách Tài Khoản Thanh Toán & Tiết Kiệm (CIF {selectedCustomer.cif})
              </h3>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-[#0B0F17]">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0D1527] text-slate-400 font-semibold uppercase border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Số Tài Khoản</th>
                      <th className="px-4 py-3">Loại Tài Khoản</th>
                      <th className="px-4 py-3">Số Dư Khả Dụng</th>
                      <th className="px-4 py-3">Trạng Thái</th>
                      <th className="px-4 py-3 text-right">Quản Trị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedCustomer.accounts.map((acc) => (
                      <tr key={acc.accountNumber} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-white">{acc.accountNumber}</td>
                        <td className="px-4 py-3 font-medium text-slate-300">
                          {acc.accountType === "CHECKING" ? "Tài khoản thanh toán" : "Tài khoản tiết kiệm"}
                        </td>
                        <td className="px-4 py-3 font-bold text-indigo-400 font-mono">
                          ₫ {acc.balance.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            acc.status === "ACTIVE" 
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                              : "bg-red-950/80 text-red-400 border border-red-500/30"
                          }`}>
                            {acc.status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => showToast(`Đã gửi yêu cầu giám sát tài khoản ${acc.accountNumber}`)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                          >
                            Giám Sát
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm p-12 text-center text-slate-500 text-xs">
            Vui lòng chọn khách hàng bên danh sách để xem hồ sơ 360°.
          </div>
        )}
      </div>
    </div>
  );
}
