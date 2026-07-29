"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { AuditLogItem } from "@/lib/types/admin";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminApi.getAuditLogs(searchTerm);
      setLogs(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" /> Audit & Security Logs (ISO 27001)
          </h1>
          <p className="text-xs text-slate-400">Tra cứu toàn bộ lịch sử tác động hệ thống của Nhân viên, Khách hàng và Tiến trình tự động</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#141C2E] p-3.5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Tên người thao tác, Mã Action, Địa chỉ IP, Chi tiết..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" /> Đang truy xuất Audit Logs...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F17] text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Thời Gian</th>
                  <th className="px-5 py-3.5">Tài Khoản Thao Tác (Actor)</th>
                  <th className="px-5 py-3.5">Mã Action</th>
                  <th className="px-5 py-3.5">Module Đích</th>
                  <th className="px-5 py-3.5">Địa Chỉ IP</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5">Nội Dung Chi Tiết Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{log.actor}</p>
                      <p className="text-blue-400 font-mono text-[10px]">{log.actorRole}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[#A3E635] text-xs">
                      {log.action}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-300">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px]">
                        {log.targetModule}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">{log.ipAddress}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === "SUCCESS" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300 text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
