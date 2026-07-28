'use client';

import Link from "next/link";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  KeyRound, 
  Smartphone, 
  PhoneCall, 
  Shield, 
  Bell, 
  Mail, 
  Wallet, 
  MonitorCheck, 
  MessageSquare, 
  Palette, 
  HelpCircle, 
  BookOpen, 
  FileText,
  Sparkles
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column (Fixed Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Taller & Spacious Fixed Topbar (h-20) */}
        <header className="h-20 px-8 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 bg-[#0D1527]/95 backdrop-blur-md shrink-0 z-30 shadow-md">
          <div className="flex items-center gap-3 bg-[#141C2E] border border-slate-800/80 px-4 py-2 rounded-full">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              CD
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-sm tracking-wide">LÊ CÔNG DUY</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Tiêu chuẩn &gt;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <Link href="/settings" className="flex items-center gap-2 text-white font-bold transition-colors">
              <SettingsIcon className="w-4 h-4 text-[#A3E635]" />
              <span>Cài đặt</span>
            </Link>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">English</span>
            </button>
            <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
              <Power className="w-4 h-4" />
              <span>Đăng xuất</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Main Content Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Cài đặt hệ thống</span>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Cài đặt</h1>
            <p className="text-xs text-slate-400 mt-1">Quản lý cài đặt tài khoản, cấu hình bảo mật và tùy chỉnh giao diện số</p>
          </div>

          {/* Theme Banner Pill Card */}
          <div className="bg-gradient-to-r from-[#141C2E] via-[#1A253D] to-[#141C2E] border border-emerald-500/30 rounded-3xl p-5 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] shadow-md">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Giao diện ứng dụng đang chọn:</span>
                <div className="font-black text-lg text-white flex items-center gap-2 mt-0.5">
                  <span className="text-[#A3E635]">YouPro Midnight Neon</span>
                  <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px] px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 mr-1" /> Mặc định
                  </Badge>
                </div>
              </div>
            </div>

            <button className="bg-[#1A253D] hover:bg-[#253554] border border-slate-700 text-slate-200 hover:text-white text-xs font-extrabold px-5 py-3 rounded-full transition-all shadow-md">
              Cài đặt giao diện
            </button>
          </div>

          {/* SECTION 1: BẢO MẬT (SECURITY) */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Bảo mật</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Change Password Card */}
              <Link 
                href="/settings/change-password"
                className="bg-[#1A253D]/80 hover:bg-[#253554] border border-slate-700/80 hover:border-[#A3E635] p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 group cursor-pointer shadow-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] group-hover:scale-110 transition-transform">
                  <KeyRound className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-[#A3E635] transition-colors">Đổi mật khẩu đăng nhập</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Cập nhật mật khẩu bảo vệ tài khoản</div>
                </div>
              </Link>

              {/* SMS OTP Phone Number */}
              <div className="bg-[#1A253D]/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Số điện thoại SMS OTP</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">098 •••• 888 (Đã xác minh)</div>
                </div>
              </div>

              {/* Smart / Soft OTP Password */}
              <div className="bg-[#1A253D]/50 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Cấp mật khẩu Phone Banking</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Tra cứu thông tin qua tổng đài</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: QUẢN LÝ VÀ THIẾT LẬP (PREFERENCES) */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-emerald-400" />
              <span>Quản lý và thiết lập</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <Bell className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">Quản lý thông báo</span>
              </div>

              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <Mail className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">Quản lý Email nhận OTT</span>
              </div>

              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <Wallet className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">Tài khoản mặc định</span>
              </div>

              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <MonitorCheck className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">Quản lý đăng nhập kênh</span>
              </div>

              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <MessageSquare className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">SMS Banking</span>
              </div>

              <div className="bg-[#1A253D]/60 hover:bg-[#1A253D] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all cursor-pointer">
                <Palette className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs text-white">Cài đặt hình nền</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: THÔNG TIN HỖ TRỢ */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white border-b border-slate-800/80 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Thông tin hỗ trợ & Pháp lý</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1A253D]/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-all">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Hướng dẫn sử dụng ứng dụng</span>
              </div>
              <div className="bg-[#1A253D]/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-all">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Câu hỏi thường gặp (FAQ)</span>
              </div>
              <div className="bg-[#1A253D]/40 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-all">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Điều khoản & Điều kiện dịch vụ</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
