'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  Globe, 
  Power, 
  ShieldCheck, 
  Copy, 
  Eye, 
  EyeOff, 
  History, 
  CreditCard, 
  Plus, 
  ArrowRightLeft, 
  Wallet, 
  Wifi, 
  Smartphone, 
  TrendingUp, 
  FileSearch, 
  SlidersHorizontal,
  Sparkles,
  Camera,
  Clock,
  AlertTriangle,
  User,
  Loader2
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CustomerTopbar } from "@/components/layout/CustomerTopbar";
import { customerApi, CustomerProfile } from "@/lib/api/customerApi";
import { accountApi, AccountResponseData } from "@/lib/api/accountApi";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [accounts, setAccounts] = useState<AccountResponseData[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Fetch Profile
    customerApi.getMyProfile()
      .then((res) => {
        if (res?.success && res.data) {
          setProfile(res.data);
        }
      })
      .catch(() => {
        // Fallback
      });

    // 2. Fetch Accounts list via /api/v1/accounts/my-accounts
    accountApi.getMyAccounts()
      .then((res) => {
        if (res?.success && res.data) {
          setAccounts(res.data);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setIsLoadingAccounts(false);
      });
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'CD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const copyAccountNumber = (accNum?: string) => {
    if (!accNum) return;
    navigator.clipboard.writeText(accNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Primary checking account or first account
  const primaryAccount = accounts.find(a => a.accountType === 'CHECKING') || accounts[0];
  const defaultAccountNumber = primaryAccount?.accountNumber || "9333xxxxxx";
  const defaultBalanceFormatted = (primaryAccount?.availableBalance ?? primaryAccount?.balance ?? 0).toLocaleString('vi-VN');

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column (Fixed Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Dynamic Connected Topbar */}
        <CustomerTopbar />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900/60 via-emerald-800/40 to-cyan-900/60 border border-slate-700/50 shadow-2xl p-8 min-h-[320px] flex flex-col justify-between">
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.3),transparent_50%)]"></div>
            
            {/* Top User Profile Header */}
            <div className="flex items-center justify-between z-10">
              <Link 
                href="/profile"
                className="flex items-center gap-4 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-md p-2.5 pr-6 rounded-full border border-slate-700/60 hover:border-[#A3E635]/50 transition-all group"
              >
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md group-hover:scale-105 transition-transform" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-base shadow-md group-hover:scale-105 transition-transform">
                    {getInitials(profile?.fullName)}
                  </div>
                )}
                <div>
                  <h2 className="font-extrabold text-base text-white tracking-wide group-hover:text-[#A3E635] transition-colors">
                    {profile?.fullName || "KHÁCH HÀNG"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    {profile?.kycStatus === 'VERIFIED' ? (
                      <span className="text-[#A3E635] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> eKYC Đã xác minh &gt;
                      </span>
                    ) : profile?.kycStatus === 'REJECTED' ? (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> eKYC Bị từ chối &gt;
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> eKYC Chờ xét duyệt &gt;
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <Link 
                href="/profile"
                className="bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-md"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xem hồ sơ chi tiết</span>
              </Link>
            </div>

            {/* Favorite Actions Section */}
            <div className="z-10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-base text-white tracking-wide">Chức năng ưa thích</h3>
                <button className="text-xs text-[#A3E635] flex items-center gap-1.5 hover:underline font-semibold">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Tùy chỉnh</span>
                </button>
              </div>

              {/* 6 Quick Action Round Buttons */}
              <div className="grid grid-cols-6 gap-4 text-center">
                <Link href="/transfers" className="group flex flex-col items-center gap-2.5">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <ArrowRightLeft className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Chuyển tiền trong nước
                  </span>
                </Link>

                <div className="group flex flex-col items-center gap-2.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Nạp tiền ví điện tử
                  </span>
                </div>

                <div className="group flex flex-col items-center gap-2.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Nạp Data 4G/5G
                  </span>
                </div>

                <div className="group flex flex-col items-center gap-2.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Nạp tiền điện thoại
                  </span>
                </div>

                <div className="group flex flex-col items-center gap-2.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Mở tài khoản chứng khoán
                  </span>
                </div>

                <div className="group flex flex-col items-center gap-2.5 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#162238]/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-[#A3E635] group-hover:text-[#A3E635] transition-all shadow-lg">
                    <FileSearch className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-200 group-hover:text-white font-medium max-w-[100px] leading-tight">
                    Tra soát trực tuyến
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Main Bottom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            {/* Card 1: Payment Account */}
            <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-base text-white mb-4">Tài khoản thanh toán</h4>

                <div className="bg-[#1A253D] border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-semibold tracking-wide bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full uppercase">
                    Tài khoản mặc định
                  </span>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Số tài khoản</span>
                      <button 
                        onClick={() => copyAccountNumber(defaultAccountNumber)}
                        className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Sao chép số tài khoản"
                      >
                        <span className="font-mono font-bold text-white text-sm">{defaultAccountNumber}</span>
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        {copied && <span className="text-[10px] text-[#A3E635] font-bold">Đã chép!</span>}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                      <span>Số dư khả dụng</span>
                      <div className="flex items-center gap-2">
                        {isLoadingAccounts ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#A3E635]" />
                        ) : (
                          <span className="font-mono font-bold text-[#A3E635] text-base">
                            {showBalance ? `${defaultBalanceFormatted} VND` : "•••••••• VND"}
                          </span>
                        )}
                        <button 
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                    <Link href="/transactions" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                      <History className="w-3.5 h-3.5" />
                      <span>Lịch sử giao dịch</span>
                    </Link>
                    <Link href="/accounts" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Tài khoản & Thẻ</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Neon Lime Action Button */}
              <Link href="/transfers" className="w-full mt-6 block">
                <button className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/20 transition-all cursor-pointer">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Chuyển tiền ngay</span>
                </button>
              </Link>
            </div>

            {/* Card 2: Personal Finance Management */}
            <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-base text-white mb-4 text-center">Quản lý tài chính cá nhân</h4>

                {/* Spending Bar Chart Graphics */}
                <div className="h-28 flex items-end justify-center gap-3 py-2 px-4 border-b border-slate-800/80 mb-4">
                  {[
                    { label: "T2", height: "h-12" },
                    { label: "T3", height: "h-20" },
                    { label: "T4", height: "h-14" },
                    { label: "T5", height: "h-24" },
                    { label: "T6", height: "h-10" },
                    { label: "T7", height: "h-22" },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div className={`w-3.5 ${bar.height} bg-gradient-to-t from-emerald-600 to-[#A3E635] rounded-full shadow-sm`}></div>
                      <span className="text-[10px] text-slate-400 font-semibold">{bar.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 font-semibold text-center leading-relaxed">
                  Lập kế hoạch và quản lý chi tiêu hiệu quả
                </p>
              </div>

              <button className="w-full mt-6 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/20 transition-all">
                <span>Khám phá ngay</span>
              </button>
            </div>

            {/* Card 3: Digital Loyalty Rewards */}
            <div className="bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900 border border-fuchsia-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl">💰</div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-extrabold text-xl">Digital Loyalty</h4>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <p className="text-xs text-fuchsia-100 leading-relaxed font-medium">
                  Tích điểm đổi quà không giới hạn cho mọi giao dịch thanh toán.
                </p>
              </div>

              <button className="w-full mt-6 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#A3E635]/20 transition-all">
                <span>Trải nghiệm ngay</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
