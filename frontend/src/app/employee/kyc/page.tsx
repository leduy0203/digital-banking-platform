"use client";

import React, { useState, useEffect } from "react";
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Sparkles,
  X
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { KycApplication } from "@/lib/types/employee";

export default function KycApprovalPage() {
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Ảnh CCCD bị mờ/mất góc");
  const [customReason, setCustomReason] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await employeeApi.getKycApplications();
      setApplications(data);
      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedApp = applications.find(a => a.id === selectedId) || applications[0];

  const handleApprove = async (id: string) => {
    const res = await employeeApi.approveKyc(id);
    setApplications(prev => prev.map(item => item.id === id ? { ...item, status: "APPROVED" } : item));
    showToast(res.message);
  };

  const handleRejectConfirm = async () => {
    if (!selectedApp) return;
    const reason = rejectReason === "Lý do khác" ? customReason : rejectReason;
    const res = await employeeApi.rejectKyc(selectedApp.id, reason);
    setApplications(prev => prev.map(item => item.id === selectedApp.id ? { ...item, status: "REJECTED", rejectReason: reason } : item));
    setRejectModalOpen(false);
    showToast(res.message);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-[#A3E635] animate-spin" /> Đang tải danh sách hồ sơ eKYC...
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#A3E635]" /> Thẩm Định & Phê Duyệt Hồ Sơ eKYC
          </h1>
          <p className="text-xs text-slate-400">Xác thực căn cước công dân và sinh trắc học khách hàng mở tài khoản trực tuyến</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-amber-950/80 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> 
            Còn {applications.filter(a => a.status === "PENDING").length} hồ sơ chờ duyệt
          </span>
        </div>
      </div>

      {/* Main 2-Column Workflow */}
      {selectedApp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Queue List (4 cols) */}
          <div className="lg:col-span-4 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider px-1">Hồ sơ chờ duyệt ({applications.length})</h2>
            
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {applications.map((app) => {
                const isSelected = app.id === selectedApp.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedId(app.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[#A3E635] bg-[#1E293B] shadow-md" 
                        : "border-slate-800/80 hover:border-slate-700 bg-[#0D1527]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{app.cif}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status === "APPROVED" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" :
                        app.status === "REJECTED" ? "bg-red-950/80 text-red-400 border border-red-500/30" : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}>
                        {app.status === "APPROVED" ? "Đã duyệt" : app.status === "REJECTED" ? "Đã từ chối" : "Chờ duyệt"}
                      </span>
                    </div>

                    <p className="font-bold text-white text-sm mt-1">{app.fullName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">CCCD: {app.idNumber}</p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-400">{app.submittedAt}</span>
                      <span className={`font-bold ${app.aiScore > 90 ? "text-[#A3E635]" : "text-amber-400"}`}>
                        AI Match: {app.aiScore}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Detail Verification Panel (8 cols) */}
          <div className="lg:col-span-8 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-6 lg:p-7 space-y-6">
            {/* Selected Customer Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0D1527] text-white rounded">
                    {selectedApp.cif}
                  </span>
                  <span className="text-xs text-slate-400">Gửi lúc: {selectedApp.submittedAt}</span>
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">{selectedApp.fullName}</h2>
              </div>

              {/* AI Score Badge */}
              <div className="px-4 py-2.5 bg-[#0D1527] border border-emerald-500/30 rounded-2xl flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Độ Khớp Khuôn Mặt AI</p>
                  <p className="text-xl font-extrabold text-[#A3E635]">{selectedApp.aiScore}% Khớp</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-[#A3E635]" />
              </div>
            </div>

            {/* Photo Comparison Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Hình ảnh định danh eKYC đối chiếu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-300">1. CCCD Mặt Trước</p>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative">
                    <img src={selectedApp.frontImg} alt="CCCD Mặt trước" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-300">2. CCCD Mặt Sau</p>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative">
                    <img src={selectedApp.backImg} alt="CCCD Mặt sau" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-slate-300">3. Ảnh Chân Dung (Selfie)</p>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative">
                    <img src={selectedApp.selfieImg} alt="Ảnh chân dung" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* OCR Data Grid */}
            <div className="bg-[#0D1527] p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#A3E635]" /> Thông tin OCR bóc tách từ Giấy tờ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Họ và tên:</span>
                  <span className="font-bold text-white text-sm">{selectedApp.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số CCCD / Định danh:</span>
                  <span className="font-mono font-bold text-white text-sm">{selectedApp.idNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ngày sinh:</span>
                  <span className="font-semibold text-slate-200">{selectedApp.dob}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ngày cấp:</span>
                  <span className="font-semibold text-slate-200">{selectedApp.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Số điện thoại đăng ký:</span>
                  <span className="font-mono font-semibold text-slate-200">{selectedApp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email đăng ký:</span>
                  <span className="font-semibold text-slate-200">{selectedApp.email}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-400 block">Địa chỉ thường trú:</span>
                  <span className="font-medium text-slate-200">{selectedApp.address}</span>
                </div>
              </div>
            </div>

            {/* Decision Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Người thẩm định: <strong>Nguyễn Văn An (Teller)</strong></p>
                <p className="text-[11px] text-slate-500">Thao tác sẽ tự động kích hoạt tài khoản thanh toán và gửi SMS cho KH</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={selectedApp.status !== "PENDING"}
                  onClick={() => setRejectModalOpen(true)}
                  className="px-5 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl border border-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Từ Chối Hồ Sơ
                </button>

                <button
                  disabled={selectedApp.status !== "PENDING"}
                  onClick={() => handleApprove(selectedApp.id)}
                  className="px-6 py-2.5 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Phê Duyệt KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Xác nhận từ chối KYC
              </h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Vui lòng chọn lý do từ chối hồ sơ của khách hàng <strong>{selectedApp.fullName}</strong> (CIF: {selectedApp.cif}):
            </p>

            <div className="space-y-2 text-xs">
              {[
                "Ảnh CCCD bị mờ/mất góc",
                "Ảnh chân dung selfie không khớp với CCCD",
                "Căn cước công dân đã hết hạn sử dụng",
                "Thông tin OCR khai báo không chính xác",
                "Nghi vấn giả mạo giấy tờ đính kèm",
                "Lý do khác"
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 hover:bg-[#0D1527] cursor-pointer">
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="accent-red-500"
                  />
                  <span className="font-medium text-slate-200">{reason}</span>
                </label>
              ))}

              {rejectReason === "Lý do khác" && (
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể..."
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
                  rows={3}
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setRejectModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
                Hủy bỏ
              </button>
              <button onClick={handleRejectConfirm} className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
