"use client";

import React, { useState, useEffect } from "react";
import { 
  Server, 
  Clock, 
  Play, 
  Zap, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  Sparkles
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { SchedulerJob } from "@/lib/types/admin";

export default function SystemControlPage() {
  const [jobs, setJobs] = useState<SchedulerJob[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cache Evict State
  const [cachePattern, setCachePattern] = useState("account_cache:*");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // System Config States
  const [dailyLimit, setDailyLimit] = useState("500000000");
  const [otpExpiry, setOtpExpiry] = useState("60");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminApi.getSchedulerJobs();
      setJobs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleTriggerJob = async (jobId: string) => {
    const res = await adminApi.triggerSchedulerJob(jobId);
    const updated = await adminApi.getSchedulerJobs();
    setJobs(updated);
    showToast(res.message);
  };

  const handleEvictCache = async () => {
    if (!cachePattern) return;
    const res = await adminApi.evictCachePattern(cachePattern);
    showToast(res.message);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Đã lưu các thông số Cấu Hình Hệ Thống thành công!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p>{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" /> System Engine (Scheduler & Cache)
          </h1>
          <p className="text-xs text-slate-400">Điều khiển Cron Jobs tự động, dọn dẹp bộ nhớ đệm Redis Cache và chỉnh sửa thông số cấu hình</p>
        </div>
      </div>

      {/* Section 1: Cron Scheduler Jobs Table */}
      <div className="bg-[#141C2E] rounded-2xl border border-slate-800 shadow-sm overflow-hidden space-y-4 p-5 lg:p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A3E635]" /> Quản Lý Cron Scheduler Engine Jobs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Kích hoạt thủ công hoặc tạm dừng các tiến trình chạy ngầm</p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" /> Đang tải dữ liệu Scheduler Jobs...
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0B0F17] text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Tên Cron Job</th>
                  <th className="px-5 py-3.5">Biểu Thức Cron</th>
                  <th className="px-5 py-3.5">Lần Chạy Trước</th>
                  <th className="px-5 py-3.5">Lần Chạy Tiếp Theo</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-right">Kích Hoạt Thủ Công</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white text-xs">{job.jobName}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{job.description}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[#A3E635] text-xs">{job.cronExpression}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{job.lastRun}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{job.nextRun}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        job.status === "RUNNING" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}>
                        {job.status === "RUNNING" ? "RUNNING" : "PAUSED"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleTriggerJob(job.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" /> Trigger Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Redis Cache Control & System Parameters (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Redis Cache Control */}
        <div className="bg-[#141C2E] p-5 lg:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#A3E635]" /> Quản Lý & Evict Redis Cache
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded">
              Redis v7.2 Cluster
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="font-bold text-slate-300 block">Mẫu Key Cần Xóa (Cache Key Pattern)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cachePattern}
                onChange={(e) => setCachePattern(e.target.value)}
                placeholder="VD: account_cache:* hoặc rate_limit_bucket:*"
                className="flex-1 p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleEvictCache}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> Flush Cache
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Thao tác sẽ lập tức xóa sạch các keys khớp với mẫu pattern trên Redis Cluster mà không làm gián đoạn API Server.
            </p>
          </div>
        </div>

        {/* System Configuration Editor */}
        <div className="bg-[#141C2E] p-5 lg:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Cấu Hình Tham Số Hệ Thống Global
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded">
              Spring Config
            </span>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Hạn Mức Chuyển Tiền Hằng Ngày (VND)</label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Thời Gian Hết Hạn OTP (Giây)</label>
                <input
                  type="number"
                  value={otpExpiry}
                  onChange={(e) => setOtpExpiry(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">Cập nhật áp dụng tức thì cho micro-services</span>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                Lưu Cấu Hình
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
