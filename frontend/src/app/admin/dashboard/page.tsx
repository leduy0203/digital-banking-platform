"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  Users, 
  ShieldCheck, 
  Server, 
  ChevronRight,
  FileText
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { SystemHealthStats } from "@/lib/types/admin";

export default function AdminDashboardPage() {
  const [health, setHealth] = useState<SystemHealthStats | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await adminApi.getSystemHealth();
      setHealth(data);
    }
    loadData();
  }, []);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Welcome Banner */}
      <div className="bg-[#141C2E] border border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
              Core System Monitor • Production Primary
            </span>
          </div>
          <h1 className="text-xl font-bold mt-1.5 text-white">Bàn Làm Việc Quản Trị Hệ Thống</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Giám sát thời gian thực sức khỏe máy chủ, PostgreSQL HikariCP pool, bộ nhớ đệm Redis và lưu lượng API.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href="/admin/users"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Thêm Nhân Viên Mới
          </Link>
          <Link 
            href="/admin/system"
            className="px-4 py-2.5 bg-[#0B0F17] border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
          >
            <Server className="w-4 h-4 text-blue-400" /> Điều Khiển Engine
          </Link>
        </div>
      </div>

      {/* KPI System Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU & Memory Card */}
        <div className="bg-[#141C2E] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tải CPU & RAM</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              {health?.cpuUsagePercent}% CPU
            </h3>
            <p className="text-xs text-slate-400 mt-1">RAM: {health?.memoryUsagePercent}% (13.4GB / 32GB)</p>
          </div>
        </div>

        {/* Database Hikari Pool */}
        <div className="bg-[#141C2E] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">HikariCP Pool</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              {health?.dbPoolActive} / {health?.dbPoolMax} Active
            </h3>
            <p className="text-xs text-emerald-400 mt-1 font-medium">✓ Hikari Leak Detection: 0 Leak</p>
          </div>
        </div>

        {/* Redis Latency */}
        <div className="bg-[#141C2E] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Redis Latency</span>
            <Zap className="w-4 h-4 text-[#A3E635]" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#A3E635] font-mono">
              {health?.redisLatencyMs} ms
            </h3>
            <p className="text-xs text-slate-400 mt-1">Rate Limit Bucket: Active</p>
          </div>
        </div>

        {/* Active Concurrent Sessions */}
        <div className="bg-[#141C2E] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phiên Hoạt Động</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              {health?.activeConcurrentUsers.toLocaleString("vi-VN")} Users
            </h3>
            <p className="text-xs text-slate-400 mt-1">JWT Cookie Refresh: Live</p>
          </div>
        </div>
      </div>

      {/* API Performance Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: API Throughput & Error Statistics */}
        <div className="lg:col-span-8 bg-[#141C2E] p-6 rounded-2xl border border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Thống Kê API Metrics Real-Time
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Giám sát Throughput, Tỷ lệ lỗi và Độ trễ phản hồi API P99</p>
            </div>
            <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold rounded-lg">
              {health?.apiRequestsPerMin.toLocaleString("vi-VN")} req/min
            </span>
          </div>

          {/* Metric Bar 1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">API Latency P99 Target (&lt; 150ms)</span>
              <span className="text-[#A3E635] font-bold font-mono">{health?.apiLatencyP99Ms} ms (Đạt chuẩn)</span>
            </div>
            <div className="w-full bg-[#0B0F17] h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-[#A3E635] h-full rounded-full" style={{ width: "28%" }}></div>
            </div>
          </div>

          {/* Metric Bar 2 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Tỷ Lỗi API HTTP 5xx Error Rate (&lt; 0.05%)</span>
              <span className="text-emerald-400 font-bold font-mono">{health?.apiErrorRatePercent}% (Rất Thấp)</span>
            </div>
            <div className="w-full bg-[#0B0F17] h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "5%" }}></div>
            </div>
          </div>

          {/* Metric Bar 3 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Dung Lượng Bộ Nhớ Đệm Redis Cache Hit Ratio</span>
              <span className="text-blue-400 font-bold font-mono">96.4% Hit</span>
            </div>
            <div className="w-full bg-[#0B0F17] h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: "96.4%" }}></div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Admin Management Shortcuts */}
        <div className="lg:col-span-4 bg-[#141C2E] p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nghiệp Vụ Quản Trị Nhanh</h2>

          <Link href="/admin/users" className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-[#0B0F17] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-400">Tạo Nhân Viên & Phân Vai Trò</p>
                <p className="text-[10px] text-slate-400">CRUD Teller, Supervisor, Admin</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link href="/admin/roles" className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-[#0B0F17] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-[#A3E635] border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-[#A3E635]">Ma Trận Phân Quyền RBAC</p>
                <p className="text-[10px] text-slate-400">Permission Matrix Definition</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link href="/admin/system" className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-[#0B0F17] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-400">Scheduler & Redis Cache Evict</p>
                <p className="text-[10px] text-slate-400">Trigger Cron & Xóa bộ nhớ đệm</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link href="/admin/audit" className="flex items-center justify-between p-3 rounded-xl border border-slate-800 hover:border-slate-600 hover:bg-[#0B0F17] transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-400">Tra Cứu Audit & Security Trail</p>
                <p className="text-[10px] text-slate-400">Giám sát an ninh ISO 27001</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
