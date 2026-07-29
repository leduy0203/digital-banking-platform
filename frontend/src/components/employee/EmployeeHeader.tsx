"use client";

import React, { useState } from "react";
import { Search, Bell, RefreshCw, ChevronDown, ShieldCheck } from "lucide-react";

export function EmployeeHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-20 bg-[#0D1527] border-b border-slate-800/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 shadow-lg w-full text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Global Quick Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tra cứu nhanh toàn hệ thống (Nhập CIF, CCCD, STK, SĐT...)"
            className="w-full pl-12 pr-4 py-3 text-sm bg-[#141C2E] border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A3E635] transition-all font-medium"
          />
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#141C2E] border border-slate-700 rounded-2xl shadow-2xl p-3 text-xs z-50">
              <p className="font-bold text-slate-400 px-2 py-1 uppercase text-[11px]">Kết quả gợi ý nhanh</p>
              <div className="hover:bg-[#1E293B] p-3 rounded-xl cursor-pointer flex justify-between items-center transition-colors">
                <span className="font-bold text-[#A3E635] text-sm">CIF-90124 (Trần Thị Bích Ngọc)</span>
                <span className="text-slate-300 font-mono text-xs font-bold">STK: 1019283746</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Header Status & Tools */}
      <div className="flex items-center gap-5">
        {/* System Health Status */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Core Banking: Online (Latency 12ms)
        </div>

        {/* Refresh button */}
        <button 
          onClick={() => window.location.reload()} 
          className="p-2.5 rounded-2xl text-slate-400 hover:bg-[#141C2E] hover:text-white transition-colors cursor-pointer"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2.5 rounded-2xl text-slate-400 hover:bg-[#141C2E] hover:text-white transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0D1527]"></span>
          </button>
        </div>

        <div className="h-7 w-px bg-slate-800"></div>

        {/* Staff Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-90">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
            NVA
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-extrabold text-white leading-tight">Nguyễn Văn An</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">ROLE_EMPLOYEE</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
