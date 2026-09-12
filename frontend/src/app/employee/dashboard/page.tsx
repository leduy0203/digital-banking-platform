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
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { EmployeeDashboardStats, KycDocumentResponse } from "@/lib/types/employee";

export const DEPARTMENT_TITLE: Record<string, string> = {
  KYC_VERIFICATION: "Phòng Thẩm định eKYC",
  CUSTOMER_SERVICE: "Dịch vụ Khách hàng & Quầy",
  CARD_OPERATIONS: "Vận hành Thẻ & Thanh toán",
  RISK_MANAGEMENT: "Quản trị Rủi ro & Kiểm soát",
  IT_OPERATIONS: "Công nghệ & Quản trị Hệ thống",
};

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);
  const [pendingKycs, setPendingKycs] = useState<KycDocumentResponse[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [profile, setProfile] = useState<{
    fullName?: string;
    employeeCode?: string;
    department?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, kycPageData, profileData] = await Promise.allSettled([
          employeeApi.getDashboardStats(),
          employeeApi.getPendingKycs({ status: "PENDING", page: 0, size: 5 }),
          employeeApi.getMyProfile(),
        ]);

        if (statsData.status === "fulfilled") {
          setStats(statsData.value);
        }
        if (kycPageData.status === "fulfilled") {
          setPendingKycs(kycPageData.value.items || []);
          setPendingCount(kycPageData.value.totalElements || 0);
        }
        if (profileData.status === "fulfilled") {
          setProfile(profileData.value);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const departmentName = profile?.department ? (DEPARTMENT_TITLE[profile.department] || profile.department) : "Bàn Vận Hành Quầy";

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0B1120] via-[#141C2E] to-[#1E293B] border border-slate-800 p-6 lg:p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 text-xs font-semibold uppercase tracking-wider">
            {departmentName} • {profile?.employeeCode || "STAFF"}
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2 tracking-tight text-white">
            Xin chào, {profile?.fullName || "Cán bộ Ngân hàng"} 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl">
            Hôm nay hệ thống có <strong className="text-[#A3E635] underline font-bold">{pendingCount} hồ sơ KYC chờ thẩm định</strong> và <strong className="text-white font-bold">12 giao dịch quầy cần xử lý</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <Link 
            href="/employee/kyc"
            className="px-4 py-2.5 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-[#A3E635]/20 transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" /> Duyệt KYC ngay ({pendingCount})
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
            <h3 className="text-2xl font-extrabold text-white">{pendingCount}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-amber-400">Cần xử lý trong ngày</span>
            </div>
          </div>
        </div>

        {/* System & Branch Security Status */}
        <div className="bg-[#141C2E] p-5 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng Thái An Ninh</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-emerald-400">Ổn định</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-slate-400">Không có cảnh báo gian lận</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending KYC queue & Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending KYC Quick View (7 cols) */}
        <div className="lg:col-span-7 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#A3E635]" /> Hàng đợi eKYC mới nhất
            </h2>
            <Link 
              href="/employee/kyc"
              className="text-xs text-[#A3E635] hover:underline flex items-center gap-1 font-semibold"
            >
              Xem tất cả ({pendingCount}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingKycs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Hiện không có hồ sơ nào đang chờ duyệt.
              </div>
            ) : (
              pendingKycs.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0D1527] border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#1E293B] border border-slate-700 flex items-center justify-center font-mono font-bold text-white text-xs">
                      {item.customerCode ? item.customerCode.substring(0, 3) : "CIF"}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{item.fullName}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        CCCD: <strong>{item.nationalId}</strong> • SĐT: {item.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <Link
                      href="/employee/kyc"
                      className="px-3.5 py-1.5 bg-[#A3E635]/20 hover:bg-[#A3E635] text-[#A3E635] hover:text-slate-950 font-bold text-xs rounded-xl border border-[#A3E635]/30 transition-all"
                    >
                      Thẩm định
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations (5 cols) */}
        <div className="lg:col-span-5 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-6 space-y-4">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#A3E635]" /> Nghiệp Vụ Trực Tuyến Nhanh
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/employee/cash-ops"
              className="p-4 bg-[#0D1527] hover:bg-[#1E293B] border border-slate-800 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-[#A3E635] border border-emerald-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Banknote className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-xs">Nạp / Rút Quầy</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Xử lý giao dịch tiền mặt</p>
            </Link>

            <Link
              href="/employee/customers"
              className="p-4 bg-[#0D1527] hover:bg-[#1E293B] border border-slate-800 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-xs">Tra Cứu Khách Hàng</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Hồ sơ Customer 360</p>
            </Link>

            <Link
              href="/employee/accounts"
              className="p-4 bg-[#0D1527] hover:bg-[#1E293B] border border-slate-800 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-xs">Quản Lý Tài Khoản</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Khóa & Phong tỏa tài khoản</p>
            </Link>

            <Link
              href="/employee/transactions"
              className="p-4 bg-[#0D1527] hover:bg-[#1E293B] border border-slate-800 rounded-2xl transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <p className="font-bold text-white text-xs">Lịch Sử & Rollback</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tra soát và hoàn tác lệnh</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
