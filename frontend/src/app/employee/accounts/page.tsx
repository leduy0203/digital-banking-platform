"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  CreditCard, 
  Search, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Plus, 
  Loader2, 
  Wallet, 
  PiggyBank, 
  Coins, 
  Phone, 
  Mail, 
  User, 
  Copy, 
  Check, 
  Eye, 
  Calendar, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { AccountItem } from "@/lib/types/employee";
import { CustomSelect } from "@/components/ui/CustomSelect";

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<AccountItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [unfreezeModalOpen, setUnfreezeModalOpen] = useState(false);
  const [openAccountModalOpen, setOpenAccountModalOpen] = useState(false);

  // Search with debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Filters & Pagination state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // New Account State
  const [newCustomerId, setNewCustomerId] = useState("");
  const [newAccountType, setNewAccountType] = useState<"CHECKING" | "SAVINGS">("CHECKING");
  const [newCurrency, setNewCurrency] = useState("VND");
  const [isSubmittingNewAcc, setIsSubmittingNewAcc] = useState(false);

  // Freeze Modal State
  const [lockType, setLockType] = useState<"FROZEN" | "BLOCKED">("BLOCKED");
  const [reason, setReason] = useState("Khách hàng báo mất thiết bị đăng nhập & nghi vấn gian lận");
  const [refCode, setRefCode] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Debounce search input (350ms) to prevent UI jitter/re-render flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchTerm);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      const filterPayload: any = {
        page: page - 1, // backend 0-indexed
        size: pageSize,
      };

      if (debouncedKeyword.trim()) {
        filterPayload.keyword = debouncedKeyword.trim();
      }
      if (statusFilter !== "ALL") {
        filterPayload.status = statusFilter;
      }
      if (typeFilter !== "ALL") {
        filterPayload.accountType = typeFilter;
      }

      const res = await employeeApi.getAccounts(filterPayload);
      setAccounts(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch {
      setAccounts([]);
    } finally {
      setIsFetching(false);
      setInitialLoading(false);
    }
  }, [debouncedKeyword, statusFilter, typeFilter, page, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleOpenAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerId.trim()) {
      showToast("Vui lòng nhập Customer ID hoặc Mã CIF của khách hàng");
      return;
    }

    setIsSubmittingNewAcc(true);
    try {
      const res = await employeeApi.openAccount({
        customerId: newCustomerId.trim(),
        accountType: newAccountType,
        currency: newCurrency,
        initialDeposit: 0,
      });

      showToast(res.message || "Mở tài khoản thành công!");
      setOpenAccountModalOpen(false);
      setNewCustomerId("");
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Mở tài khoản thất bại";
      showToast(msg);
    } finally {
      setIsSubmittingNewAcc(false);
    }
  };

  const handleFreezeConfirm = async () => {
    if (!selectedAcc) return;
    try {
      const res = await employeeApi.updateAccountStatus(selectedAcc.accountNumber, lockType);
      loadData();
      setFreezeModalOpen(false);
      showToast(res.message || `Đã cập nhật trạng thái tài khoản ${selectedAcc.accountNumber} sang ${lockType}`);
    } catch (err: any) {
      showToast(err.message || "Cập nhật trạng thái thất bại");
    }
  };

  const handleUnfreezeConfirm = async () => {
    if (!selectedAcc) return;
    try {
      const res = await employeeApi.updateAccountStatus(selectedAcc.accountNumber, 'ACTIVE');
      loadData();
      setUnfreezeModalOpen(false);
      showToast(res.message || `Đã kích hoạt lại tài khoản ${selectedAcc.accountNumber}`);
    } catch (err: any) {
      showToast(err.message || "Mở khóa tài khoản thất bại");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Stats computation
  const activeCount = accounts.filter(a => a.status === 'ACTIVE').length;
  const frozenCount = accounts.filter(a => a.status === 'FROZEN' || a.status === 'BLOCKED' || a.status === 'DEBIT_LOCKED').length;
  const totalBalanceSum = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#A3E635]" /> Quản Lý & Khóa/Mở Tài Khoản (Account Operations)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Tra cứu trạng thái tài khoản thanh toán, đối soát số dư và xử lý mở mới / phong tỏa / mở khóa theo quy trình</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="p-2.5 bg-[#141C2E] hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#A3E635]' : ''}`} />
          </button>
          <button
            onClick={() => setOpenAccountModalOpen(true)}
            className="bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Mở Tài Khoản Tại Quầy</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Tổng Số Tài Khoản</p>
            <p className="text-2xl font-extrabold text-white mt-1 font-mono">{totalElements}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Đang Hoạt Động (Active)</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-red-400 font-semibold uppercase tracking-wider">Phong Tỏa / Khóa</p>
            <p className="text-2xl font-extrabold text-red-400 mt-1 font-mono">{frozenCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] text-[#A3E635] font-semibold uppercase tracking-wider">Tổng Số Dư Trên Trang</p>
            <p className="text-xl font-extrabold text-[#A3E635] mt-1 font-mono">
              ₫ {totalBalanceSum.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/20 flex items-center justify-center text-[#A3E635]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          {isFetching ? (
            <Loader2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3E635] animate-spin" />
          ) : (
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Số tài khoản, Mã CIF, Tên khách hàng, SĐT..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A3E635] placeholder:text-slate-500 transition-all"
          />
        </div>

        <div className="w-full md:w-56">
          <CustomSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            options={[
              { value: "ALL", label: "Tất cả trạng thái" },
              { value: "ACTIVE", label: "Đang hoạt động (ACTIVE)" },
              { value: "FROZEN", label: "Phong tỏa số dư (FROZEN)" },
              { value: "BLOCKED", label: "Đã khóa (BLOCKED)" },
              { value: "CLOSED", label: "Đã đóng (CLOSED)" },
            ]}
            menuWidth="w-full"
          />
        </div>

        <div className="w-full md:w-52">
          <CustomSelect
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setPage(1);
            }}
            options={[
              { value: "ALL", label: "Tất cả loại TK" },
              { value: "CHECKING", label: "Thanh toán (CHECKING)", icon: Wallet },
              { value: "SAVINGS", label: "Tiết kiệm (SAVINGS)", icon: PiggyBank },
            ]}
            menuWidth="w-full"
          />
        </div>
      </div>

      {/* Accounts Table Container with stable height to prevent layout shifts */}
      <div className="bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl overflow-hidden min-h-[350px] relative flex flex-col justify-between">
        {initialLoading ? (
          <div className="py-24 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A3E635] animate-spin" /> Đang đồng bộ dữ liệu tài khoản từ hệ thống...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold">Không tìm thấy tài khoản nào phù hợp</p>
            <p className="text-xs text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái</p>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1527] text-slate-400 uppercase font-semibold border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Số Tài Khoản & Phân Loại</th>
                  <th className="px-6 py-4">Chủ Tài Khoản & Liên Hệ</th>
                  <th className="px-6 py-4">Chi Tiết Số Dư</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Ngày Mở / Cập Nhật</th>
                  <th className="px-6 py-4 text-right">Thao Tác Quầy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {accounts.map((acc) => {
                  const hasFrozen = (acc.frozenBalance ?? 0) > 0;
                  const availBal = acc.availableBalance ?? (acc.balance - (acc.frozenBalance || 0));

                  return (
                    <tr key={acc.accountNumber} className="hover:bg-[#1E293B]/50 transition-colors">
                      {/* Cột 1: STK & Badges */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm tracking-wide">
                            {acc.accountNumber}
                          </span>
                          <button
                            onClick={() => handleCopy(acc.accountNumber)}
                            className="text-slate-500 hover:text-[#A3E635] transition-colors cursor-pointer"
                            title="Sao chép STK"
                          >
                            {copiedAccount === acc.accountNumber ? (
                              <Check className="w-3.5 h-3.5 text-[#A3E635]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            acc.accountType === 'SAVINGS'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {acc.accountType === 'SAVINGS' ? 'Tiết Kiệm' : 'Thanh Toán'}
                          </span>
                          {acc.isDefault && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Cột 2: Chủ tài khoản & CIF & Contact */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <p className="font-bold text-white text-xs">{acc.customerName}</p>
                        </div>
                        <p className="text-slate-400 font-mono text-[11px] pl-5">CIF: {acc.cif}</p>
                        {acc.customerPhone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pl-5 font-mono">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{acc.customerPhone}</span>
                          </div>
                        )}
                      </td>

                      {/* Cột 3: Chi tiết số dư */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Khả dụng:</span>
                            <span className="font-extrabold text-[#A3E635] text-sm font-mono">
                              ₫ {availBal.toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Tổng số dư: ₫ {(acc.balance || 0).toLocaleString("vi-VN")}
                          </div>
                          {hasFrozen && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30 font-mono">
                              <span>❄️ Phong tỏa: ₫ {(acc.frozenBalance || 0).toLocaleString("vi-VN")}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Cột 4: Trạng thái */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          acc.status === "ACTIVE" 
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" 
                            : acc.status === "FROZEN"
                            ? "bg-amber-950/80 text-amber-400 border border-amber-500/30"
                            : "bg-red-950/80 text-red-400 border border-red-500/30"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            acc.status === "ACTIVE" ? "bg-emerald-400 animate-pulse" : acc.status === "FROZEN" ? "bg-amber-400" : "bg-red-400"
                          }`} />
                          {acc.status === "ACTIVE" 
                            ? "HOẠT ĐỘNG" 
                            : acc.status === "FROZEN" 
                            ? "PHONG TỎA" 
                            : acc.status === "CLOSED" 
                            ? "ĐÃ ĐÓNG" 
                            : "ĐÃ KHÓA"}
                        </span>
                      </td>

                      {/* Cột 5: Thời gian */}
                      <td className="px-6 py-4 space-y-1 font-mono text-[11px] text-slate-400">
                        {acc.openedAt && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>Mở: {acc.openedAt}</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500">CN: {acc.updatedAt}</div>
                      </td>

                      {/* Cột 6: Thao tác */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedAcc(acc);
                              setDetailsModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết hồ sơ tài khoản"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {acc.status === "ACTIVE" ? (
                            <button
                              onClick={() => {
                                setSelectedAcc(acc);
                                setFreezeModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Lock className="w-3.5 h-3.5" /> Khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAcc(acc);
                                setUnfreezeModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Unlock className="w-3.5 h-3.5" /> Mở Khóa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#0D1527] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <p>
              Hiển thị trang <strong className="text-white">{page}</strong> trên tổng số <strong className="text-white">{totalPages}</strong> trang ({totalElements} tài khoản)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 bg-[#141C2E] hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#141C2E] text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono px-2 text-white font-bold">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-2 bg-[#141C2E] hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#141C2E] text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Details Modal */}
      {detailsModalOpen && selectedAcc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#A3E635]" /> Thông Tin Chi Tiết Tài Khoản
              </h3>
              <button onClick={() => setDetailsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#0D1527] rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Số tài khoản:</span>
                <span className="font-mono font-bold text-white text-sm">{selectedAcc.accountNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Chủ sở hữu:</span>
                <span className="font-bold text-white">{selectedAcc.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Mã CIF:</span>
                <span className="font-mono text-slate-200">{selectedAcc.cif}</span>
              </div>
              {selectedAcc.customerPhone && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-mono text-slate-200">{selectedAcc.customerPhone}</span>
                </div>
              )}
              {selectedAcc.customerEmail && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono text-slate-200">{selectedAcc.customerEmail}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Số dư khả dụng:</span>
                <span className="font-mono font-bold text-[#A3E635] text-sm">
                  ₫ {(selectedAcc.availableBalance ?? selectedAcc.balance).toLocaleString("vi-VN")} {selectedAcc.currency || "VND"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Số dư phong tỏa:</span>
                <span className="font-mono text-amber-400">
                  ₫ {(selectedAcc.frozenBalance ?? 0).toLocaleString("vi-VN")} {selectedAcc.currency || "VND"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Loại tài khoản:</span>
                <span className="font-bold text-slate-200">{selectedAcc.accountType}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Trạng thái:</span>
                <span className="font-bold text-emerald-400">{selectedAcc.status}</span>
              </div>
              {selectedAcc.openedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ngày mở tài khoản:</span>
                  <span className="font-mono text-slate-300">{selectedAcc.openedAt}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Freeze Modal */}
      {freezeModalOpen && selectedAcc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" /> Xác nhận Khóa / Phong Tỏa Tài Khoản
              </h3>
              <button onClick={() => setFreezeModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-red-950/60 rounded-2xl border border-red-500/30 text-xs text-red-200 space-y-1">
              <p className="font-bold">Đang phong tỏa tài khoản: {selectedAcc.accountNumber}</p>
              <p>Chủ tài khoản: <strong>{selectedAcc.customerName}</strong> (CIF: {selectedAcc.cif})</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block text-xs">Loại Hình Khóa / Phong Tỏa</label>
                <CustomSelect
                  value={lockType}
                  onChange={(val) => setLockType(val as any)}
                  options={[
                    { value: "BLOCKED", label: "Khóa Tài Khoản (BLOCKED)", icon: Lock },
                    { value: "FROZEN", label: "Phong Tỏa Số Dư (FROZEN)", icon: ShieldAlert },
                  ]}
                  menuWidth="w-full"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Lý Do Phong Tỏa</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 text-xs text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Số Công Văn / Mã Tham Chiếu Pháp Lý (Nếu có)</label>
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  placeholder="VD: CV-2026/8812-BCA..."
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-red-500 font-mono text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setFreezeModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer">
                Hủy bỏ
              </button>
              <button onClick={handleFreezeConfirm} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
                Xác Nhận Phong Tỏa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unfreeze Modal */}
      {unfreezeModalOpen && selectedAcc && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Unlock className="w-5 h-5 text-[#A3E635]" /> Xác nhận Mở Khóa Tài Khoản
              </h3>
              <button onClick={() => setUnfreezeModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Bạn có chắc chắn muốn mở khóa cho tài khoản <strong>{selectedAcc.accountNumber}</strong> ({selectedAcc.customerName})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setUnfreezeModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer">
                Hủy bỏ
              </button>
              <button onClick={handleUnfreezeConfirm} className="px-5 py-2.5 bg-[#A3E635] text-slate-950 font-bold text-xs rounded-xl shadow-md cursor-pointer">
                Xác Nhận Mở Khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Account Modal */}
      {openAccountModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#A3E635]" /> Mở Tài Khoản Thanh Toán Mới Tại Quầy
              </h3>
              <button onClick={() => setOpenAccountModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOpenAccountSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Customer ID / UUID Khách Hàng <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  placeholder="Ví dụ: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#A3E635] font-mono text-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Khách hàng bắt buộc phải hoàn thành eKYC trước khi mở tài khoản.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block text-xs">Loại Tài Khoản</label>
                  <CustomSelect
                    value={newAccountType}
                    onChange={(val) => setNewAccountType(val as any)}
                    options={[
                      { value: "CHECKING", label: "Thanh toán (CHECKING)", icon: Wallet },
                      { value: "SAVINGS", label: "Tiết kiệm (SAVINGS)", icon: PiggyBank },
                    ]}
                    menuWidth="w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block text-xs">Loại Tiền Tệ</label>
                  <CustomSelect
                    value={newCurrency}
                    onChange={(val) => setNewCurrency(val)}
                    options={[
                      { value: "VND", label: "VND (Việt Nam Đồng)", icon: Coins },
                      { value: "USD", label: "USD (Đô la Mỹ)", icon: Coins },
                    ]}
                    menuWidth="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpenAccountModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewAcc}
                  className="px-5 py-2.5 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingNewAcc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Xác Nhận Mở Tài Khoản</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
