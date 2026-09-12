"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertTriangle, 
  FileText,
  Sparkles,
  X,
  Search,
  Filter,
  Calendar,
  ShieldAlert,
  ArrowUpDown,
  User,
  Clock,
  ExternalLink
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { KycDocumentResponse, KycStatus } from "@/lib/types/employee";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";

const kycStatusFilterOptions: CustomSelectOption[] = [
  { value: "PENDING", label: "Chờ Thẩm Định (PENDING)" },
  { value: "VERIFIED", label: "Đã Phê Duyệt (VERIFIED)" },
  { value: "REJECTED", label: "Đã Từ Chối (REJECTED)" },
];

export default function KycApprovalPage() {
  const [documents, setDocuments] = useState<KycDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<KycDocumentResponse | null>(null);
  
  // Current logged in Employee profile (GET /api/v1/employee/profile/me)
  const [currentUser, setCurrentUser] = useState<{
    id?: string;
    employeeCode?: string;
    fullName?: string;
    department?: string;
    email?: string;
  } | null>(null);

  // Filter state matching backend KycFilterRequest
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<KycStatus>("PENDING");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Ảnh CCCD bị mờ/mất góc");
  const [customReason, setCustomReason] = useState("");

  // Top-Right Toast Notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  // Load Current Employee Profile (/employee/profile/me)
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await employeeApi.getMyProfile();
        setCurrentUser(profile);
      } catch (err) {
        console.error("Failed to load employee profile", err);
      }
    }
    loadProfile();
  }, []);

  // Fetch KYC documents from backend (GET /api/v1/employee/kyc/pending)
  const loadKycList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeeApi.getPendingKycs({
        keyword: keyword.trim() || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page: page - 1, // backend uses 0-based page index
        size: 10,
        sortBy: "submittedAt",
        sortDir: "ASC",
      });

      const items = res.items || [];
      setDocuments(items);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);

      // Select first item if not selected or current selection is not in list
      if (items.length > 0) {
        if (!selectedId || !items.some(d => d.id === selectedId)) {
          setSelectedId(items[0].id);
        }
      } else {
        setSelectedDoc(null);
      }
    } catch (err: any) {
      showToast(err.message || "Không thể tải danh sách hồ sơ eKYC", "error");
    } finally {
      setLoading(false);
    }
  }, [keyword, status, fromDate, toDate, page, selectedId]);

  useEffect(() => {
    loadKycList();
  }, [keyword, status, fromDate, toDate, page]);

  // Fetch detail for selected document (GET /api/v1/employee/kyc/{id})
  useEffect(() => {
    if (!selectedId) return;
    async function loadDetail() {
      try {
        const doc = await employeeApi.getKycDetail(selectedId);
        setSelectedDoc(doc);
      } catch {
        // Fallback to item from list if available
        const found = documents.find(d => d.id === selectedId);
        if (found) setSelectedDoc(found);
      }
    }
    loadDetail();
  }, [selectedId, documents]);

  // Handle Approve KYC (PUT /api/v1/employee/kyc/{id}/approve)
  const handleApprove = async () => {
    if (!selectedDoc) return;
    setActionLoading(true);
    try {
      const res = await employeeApi.approveKyc(selectedDoc.id);
      showToast(`Đã phê duyệt thành công hồ sơ eKYC cho KH ${selectedDoc.fullName}`, "success");
      loadKycList();
    } catch (err: any) {
      showToast(err.message || "Phê duyệt eKYC thất bại!", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject KYC (PUT /api/v1/employee/kyc/{id}/reject)
  const handleRejectConfirm = async () => {
    if (!selectedDoc) return;
    const finalReason = rejectReason === "Lý do khác" ? customReason.trim() : rejectReason;
    if (!finalReason) {
      showToast("Vui lòng nhập lý do từ chối cụ thể", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await employeeApi.rejectKyc(selectedDoc.id, finalReason);
      setRejectModalOpen(false);
      setCustomReason("");
      showToast(`Đã từ chối hồ sơ eKYC của KH ${selectedDoc.fullName}`, "success");
      loadKycList();
    } catch (err: any) {
      showToast(err.message || "Từ chối eKYC thất bại!", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const isFiltered = Boolean(keyword || status !== "PENDING" || fromDate || toDate);

  const resetFilters = () => {
    setKeyword("");
    setStatus("PENDING");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "--";
    try {
      const date = new Date(isoString);
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Top Floating Notification Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200 max-w-md w-full sm:w-auto">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-[#0D1E22]/95 border-emerald-500/60 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                : "bg-[#241215]/95 border-red-500/60 text-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.25)]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === "success"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400" />
              )}
            </div>

            <div className="flex-1 pr-2">
              <p className="font-bold text-xs text-white">
                {toast.type === "success" ? "Thông báo thành công" : "Có lỗi xảy ra"}
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#A3E635]" /> Thẩm Định & Phê Duyệt Hồ Sơ eKYC
          </h1>
          <p className="text-xs text-slate-400">
            Xác thực CCCD, sinh trắc học khuôn mặt và mở tài khoản trực tuyến cho khách hàng
          </p>
        </div>

        {/* Current Employee Identification Badge */}
        {currentUser && (
          <div className="px-4 py-2 bg-[#141C2E] border border-slate-800 rounded-2xl flex items-center gap-3 text-xs shadow-md">
            <div className="w-8 h-8 rounded-xl bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">{currentUser.fullName}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                Mã NV: <strong className="text-[#A3E635]">{currentUser.employeeCode}</strong> ({currentUser.department})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Compact Filter Bar (Matching backend KycFilterRequest) */}
      <div className="bg-[#141C2E] p-3.5 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Keyword Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo CCCD, Tên, Mã CIF, SĐT..."
              className="w-full pl-9 pr-8 py-2 bg-[#0D1527] hover:bg-[#101c33] border border-slate-800 focus:border-[#A3E635]/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#A3E635] transition-all font-medium"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* KYC Status Dropdown */}
          <CustomSelect
            value={status}
            onChange={(val) => setStatus(val as KycStatus)}
            options={kycStatusFilterOptions}
            icon={Filter}
            className="w-full sm:w-60"
            menuWidth="w-64"
          />

          {/* Date range filters */}
          <div className="flex items-center gap-2 text-xs">
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="Từ ngày"
                className="px-3 py-2 bg-[#0D1527] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#A3E635]"
                title="Lọc từ ngày"
              />
            </div>
            <span className="text-slate-500">-</span>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="Đến ngày"
                className="px-3 py-2 bg-[#0D1527] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#A3E635]"
                title="Lọc đến ngày"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-[#A3E635] hover:underline font-medium px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Main Workflow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Queue List (4 cols) */}
        <div className="lg:col-span-4 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold uppercase text-slate-400">
            <span>Danh sách hồ sơ ({totalElements})</span>
            <span className="text-[#A3E635] font-mono lowercase">trang {page}/{totalPages}</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E635] animate-spin" /> Đang tải dữ liệu eKYC...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Không tìm thấy hồ sơ eKYC nào phù hợp.
            </div>
          ) : (
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1 custom-scrollbar">
              {documents.map((doc) => {
                const isSelected = selectedDoc && doc.id === selectedDoc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedId(doc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[#A3E635] bg-[#1E293B] shadow-md ring-1 ring-[#A3E635]/40" 
                        : "border-slate-800/80 hover:border-slate-700 bg-[#0D1527]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">
                        {doc.customerCode || "Chưa có CIF"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.status === "VERIFIED" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : doc.status === "REJECTED" 
                          ? "bg-red-950/80 text-red-400 border border-red-500/30" 
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}>
                        {doc.status === "VERIFIED" ? "ĐÃ DUYỆT" : doc.status === "REJECTED" ? "TỪ CHỐI" : "CHỜ THẨM ĐỊNH"}
                      </span>
                    </div>

                    <p className="font-bold text-white text-sm mt-1">{doc.fullName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">CCCD: {doc.nationalId}</p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatDate(doc.submittedAt)}
                      </span>
                      <span className="font-mono text-slate-300">{doc.phoneNumber}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Verification Panel (8 cols) */}
        {selectedDoc ? (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-6 lg:p-7 space-y-6">
            {/* Top Selected Customer Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#0D1527] text-[#A3E635] rounded border border-slate-800">
                    {selectedDoc.customerCode || "HỒ SƠ MỚI"}
                  </span>
                  <span className="text-xs text-slate-400">Gửi lúc: {formatDate(selectedDoc.submittedAt)}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedDoc.fullName}</h2>
              </div>

              {/* Status Badge */}
              <div className="px-4 py-2.5 bg-[#0D1527] border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trạng Thái Hồ Sơ</p>
                  <p className={`text-base font-extrabold ${
                    selectedDoc.status === "VERIFIED" ? "text-emerald-400" :
                    selectedDoc.status === "REJECTED" ? "text-red-400" : "text-amber-400"
                  }`}>
                    {selectedDoc.status === "VERIFIED" ? "ĐÃ PHÊ DUYỆT" :
                     selectedDoc.status === "REJECTED" ? "ĐÃ TỪ CHỐI" : "CHỜ DUYỆT"}
                  </p>
                </div>
                <ShieldCheck className={`w-8 h-8 ${
                  selectedDoc.status === "VERIFIED" ? "text-emerald-400" :
                  selectedDoc.status === "REJECTED" ? "text-red-400" : "text-amber-400"
                }`} />
              </div>
            </div>

            {/* If Rejected: Show Rejection Notice */}
            {selectedDoc.status === "REJECTED" && selectedDoc.rejectionReason && (
              <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex items-start gap-3 text-xs text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-300">Lý do từ chối hồ sơ:</p>
                  <p className="mt-0.5">{selectedDoc.rejectionReason}</p>
                  {selectedDoc.verifiedByEmployeeName && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Thực hiện bởi: {selectedDoc.verifiedByEmployeeName} ({selectedDoc.verifiedByEmployeeCode}) - {formatDate(selectedDoc.verifiedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Photo Comparison Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A3E635]" /> Hình ảnh định danh eKYC đối chiếu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Front ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">1. CCCD Mặt Trước</p>
                    {selectedDoc.frontIdCardUrl && (
                      <a href={selectedDoc.frontIdCardUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#A3E635] hover:underline flex items-center gap-0.5">
                        Xem gốc <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative group">
                    <img 
                      src={selectedDoc.frontIdCardUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"} 
                      alt="CCCD Mặt trước" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  </div>
                </div>

                {/* Back ID */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">2. CCCD Mặt Sau</p>
                    {selectedDoc.backIdCardUrl && (
                      <a href={selectedDoc.backIdCardUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#A3E635] hover:underline flex items-center gap-0.5">
                        Xem gốc <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative group">
                    <img 
                      src={selectedDoc.backIdCardUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"} 
                      alt="CCCD Mặt sau" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  </div>
                </div>

                {/* Selfie Photo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">3. Ảnh Chân Dung (Selfie)</p>
                    {selectedDoc.selfiePhotoUrl && (
                      <a href={selectedDoc.selfiePhotoUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#A3E635] hover:underline flex items-center gap-0.5">
                        Xem gốc <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="h-48 bg-[#0D1527] rounded-2xl overflow-hidden border border-slate-700 relative group">
                    <img 
                      src={selectedDoc.selfiePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"} 
                      alt="Ảnh chân dung" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* OCR Data Grid */}
            <div className="bg-[#0D1527] p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#A3E635]" /> Thông tin trích xuất từ Giấy tờ & Khách hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Họ và tên khách hàng:</span>
                  <span className="font-bold text-white text-sm">{selectedDoc.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số CCCD / CMND Định danh:</span>
                  <span className="font-mono font-bold text-white text-sm">{selectedDoc.nationalId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Ngày tháng năm sinh:</span>
                  <span className="font-semibold text-slate-200">{selectedDoc.dateOfBirth || "--"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Số điện thoại liên hệ:</span>
                  <span className="font-mono font-semibold text-slate-200">{selectedDoc.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email đăng ký tài khoản:</span>
                  <span className="font-semibold text-slate-200">{selectedDoc.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mã định danh khách hàng (CIF):</span>
                  <span className="font-mono font-semibold text-[#A3E635]">{selectedDoc.customerCode || "Chờ cấp sau duyệt"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Địa chỉ đăng ký thường trú:</span>
                  <span className="font-medium text-slate-200">{selectedDoc.address || "--"}</span>
                </div>
              </div>
            </div>

            {/* Decision Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300 font-medium">
                  Cán bộ thẩm định: <strong>{currentUser ? `${currentUser.fullName} (${currentUser.employeeCode})` : "Giao dịch viên"}</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phê duyệt sẽ tự động kích hoạt tài khoản thanh toán và gửi email thông báo cho khách hàng
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={selectedDoc.status !== "PENDING" || actionLoading}
                  onClick={() => setRejectModalOpen(true)}
                  className="px-5 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-bold text-xs rounded-xl border border-red-500/30 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Từ Chối Hồ Sơ
                </button>

                <button
                  type="button"
                  disabled={selectedDoc.status !== "PENDING" || actionLoading}
                  onClick={handleApprove}
                  className="px-6 py-2.5 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {actionLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Phê Duyệt KYC
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-12 text-center text-slate-500 text-xs">
            Vui lòng chọn hồ sơ bên danh sách để thẩm định chi tiết.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && selectedDoc && (
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
              Vui lòng chọn lý do từ chối hồ sơ của khách hàng <strong>{selectedDoc.fullName}</strong> (CCCD: {selectedDoc.nationalId}):
            </p>

            <div className="space-y-2 text-xs">
              {[
                "Ảnh CCCD bị mờ/mất góc/không rõ thông tin",
                "Ảnh chân dung selfie không khớp với khuôn mặt trên CCCD",
                "Căn cước công dân đã hết hạn sử dụng",
                "Thông tin OCR trích xuất không khớp với cơ sở dữ liệu",
                "Nghi vấn giấy tờ giả mạo hoặc chỉnh sửa",
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
                  placeholder="Nhập lý do chi tiết để hệ thống gửi email hướng dẫn KH chụp lại..."
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500 mt-2"
                  rows={3}
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setRejectModalOpen(false)} 
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Hủy bỏ
              </button>
              <button 
                type="button"
                disabled={actionLoading}
                onClick={handleRejectConfirm} 
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
              >
                {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
