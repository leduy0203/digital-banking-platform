'use client';

import Link from "next/link";
import { Settings as SettingsIcon, Globe, Power, ShieldCheck, ChevronRight, BookUser } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BeneficiaryList } from "@/components/BeneficiaryList";

export default function BeneficiariesPage() {
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
            <Link href="/settings" className="flex items-center gap-2 hover:text-white transition-colors">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
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

        {/* Scrollable Main Content Area */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Danh bạ thụ hưởng</span>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Danh bạ người thụ hưởng</h1>
            <p className="text-xs text-slate-400 mt-1">Quản lý danh sách tài khoản thụ hưởng để thực hiện giao dịch chuyển tiền nhanh chóng</p>
          </div>

          {/* Beneficiary List Component Container */}
          <div className="pb-12">
            <BeneficiaryList />
          </div>
        </main>
      </div>
    </div>
  );
}
