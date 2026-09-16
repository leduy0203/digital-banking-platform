"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  Search, 
  CreditCard, 
  Phone, 
  Mail, 
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  Building2,
  X,
  Eye,
  UserCheck
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { CustomerSummaryItem, CustomerDetailView } from "@/lib/types/employee";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";
import Link from "next/link";

const kycFilterOptions: CustomSelectOption[] = [
  { value: "ALL", label: "Tất cả trạng thái KYC" },
  { value: "VERIFIED", label: "Đã định danh (VERIFIED)" },
  { value: "PENDING", label: "Chờ thẩm định (PENDING)" },
  { value: "REJECTED", label: "Bị từ chối (REJECTED)" },
];

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<CustomerSummaryItem[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<CustomerDetailView | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Loading States
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}: ${text}`);
  };

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 1. Fetch Customers List
  const loadCustomers = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await employeeApi.getCustomersPage({
        keyword: debouncedSearch.trim() || undefined,
        kycStatus: kycFilter !== "ALL" ? kycFilter : undefined,
        page,
        size: 10,
        sortBy: "createdAt",
        sortDir: "DESC"
      });

      setCustomers(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error("Failed to load customers:", err);
      showToast("Không thể tải danh sách khách hàng", "error");
    } finally {
      setLoadingList(false);
    }
  }, [debouncedSearch, kycFilter, page]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // 2. Open Drawer & Fetch Customer Detail smoothly
  const handleOpenDetail = (cust: CustomerSummaryItem) => {
    // Open immediately with initial data to eliminate any perceived lag
    setSelectedDetail({
      customerId: cust.id,
      customerCode: cust.customerCode,
      fullName: cust.fullName,
      nationalId: cust.nationalId,
      phoneNumber: cust.phoneNumber,
      email: cust.email,
      avatarUrl: cust.avatarUrl,
      userStatus: cust.userStatus || "ACTIVE",
      kycStatus: cust.kycStatus,
      totalBalance: 0,
      totalAccounts: 0,
      accounts: [],
      createdAt: cust.createdAt
    });
    setIsDrawerOpen(true);
    setLoadingDetail(true);

    employeeApi.getCustomerDetail(cust.customerCode)
      .then((detail) => {
        if (detail) {
          setSelectedDetail(detail);
        }
      })
      .catch((err) => {
        console.error("Failed to load customer detail:", err);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  };

  // Quick stats calculation
  const verifiedCount = customers.filter(c => c.kycStatus === "VERIFIED").length;
  const pendingCount = customers.filter(c => c.kycStatus === "PENDING").length;

  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-150">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border ${
              toast.type === "success"
                ? "bg-[#0D1E22] border-emerald-500/60 text-emerald-100"
                : "bg-[#241215] border-red-500/60 text-red-100"
            }`}
          >
            <CheckCircle2 className={`w-5 h-5 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span className="text-xs font-bold text-white">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#A3E635]" /> Quản Lý & Tra Cứu Khách Hàng
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Danh sách khách hàng, thông tin định danh, tài khoản ngân hàng và nghiệp vụ tại quầy
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadCustomers()}
            disabled={loadingList}
            className="px-3.5 py-2 bg-[#141C2E] hover:bg-[#1E293B] border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#A3E635] ${loadingList ? "animate-spin" : ""}`} /> Làm mới
          </button>
          
          <Link
            href="/employee/accounts"
            className="px-4 py-2 bg-gradient-to-r from-[#A3E635] to-[#84cc16] hover:from-[#bef264] hover:to-[#A3E635] text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-[#A3E635]/15 flex items-center gap-2 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Mở Tài Khoản Tại Quầy
          </Link>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng Hồ Sơ</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{totalElements}</p>
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đã Định Danh KYC</p>
            <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{verifiedCount}</p>
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chờ Thẩm Định</p>
            <p className="text-xl font-extrabold text-amber-300 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đang Hiển Thị</p>
            <p className="text-xl font-extrabold text-purple-300 mt-0.5">{customers.length} khách</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl p-5 space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo CIF, Họ tên, CCCD, SĐT, Email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D1527] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
            />
          </div>

          <div className="w-full sm:w-64">
            <CustomSelect
              options={kycFilterOptions}
              value={kycFilter}
              onChange={(val) => {
                setKycFilter(val);
                setPage(0);
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Full-width Customers Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-2xl bg-[#0D1527]/50">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0D1527] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-4">Mã CIF</th>
                <th className="px-4 py-4">Họ và Tên</th>
                <th className="px-4 py-4">Số CCCD / Hộ Chiếu</th>
                <th className="px-4 py-4">Số Điện Thoại</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4 text-center">Trạng Thái KYC</th>
                <th className="px-4 py-4 text-center">Tài Khoản Login</th>
                <th className="px-4 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70">
              {loadingList ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#A3E635] animate-spin" />
                      <span>Đang tải danh sách khách hàng...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
                    <p className="font-bold text-white text-sm">Không tìm thấy khách hàng nào</p>
                    <p className="text-slate-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</p>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr 
                    key={cust.id || cust.customerCode} 
                    onClick={() => handleOpenDetail(cust)}
                    className="hover:bg-[#1A233A]/70 cursor-pointer transition-colors duration-100 group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#A3E635] bg-[#A3E635]/10 px-2 py-0.5 rounded border border-[#A3E635]/20">
                          {cust.customerCode}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(cust.customerCode, "Mã CIF");
                          }}
                          className="text-slate-500 hover:text-[#A3E635] transition-colors"
                          title="Sao chép CIF"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-bold text-white text-sm group-hover:text-[#A3E635] transition-colors">
                        {cust.fullName}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-mono font-medium text-slate-300">
                      {cust.nationalId}
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      {cust.phoneNumber || "---"}
                    </td>

                    <td className="px-4 py-4 text-slate-300 max-w-[200px] truncate">
                      {cust.email || "---"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cust.kycStatus === "VERIFIED" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : cust.kycStatus === "PENDING"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {cust.kycStatus === "VERIFIED" && <ShieldCheck className="w-3 h-3" />}
                        {cust.kycStatus === "PENDING" && <Clock className="w-3 h-3" />}
                        {cust.kycStatus === "VERIFIED" ? "Đã KYC" : cust.kycStatus === "PENDING" ? "Chờ duyệt" : "Chưa KYC"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cust.userStatus === "ACTIVE" 
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                          : "bg-red-950/80 text-red-400 border border-red-500/30"
                      }`}>
                        {cust.userStatus === "ACTIVE" ? "ACTIVE" : "BLOCKED"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(cust);
                        }}
                        className="px-3 py-1.5 bg-[#0D1527] hover:bg-[#A3E635] hover:text-slate-950 border border-slate-700 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Hiển thị <strong>{customers.length}</strong> / <strong>{totalElements}</strong> khách hàng (Trang {page + 1} / {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-xl bg-[#0D1527] border border-slate-700 disabled:opacity-30 hover:bg-[#1E293B] text-white transition-colors flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </button>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-xl bg-[#0D1527] border border-slate-700 disabled:opacity-30 hover:bg-[#1E293B] text-white transition-colors flex items-center gap-1 font-bold"
              >
                Trang sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OVER DRAWER: HARDWARE-ACCELERATED GPU COMPOSITED (SILKY SMOOTH)     */}
      {/* ========================================================================= */}
      <div 
        className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
          isDrawerOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        {/* Backdrop with smooth opacity transition */}
        <div 
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ease-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div 
            className={`w-screen max-w-3xl lg:max-w-3xl xl:max-w-[850px] bg-[#141C2E] border-l border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100 transform transition-transform duration-300 will-change-transform ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#0D1527]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] font-extrabold text-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Hồ Sơ Khách Hàng</h2>
                  <p className="text-xs text-slate-400">Thông tin định danh & các tài khoản liên kết</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-[#141C2E] border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {selectedDetail && (
                <>
                  {/* Top Identity Card */}
                  <div className="bg-gradient-to-br from-[#0B1120] via-[#162238] to-[#1E293B] border border-slate-700/80 text-white p-5 rounded-3xl shadow-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/20 border border-[#A3E635]/30 text-[#A3E635] font-black text-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                          {selectedDetail.avatarUrl ? (
                            <img
                              src={selectedDetail.avatarUrl}
                              alt={selectedDetail.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{selectedDetail.fullName ? selectedDetail.fullName.charAt(0) : "C"}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] font-mono text-xs font-bold border border-[#A3E635]/30 flex items-center gap-1.5">
                              {selectedDetail.customerCode}
                              <button
                                onClick={() => copyToClipboard(selectedDetail.customerCode, "Mã CIF")}
                                className="hover:text-white"
                                title="Sao chép"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </span>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              selectedDetail.kycStatus === "VERIFIED" 
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30" 
                                : "bg-amber-950 text-amber-300 border border-amber-500/30"
                            }`}>
                              {selectedDetail.kycStatus === "VERIFIED" ? "Đã KYC" : "Chưa KYC"}
                            </span>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              selectedDetail.userStatus === "ACTIVE" 
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30" 
                                : "bg-red-950 text-red-400 border border-red-500/30"
                            }`}>
                              {selectedDetail.userStatus === "ACTIVE" ? "Login: ACTIVE" : "Login: BLOCKED"}
                            </span>
                          </div>

                          <h3 className="text-xl font-extrabold mt-1">{selectedDetail.fullName}</h3>
                        </div>
                      </div>

                      <div className="text-left sm:text-right bg-[#0D1527] p-3 rounded-2xl border border-slate-800 shrink-0">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tổng Số Dư Quản Lý</p>
                        <p className="text-xl font-extrabold text-[#A3E635]">₫ {selectedDetail.totalBalance.toLocaleString("vi-VN")}</p>
                        <p className="text-[10px] text-slate-400">{selectedDetail.totalAccounts} Tài khoản liên kết</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Identity Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Contact Info */}
                    <div className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#A3E635]" /> Thông Tin Liên Lạc
                      </h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số điện thoại:</span>
                          <span className="font-bold font-mono text-white flex items-center gap-1.5">
                            {selectedDetail.phoneNumber || "---"}
                            {selectedDetail.phoneNumber && (
                              <button onClick={() => copyToClipboard(selectedDetail.phoneNumber!, "SĐT")} className="text-slate-400 hover:text-[#A3E635]">
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-bold text-white flex items-center gap-1.5 max-w-[180px] truncate">
                            {selectedDetail.email || "---"}
                            {selectedDetail.email && (
                              <button onClick={() => copyToClipboard(selectedDetail.email!, "Email")} className="text-slate-400 hover:text-[#A3E635] shrink-0">
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-800">
                          <span className="text-slate-400 block mb-1">Địa chỉ thường trú:</span>
                          <span className="font-medium text-slate-200 leading-relaxed block">
                            {selectedDetail.address || "Chưa cập nhật địa chỉ"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Identity Info */}
                    <div className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" /> Định Danh & KYC
                      </h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Số CCCD:</span>
                          <span className="font-bold font-mono text-white flex items-center gap-1.5">
                            {selectedDetail.nationalId}
                            <button onClick={() => copyToClipboard(selectedDetail.nationalId, "CCCD")} className="text-slate-400 hover:text-[#A3E635]">
                              <Copy className="w-3 h-3" />
                            </button>
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ngày sinh:</span>
                          <span className="font-bold text-white">
                            {selectedDetail.dateOfBirth ? new Date(selectedDetail.dateOfBirth).toLocaleDateString("vi-VN") : "---"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ngày nộp KYC:</span>
                          <span className="font-bold text-slate-300">
                            {selectedDetail.kycSubmittedAt ? new Date(selectedDetail.kycSubmittedAt).toLocaleDateString("vi-VN") : "---"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Ngày duyệt KYC:</span>
                          <span className="font-bold text-emerald-400">
                            {selectedDetail.kycVerifiedAt ? new Date(selectedDetail.kycVerifiedAt).toLocaleDateString("vi-VN") : "Chưa duyệt"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Linked Bank Accounts Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wider text-slate-400">
                        <CreditCard className="w-4 h-4 text-[#A3E635]" /> Danh Sách Tài Khoản Liên Kết
                      </h4>

                      <Link
                        href={`/employee/accounts`}
                        className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1"
                      >
                        Mở thêm tài khoản <PlusCircle className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {loadingDetail ? (
                      <div className="p-8 text-center text-xs text-slate-400 bg-[#0D1527] rounded-2xl border border-slate-800 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#A3E635] animate-spin" /> Đang cập nhật số dư & tài khoản...
                      </div>
                    ) : selectedDetail.accounts.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-[#0D1527] rounded-2xl border border-slate-800">
                        Khách hàng chưa mở tài khoản ngân hàng nào.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedDetail.accounts.map((acc) => (
                          <div 
                            key={acc.accountNumber}
                            className="bg-[#0D1527] p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white text-sm">{acc.accountNumber}</span>
                                <button
                                  onClick={() => copyToClipboard(acc.accountNumber, "Số tài khoản")}
                                  className="text-slate-400 hover:text-[#A3E635]"
                                  title="Sao chép"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                {acc.isDefault && (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30 text-[9px] font-bold">
                                    Mặc định
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                                  acc.status === "ACTIVE" 
                                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                                    : "bg-red-950/80 text-red-400 border border-red-500/30"
                                }`}>
                                  {acc.status === "ACTIVE" ? "ACTIVE" : "FROZEN"}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Loại: <span className="text-slate-200 font-medium">{acc.accountType === "CHECKING" ? "Thanh toán (Checking)" : "Tiết kiệm (Savings)"}</span>
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4">
                              <div className="text-left sm:text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-semibold">Số dư khả dụng</p>
                                <p className="text-base font-extrabold text-[#A3E635] font-mono">
                                  ₫ {(acc.availableBalance ?? acc.balance).toLocaleString("vi-VN")}
                                </p>
                              </div>

                              <Link
                                href={`/employee/cash-ops?account=${acc.accountNumber}`}
                                className="px-3 py-1.5 bg-[#141C2E] hover:bg-[#A3E635] hover:text-slate-950 border border-slate-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm shrink-0"
                              >
                                Nạp / Rút
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0D1527] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                CIF: {selectedDetail?.customerCode || "---"}
              </span>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Đóng hồ sơ (Esc)
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
