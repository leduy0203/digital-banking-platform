"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { Customer360 } from "@/lib/types/employee";

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<Customer360[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCif, setSelectedCif] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await employeeApi.getCustomers(searchTerm);
      setCustomers(data);
      if (data.length > 0 && !selectedCif) {
        setSelectedCif(data[0].cif);
      }
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  const selectedCustomer = customers.find(c => c.cif === selectedCif) || customers[0];

  const totalBalance = selectedCustomer ? selectedCustomer.accounts.reduce((acc, curr) => acc + curr.balance, 0) : 0;

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-[#A3E635]" /> Quản Lý & Tra Cứu Khách Hàng (Customer 360)
          </h1>
          <p className="text-xs text-slate-400">Xem hồ sơ tổng thể, danh sách tài khoản liên kết và trạng thái hạn mức</p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Search & List Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo CIF, Tên, CCCD, SĐT..."
              className="w-full pl-10 pr-3 py-2.5 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            />
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E635] animate-spin" /> Đang tải danh sách...
            </div>
          ) : (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {customers.map((cust) => {
                const isSelected = selectedCustomer && cust.cif === selectedCustomer.cif;
                return (
                  <div
                    key={cust.cif}
                    onClick={() => setSelectedCif(cust.cif)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[#A3E635] bg-[#1E293B] shadow-md" 
                        : "border-slate-800/80 hover:border-slate-700 bg-[#0D1527]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{cust.cif}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.kycStatus === "VERIFIED" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}>
                        {cust.kycStatus === "VERIFIED" ? "Đã KYC" : "Chưa KYC"}
                      </span>
                    </div>

                    <p className="font-bold text-white text-sm mt-1">{cust.fullName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">SĐT: {cust.phone}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Customer 360 Overview (8 cols) */}
        {selectedCustomer && (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-6 lg:p-7 space-y-6">
            {/* Customer Main Banner Card */}
            <div className="bg-gradient-to-br from-[#0B1120] via-[#162238] to-[#1E293B] border border-slate-700/80 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] font-mono text-xs font-bold border border-[#A3E635]/30">
                    {selectedCustomer.cif}
                  </span>
                  <span className="text-xs text-slate-400">Mở ngày: {selectedCustomer.registeredDate}</span>
                </div>
                <h2 className="text-2xl font-extrabold mt-1">{selectedCustomer.fullName}</h2>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                  <span>CCCD: <strong>{selectedCustomer.idNumber}</strong></span>
                  <span>•</span>
                  <span>SĐT: <strong>{selectedCustomer.phone}</strong></span>
                </p>
              </div>

              <div className="text-left md:text-right bg-[#0D1527] p-4 rounded-2xl border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng Tài Sản Quản Lý</p>
                <p className="text-2xl font-extrabold text-[#A3E635]">₫ {totalBalance.toLocaleString("vi-VN")}</p>
                <p className="text-[10px] text-slate-400">{selectedCustomer.accounts.length} Tài khoản liên kết</p>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#0D1527] p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-slate-400 block">Địa chỉ Email</span>
                  <span className="font-bold text-white">{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-slate-400 block">Số Điện Thoại Nhận OTP</span>
                  <span className="font-bold font-mono text-white">{selectedCustomer.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-slate-400 block">Địa Chỉ Đăng Ký Thường Trú</span>
                  <span className="font-medium text-slate-200">{selectedCustomer.address}</span>
                </div>
              </div>
            </div>

            {/* Linked Bank Accounts */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#A3E635]" /> Danh Sách Tài Khoản Thuộc CIF {selectedCustomer.cif}
              </h3>

              <div className="overflow-x-auto border border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#0D1527] text-slate-400 font-semibold uppercase border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Số Tài Khoản</th>
                      <th className="px-4 py-3.5">Loại Tài Khoản</th>
                      <th className="px-4 py-3.5">Số Dư Khả Dụng</th>
                      <th className="px-4 py-3.5">Trạng Thái</th>
                      <th className="px-4 py-3.5 text-right">Thao Tác Quầy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedCustomer.accounts.map((acc) => (
                      <tr key={acc.accountNumber} className="hover:bg-[#1E293B]/50">
                        <td className="px-4 py-3.5 font-mono font-bold text-white">{acc.accountNumber}</td>
                        <td className="px-4 py-3.5 font-medium">
                          {acc.accountType === "CHECKING" ? "Tài khoản thanh toán" : "Tài khoản tiết kiệm"}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#A3E635] font-mono">
                          ₫ {acc.balance.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            acc.status === "ACTIVE" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" : "bg-red-950/80 text-red-400 border border-red-500/30"
                          }`}>
                            {acc.status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a 
                            href={`/employee/cash-ops?account=${acc.accountNumber}`}
                            className="px-3 py-1.5 bg-[#0D1527] hover:bg-[#A3E635] hover:text-slate-950 border border-slate-700 text-white font-semibold rounded-xl transition-all"
                          >
                            Nạp / Rút
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
