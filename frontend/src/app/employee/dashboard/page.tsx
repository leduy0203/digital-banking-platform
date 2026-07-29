"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  CreditCard, 
  UserCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Banknote, 
  FileText, 
  Clock, 
  Activity, 
  ChevronRight
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { EmployeeDashboardStats, KycApplication } from "@/lib/types/employee";

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [pendingKyc, setPendingKyc] = useState<KycApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [statsData, kycData] = await Promise.all([
        employeeApi.getDashboardStats(),
        employeeApi.getKycApplications(),
      ]);
      setStats(statsData);
      setPendingKyc(kycData.filter(k => k.status === "PENDING"));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0B1120] via-[#141C2E] to-[#1E293B] border border-slate-800 p-6 lg:p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 text-xs font-semibold uppercase tracking-wider">
            Bàn Vận Hành Quầy • CN Bến Thành
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight text-white">Xin chào, Nguyễn Văn An 👋</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
            Hôm nay bạn có <strong className="text-[#A3E635] underline font-bold">{stats?.pendingKycCount || 28} hồ sơ KYC chờ duyệt</strong> và <strong className="text-white font-bold">12 giao dịch quầy cần xử lý</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link 
            href="/employee/kyc"
            className="px-4 py-2.5 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-[#A3E635]/20 transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" /> Duyệt KYC ngay ({stats?.pendingKycCount || 28})
          </Link>
          <Link 
            href="/employee/cash-ops"
            className="px-4 py-2.5 bg-[#0D1527] border border-slate-700 text-white hover:bg-slate-800 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Banknote className="w-4 h-4 text-[#A3E635]" /> Giao dịch Quầy
          </Link>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform translate-x-10 pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Khách Hàng</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-[#A3E635] border border-emerald-500/30 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white">
              {stats?.totalCustomers ? stats.totalCustomers.toLocaleString("vi-VN") : "124,580"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-[#A3E635] flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{stats?.customerGrowthPercent || 12.4}%
              </span>
              <span className="text-[11px] text-slate-400">so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Today's Transactions Volume */}
        <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giao Dịch Hôm Nay</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white">
              ₫ {stats?.todayTransactionVolume ? (stats.todayTransactionVolume / 1000000000).toFixed(1) + " Tỷ" : "45.2 Tỷ"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-blue-400">{stats?.todayTransactionCount || 1420} bút toán</span>
              <span className="text-[11px] text-slate-400">• Đã quyết toán</span>
            </div>
          </div>
        </div>

        {/* Pending KYC Queue */}
        <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KYC Chờ Duyệt</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-amber-400">{stats?.pendingKycCount || 28} Hồ sơ</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-amber-400">Ưu tiên xử lý</span>
              <span className="text-[11px] text-slate-400">• Chờ ~15m</span>
            </div>
          </div>
        </div>

        {/* Frozen Accounts */}
        <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TK Cảnh Báo / Khóa</span>
            <div className="w-10 h-10 rounded-2xl bg-red-950/80 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-red-400">{stats?.frozenAccountCount || 5} TK</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-red-400">02 mở khóa</span>
              <span className="text-[11px] text-slate-400">• Thẩm định</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Urgent KYC Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#A3E635]" /> Hồ Sơ KYC Cần Xử Lý Gấp
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Danh sách mở tài khoản eKYC mới từ ứng dụng mobile</p>
              </div>
              <Link href="/employee/kyc" className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0D1527] text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Mã CIF</th>
                    <th className="px-5 py-3.5">Họ & Tên</th>
                    <th className="px-5 py-3.5">Số CCCD</th>
                    <th className="px-5 py-3.5">Khớp Khai Báo</th>
                    <th className="px-5 py-3.5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {pendingKyc.map((kyc) => (
                    <tr key={kyc.id} className="hover:bg-[#1E293B]/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-white">{kyc.cif}</td>
                      <td className="px-5 py-3.5 font-bold text-white">{kyc.fullName}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{kyc.idNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          kyc.aiScore > 90 ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                        }`}>
                          {kyc.aiScore}% ({kyc.aiScore > 90 ? "Match" : "Check Ảnh"})
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link 
                          href="/employee/kyc"
                          className="px-3.5 py-1.5 bg-[#A3E635] text-slate-950 text-xs font-bold rounded-xl hover:bg-[#86efac] transition-colors"
                        >
                          Thẩm định
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Cashflow Flow Bar */}
          <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" /> Biểu Đồ Dòng Tiền Quầy Trong Ngày
              </h2>
              <span className="text-xs text-slate-400 font-medium">Cập nhật real-time</span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Tổng Nạp Tiền Mặt (Cash In)</span>
                  <span className="text-[#A3E635] font-bold font-mono">₫ 28,450,000,000</span>
                </div>
                <div className="w-full bg-[#0D1527] h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-[#A3E635] h-full rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Tổng Rút Tiền Mặt (Cash Out)</span>
                  <span className="text-blue-400 font-bold font-mono">₫ 16,750,000,000</span>
                </div>
                <div className="w-full bg-[#0D1527] h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Teller Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nghiệp Vụ Quầy Nhanh</h2>
            
            <Link href="/employee/cash-ops?tab=DEPOSIT" className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 hover:border-[#A3E635] hover:bg-[#0D1527] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-[#A3E635] border border-emerald-500/30 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#A3E635]">Nạp Tiền Mặt Vấn Tin</p>
                  <p className="text-[10px] text-slate-400">Nạp trực tiếp vào STK khách hàng</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/employee/cash-ops?tab=WITHDRAW" className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 hover:border-blue-500 hover:bg-[#0D1527] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-blue-400">Rút Tiền Xác Minh Chữ Ký</p>
                  <p className="text-[10px] text-slate-400">Đối chiếu chữ ký mẫu + OTP</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/employee/accounts" className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 hover:border-red-500 hover:bg-[#0D1527] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/80 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-red-400">Khóa / Mở Khóa Tài Khoản</p>
                  <p className="text-[10px] text-slate-400">Cập nhật trạng thái phong tỏa</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/employee/transactions" className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-800 hover:border-slate-600 hover:bg-[#0D1527] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Yêu Cầu Rollback / Đảo GD</p>
                  <p className="text-[10px] text-slate-400">Kiểm soát 2 cấp Maker-Checker</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
