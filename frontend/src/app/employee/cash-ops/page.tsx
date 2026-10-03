"use client";

import React, { useState, useEffect } from "react";
import { 
  Banknote, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  CheckCircle2, 
  Printer, 
  CreditCard, 
  FileCheck, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  Receipt,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { employeeApi, accountApi } from "@/lib/api";

const MONEY_PRESETS = [1000000, 5000000, 10000000, 50000000, 100000000];

export default function CashOperationsPage() {
  const [activeTab, setActiveTab] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  // Form states
  const [accNo, setAccNo] = useState("");
  const [custName, setCustName] = useState("");
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [amount, setAmount] = useState<number | "">(5000000);
  const [depositorName, setDepositorName] = useState("");
  const [depositorIdNumber, setDepositorIdNumber] = useState("");
  const [note, setNote] = useState("Nộp tiền mặt tại quầy giao dịch");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [refCode, setRefCode] = useState("");
  const [balanceAfter, setBalanceAfter] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live Auto-Lookup when Account Number changes
  useEffect(() => {
    const cleanAcc = accNo.trim();
    if (!cleanAcc || cleanAcc.length < 6) {
      setCustName("");
      setCurrentBalance(null);
      setLookupError(null);
      return;
    }

    setIsLookingUp(true);
    setLookupError(null);

    const timer = setTimeout(async () => {
      try {
        const lookupRes = await accountApi.lookupAccount(cleanAcc);
        if (lookupRes?.success && lookupRes.data) {
          setCustName(lookupRes.data.accountName);
          if (!depositorName) {
            setDepositorName(lookupRes.data.accountName);
          }

          // Try fetching balance as well
          try {
            const balRes = await accountApi.getAccountBalance(cleanAcc);
            if (balRes?.success && balRes.data) {
              setCurrentBalance(balRes.data.availableBalance ?? balRes.data.balance ?? 0);
            }
          } catch {
            setCurrentBalance(null);
          }
          setLookupError(null);
        } else {
          setCustName("");
          setCurrentBalance(null);
          setLookupError("Không tìm thấy tài khoản trong hệ thống.");
        }
      } catch (err: any) {
        setCustName("");
        setCurrentBalance(null);
        setLookupError(err.response?.data?.detail || err.response?.data?.message || "Tài khoản không tồn tại hoặc đã bị khóa.");
      } finally {
        setIsLookingUp(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [accNo]);

  const handlePresetClick = (val: number) => {
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0 || !accNo.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (activeTab === "DEPOSIT") {
        const res = await employeeApi.depositCash({
          accountNumber: accNo.trim(),
          amount: Number(amount),
          depositorName: depositorName || custName || "Khách hàng nộp tiền",
          depositorNationalId: depositorIdNumber || undefined,
          description: note || "Nạp tiền mặt tại quầy",
        });

        if (res?.success && res.data) {
          setTxHash(res.data.transactionCode);
          setRefCode(res.data.referenceCode);
          setBalanceAfter(res.data.balanceAfter);
          setIsSuccess(true);
        }
      } else {
        const res = await employeeApi.withdrawCash({
          accountNumber: accNo.trim(),
          amount: Number(amount),
          withdrawerName: depositorName || custName || "Khách hàng rút tiền",
          withdrawerNationalId: depositorIdNumber || undefined,
          description: note || "Rút tiền mặt tại quầy",
        });

        if (res?.success && res.data) {
          setTxHash(res.data.transactionCode);
          setRefCode(res.data.referenceCode);
          setBalanceAfter(res.data.balanceAfter);
          setIsSuccess(true);
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.message || "Giao dịch không thành công. Vui lòng kiểm tra lại số dư hoặc trạng thái tài khoản.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setAmount(5000000);
    setTxHash("");
    setRefCode("");
    setBalanceAfter(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1120] via-[#141C2E] to-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 text-[11px] font-bold uppercase tracking-wider">
              Teller Desk • TELLER OPS
            </span>
            <span className="text-xs text-slate-400 font-mono">• Quầy Giao Dịch Số</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Banknote className="w-7 h-7 text-[#A3E635]" /> Nghiệp Vụ Tiền Mặt Tại Quầy (Cash Operations)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Xử lý Nạp/Rút tiền mặt thời gian thực, tự động hạch toán sổ cái kép & in chứng từ điện tử</p>
        </div>

        {/* Real-time Counter Status Pill */}
        <div className="flex items-center gap-3 bg-[#0D1527] p-3 rounded-2xl border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white leading-none">Trạng thái quầy: Đang Mở</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">Giao dịch viên sẵn sàng</p>
          </div>
        </div>
      </div>

      {/* 2-Tab Selector Pills */}
      <div className="flex bg-[#141C2E] p-1.5 rounded-2xl border border-slate-800 max-w-md shadow-lg">
        <button
          type="button"
          onClick={() => { setActiveTab("DEPOSIT"); resetForm(); }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "DEPOSIT"
              ? "bg-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" /> 1. Nạp Tiền Mặt (Deposit)
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab("WITHDRAW"); resetForm(); }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "WITHDRAW"
              ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-900/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" /> 2. Rút Tiền Mặt (Withdraw)
        </button>
      </div>

      {/* Main Grid: Left Form (7 cols) + Right Live Slip Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#141C2E] rounded-3xl border border-slate-800 p-6 lg:p-7 shadow-xl space-y-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Search & Live Auto-Lookup Card */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Số Tài Khoản Khách Hàng (Vấn tin tự động)
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={accNo}
                    onChange={(e) => setAccNo(e.target.value)}
                    placeholder="Nhập số tài khoản khách hàng (10 số)..."
                    className="w-full pl-10 pr-24 py-3 bg-[#0D1527] border border-slate-700 rounded-2xl text-sm font-mono font-bold text-white focus:ring-2 focus:ring-[#A3E635] transition-all"
                  />
                  {isLookingUp && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse font-medium">
                      Tra cứu...
                    </span>
                  )}
                </div>

                {custName && (
                  <div className="p-4 bg-[#0D1527] border border-slate-800 rounded-2xl flex items-center justify-between animate-in fade-in">
                    <div>
                      <span className="text-slate-400 text-xs block">Chủ tài khoản:</span>
                      <span className="font-extrabold text-white text-sm uppercase">{custName}</span>
                    </div>
                    {currentBalance !== null && (
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase block font-mono">Số dư hiện tại</span>
                        <span className="font-extrabold text-[#A3E635] text-base font-mono">
                          ₫ {currentBalance.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {lookupError && (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-2xl text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{lookupError}</span>
                  </div>
                )}
              </div>

              {/* Transaction Amount Field + Preset Quick Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Số Tiền Giao Dịch (VND)
                </label>
                <input
                  type="number"
                  required
                  min={10000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Tối thiểu 10,000 VND"
                  className="w-full p-4 bg-[#0D1527] border border-slate-700 rounded-2xl text-xl font-extrabold text-white focus:ring-2 focus:ring-[#A3E635] transition-all font-mono"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {MONEY_PRESETS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetClick(val)}
                      className="px-3 py-1.5 bg-[#0D1527] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      +₫ {(val / 1000000).toFixed(0)}M
                    </button>
                  ))}
                </div>
              </div>

              {/* Depositor / Withdrawer info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {activeTab === "DEPOSIT" ? "Họ và Tên Người Nộp Tiền" : "Họ và Tên Người Rút Tiền"}
                  </label>
                  <input
                    type="text"
                    required
                    value={depositorName}
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="Nhập tên người giao dịch..."
                    className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs font-medium text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">Số CCCD/CMND Người Giao Dịch</label>
                  <input
                    type="text"
                    value={depositorIdNumber}
                    onChange={(e) => setDepositorIdNumber(e.target.value)}
                    placeholder="Nhập số CCCD (12 số)..."
                    className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Nội Dung Giao Dịch</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú giao dịch..."
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs font-medium text-white"
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !custName}
                  className={`px-8 py-4 font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeTab === "WITHDRAW"
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40"
                      : "bg-[#A3E635] hover:bg-[#86efac] text-slate-950 shadow-[#A3E635]/20"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Đang Hạch Toán Bút Toán...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>
                        {activeTab === "DEPOSIT" ? "Hạch Toán Nạp Tiền Mặt" : "Hạch Toán Rút Tiền Mặt"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Completed Screen */
            <div className="py-8 space-y-6 text-center animate-in zoom-in-95">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                  ĐÃ QUYẾT TOÁN CORE BANKING
                </span>
                <h2 className="text-2xl font-black text-white mt-2">
                  {activeTab === "DEPOSIT" ? "Nạp Tiền Mặt Thành Công!" : "Rút Tiền Mặt Thành Công!"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Mã giao dịch: <strong className="font-mono text-[#A3E635]">{txHash}</strong>
                </p>
                {refCode && (
                  <p className="text-xs text-slate-400">
                    Mã chứng từ quầy: <strong className="font-mono text-emerald-400">{refCode}</strong>
                  </p>
                )}
                {balanceAfter !== null && (
                  <p className="text-sm text-slate-200 mt-2">
                    Số dư sau giao dịch: <strong className="font-mono text-[#A3E635] font-black text-base">{balanceAfter.toLocaleString("vi-VN")} VND</strong>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> In Chứng Từ PDF
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-[#0D1527] hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Thực Hiện Giao Dịch Khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Printable Slip Preview (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#141C2E] to-[#0D1527] rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header Voucher Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#A3E635]" />
                <span className="font-extrabold text-sm text-white">Xem Trước Chứng Từ Quầy (Live Voucher)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                OFFICIAL SLIP
              </span>
            </div>

            {/* Simulated Printed Voucher Paper Card */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 space-y-4 text-xs font-mono relative shadow-inner text-slate-200">
              {/* Top Watermark / Brand */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <p className="font-extrabold text-white text-sm">DIGITAL BANK CORE</p>
                  <p className="text-[10px] text-slate-400">CHỨNG TỪ GIAO DỊCH TẠI QUẦY</p>
                </div>
                <QrCode className="w-10 h-10 text-slate-300" />
              </div>

              {/* Content Rows */}
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Loại nghiệp vụ:</span>
                  <span className="font-bold text-[#A3E635]">
                    {activeTab === "DEPOSIT" ? "NẠP TIỀN MẶT" : "RÚT TIỀN MẶT"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Mã bút toán:</span>
                  <span className="font-bold text-white">{txHash || "CHỜ HẠCH TOÁN..."}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <span className="font-bold text-white">{accNo || "---"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Tên khách hàng:</span>
                  <span className="font-bold text-white uppercase">{custName || "CHƯA XÁC ĐỊNH"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {activeTab === "DEPOSIT" ? "Người nộp tiền:" : "Người rút tiền:"}
                  </span>
                  <span className="text-slate-300">{depositorName || custName || "Chính chủ"}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs">
                    {activeTab === "DEPOSIT" ? "SỐ TIỀN NẠP:" : "SỐ TIỀN RÚT:"}
                  </span>
                  <span className="font-extrabold text-base text-[#A3E635]">
                    ₫ {amount ? Number(amount).toLocaleString("vi-VN") : "0"}
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Phí giao dịch:</span>
                  <span className="text-emerald-400">₫ 0 (Miễn phí tại quầy)</span>
                </div>
              </div>

              {/* Signatures Footer mockup */}
              <div className="pt-4 border-t border-dashed border-slate-800 grid grid-cols-2 gap-4 text-center text-[10px] text-slate-400">
                <div>
                  <p className="font-bold text-slate-300">Khách hàng</p>
                  <div className="h-10"></div>
                  <p className="italic text-[9px]">(Ký & ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">Giao dịch viên</p>
                  <p className="font-bold text-emerald-400 text-[10px] mt-2">XÁC NHẬN E-STAMP</p>
                  <p className="italic text-[9px]">(Đã hạch toán vào hệ thống)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Footer Note */}
          <div className="p-3 bg-[#0D1527] border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A3E635] shrink-0" />
            <span>Chứng từ có giá trị pháp lý, được mã hóa sha256 trên sổ cái ngân hàng số.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
