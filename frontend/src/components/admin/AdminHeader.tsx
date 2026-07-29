"use client";

import React, { useState } from "react";
import { Search, Bell, RefreshCw, ChevronDown, Server } from "lucide-react";

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-20 bg-[#0B0F17] border-b border-slate-800/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-10 w-full text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Global Admin Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tra cứu hệ thống Admin (Mã NV, Role, Cron Job, IP...)"
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#141C2E] border border-slate-800 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Tools & Environment Badge */}
      <div className="flex items-center gap-4">
        {/* Environment Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Env: Production Primary
        </div>

        {/* Refresh button */}
        <button 
          onClick={() => window.location.reload()} 
          className="p-2 rounded-xl text-slate-400 hover:bg-[#141C2E] hover:text-white transition-colors cursor-pointer"
          title="Làm mới hệ thống"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl text-slate-400 hover:bg-[#141C2E] hover:text-white transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-90">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-white leading-tight">Phạm Minh Hoàng</p>
            <p className="text-[10px] text-slate-400 font-mono">System Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
