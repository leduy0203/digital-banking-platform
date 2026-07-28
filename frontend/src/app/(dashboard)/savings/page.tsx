'use client';

import Link from "next/link";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  PiggyBank, 
  TrendingUp, 
  Wallet,
  Clock,
  Sparkles,
  Lock
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { SavingsForm } from "@/components/SavingsForm";
import { Badge } from "@/components/ui/badge";

export default function SavingsPage() {
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
            <span>Tiết kiệm</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Mở sổ tiết kiệm trực tuyến</span>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Tiết kiệm trực tuyến</h1>
            <p className="text-xs text-slate-400 mt-1">Gửi tiết kiệm tích lũy nhận lãi suất ưu đãi online lên đến 6.2%/năm</p>
          </div>

          {/* 2-Column Content Layout: Savings Form (Left) + Active Savings Showcase Rail (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pb-12">
            {/* Left 3 Columns: Main Savings Calculator Form */}
            <div className="lg:col-span-3">
              <SavingsForm />
            </div>

            {/* Right 1 Column: Active Savings Deposits Showcase */}
            <div className="space-y-4 hidden lg:block sticky top-6">
              <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Sổ tiết kiệm đang gửi</h4>
                  <PiggyBank className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="space-y-3">
                  {/* Active Savings Deposit Card 1 */}
                  <div className="bg-[#1A253D] border border-emerald-500/30 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">#SAV-981240</span>
                      <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[9px] px-2 py-0.5">
                        5.8%/năm
                      </Badge>
                    </div>
                    <div className="font-mono font-black text-xl text-[#A3E635]">
                      50,000,000 VND
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                      <span>Lãi tích lũy:</span>
                      <span className="text-emerald-400 font-bold font-mono">+1,450,000 VND</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Tất toán: 15/08/2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
