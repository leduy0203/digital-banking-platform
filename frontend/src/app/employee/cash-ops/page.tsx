"use client";

import React, { useState } from "react";
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
  UserCheck,
  Sparkles,
  QrCode,
  Building2,
  LockKeyhole,
  Receipt
} from "lucide-react";
import { employeeApi } from "@/lib/api";

const MONEY_PRESETS = [1000000, 5000000, 10000000, 50000000, 100000000];

export default function CashOperationsPage() {
  const [activeTab, setActiveTab] = useState<"DEPOSIT" | "WITHDRAW" | "TRANSFER">("DEPOSIT");

  // Form states
  const [accNo, setAccNo] = useState("1019283746");
  const [custName, setCustName] = useState("Trần Thị Bích Ngọc");
  const [currentBalance, setCurrentBalance] = useState(145200000);
  const [amount, setAmount] = useState<number | "">(5000000);
  const [depositorName, setDepositorName] = useState("Trần Thị Bích Ngọc");
  const [depositorIdNumber, setDepositorIdNumber] = useState("079201998812");
  const [otp, setOtp] = useState("");
  const [note, setNote] = useState("Nạp tiền mặt trực tiếp tại quầy VCB");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccLookup = (val: string) => {
    setAccNo(val);
    if (val === "1019283746") {
      setCustName("Trần Thị Bích Ngọc");
      setCurrentBalance(145200000);
      setDepositorName("Trần Thị Bích Ngọc");
    } else if (val === "1028374651") {
      setCustName("Lê Văn Hùng");
      setCurrentBalance(28500000);
      setDepositorName("Lê Văn Hùng");
    } else if (val === "1039485762") {
      setCustName("Phạm Hoàng Nam");
      setCurrentBalance(12500000);
      setDepositorName("Phạm Hoàng Nam");
    } else {
      setCustName("");
      setCurrentBalance(0);
    }
  };

  const handlePresetClick = (val: number) => {
    setAmount(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setIsSubmitting(true);

    const res = await employeeApi.executeCashOp({
      type: activeTab,
      accountNumber: accNo,
      amount: Number(amount),
      depositorName,
      otp,
    });

    setTimeout(() => {
      setTxHash(res.txHash || "FT" + Date.now());
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setAmount(5000000);
    setOtp("");
    setTxHash("");
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B1120] via-[#141C2E] to-[#1E293B] border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30 text-[11px] font-bold uppercase tracking-wider">
              Teller Desk • TELLER-04
            </span>
            <span className="text-xs text-slate-400 font-mono">• CN Bến Thành</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <Banknote className="w-7 h-7 text-[#A3E635]" /> Nghiệp Vụ Tiền Mặt Tại Quầy (Cash Operations)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Xử lý Nạp/Rút tiền mặt, chuyển tiền quầy & in chứng từ giao dịch điện tử</p>
        </div>

        {/* Real-time Counter Status Pill */}
        <div className="flex items-center gap-3 bg-[#0D1527] p-3 rounded-2xl border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white leading-none">Trạng thái quầy: Đang Mở</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">Giao dịch viên: EMP-8821</p>
          </div>
        </div>
      </div>

      {/* Modern 3-Tab Selector Pills */}
      <div className="flex bg-[#141C2E] p-1.5 rounded-2xl border border-slate-800 max-w-xl shadow-lg">
        <button
          onClick={() => { setActiveTab("DEPOSIT"); resetForm(); }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "DEPOSIT"
              ? "bg-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" /> 1. Nạp Tiền Mặt
        </button>

        <button
          onClick={() => { setActiveTab("WITHDRAW"); resetForm(); }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "WITHDRAW"
              ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-900/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ArrowUpRight className="w-4 h-4" /> 2. Rút Tiền Mặt
        </button>

        <button
          onClick={() => { setActiveTab("TRANSFER"); resetForm(); }}
          className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "TRANSFER"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Send className="w-4 h-4" /> 3. Chuyển Tiền Quầy
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
                    onChange={(e) => handleAccLookup(e.target.value)}
                    placeholder="Nhập STK (Thử: 1019283746, 1028374651)..."
                    className="w-full pl-10 pr-4 py-3 bg-[#0D1527] border border-slate-700 rounded-2xl text-sm font-mono font-bold text-white focus:ring-2 focus:ring-[#A3E635] transition-all"
                  />
                </div>

                {custName ? (
                  <div className="p-4 bg-[#0D1527] border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs block">Chủ tài khoản:</span>
                      <span className="font-extrabold text-white text-sm">{custName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Số dư khả dụng</span>
                      <span className="font-extrabold text-[#A3E635] text-base font-mono">
                        ₫ {currentBalance.toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-2xl text-xs text-red-300">
                    ⚠️ Không tìm thấy tài khoản trong hệ thống. Vui lòng thử STK mẫu: <strong>1019283746</strong>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Ví dụ: 5,000,000"
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

              {/* Tab 1: Deposit specific fields */}
              {activeTab === "DEPOSIT" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Họ và Tên Người Nộp Tiền</label>
                    <input
                      type="text"
                      value={depositorName}
                      onChange={(e) => setDepositorName(e.target.value)}
                      className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs font-medium text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Số CCCD Người Nộp</label>
                    <input
                      type="text"
                      value={depositorIdNumber}
                      onChange={(e) => setDepositorIdNumber(e.target.value)}
                      className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Withdraw specific fields with signature specimen comparison */}
              {activeTab === "WITHDRAW" && (
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div className="p-4 bg-[#0D1527] border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Mẫu Chữ Ký Khách Hàng Lưu Trên Hệ Thống
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ Chữ ký đã đăng ký
                      </span>
                    </div>

                    <div className="h-28 bg-white rounded-xl p-2 flex items-center justify-center border border-slate-700">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/John_Hancock_Signature.svg/640px-John_Hancock_Signature.svg.png" 
                        alt="Mẫu chữ ký khách hàng" 
                        className="h-20 object-contain opacity-90"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">Teller xác nhận chữ ký trên giấy rút tiền khớp với mẫu chữ ký điện tử trên.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Mã OTP Xác Thực Giao Dịch Rút Tiền</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Nhập 6 số OTP khách hàng nhận qua SMS..."
                      className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl text-sm font-mono tracking-widest text-white"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2.5 cursor-pointer ${
                    activeTab === "WITHDRAW"
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40"
                      : activeTab === "TRANSFER"
                      ? "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40"
                      : "bg-[#A3E635] hover:bg-[#86efac] text-slate-950 shadow-[#A3E635]/20"
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                  <span>{isSubmitting ? "Đang Xử Lý Bút Toán..." : "Hạch Toán Giao Dịch Quầy"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Completed Screen */
            <div className="py-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                  ĐÃ QUYẾT TOÁN CORE BANKING
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Hạch Toán Quầy Thành Công!</h2>
                <p className="text-xs text-slate-400 mt-1">Mã bút toán: <strong className="font-mono text-[#A3E635]">{txHash}</strong></p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> In Chứng Từ PDF
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-[#0D1527] hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Giao Dịch Tiếp Theo
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
                    {activeTab === "DEPOSIT" ? "NẠP TIỀN MẶT" : activeTab === "WITHDRAW" ? "RÚT TIỀN MẶT" : "CHUYỂN TIỀN QUẦY"}
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

                {activeTab === "DEPOSIT" && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Người nộp tiền:</span>
                    <span className="text-slate-300">{depositorName || "Chính chủ"}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-xs">SỐ TIỀN THỰC THU:</span>
                  <span className="font-extrabold text-base text-[#A3E635]">
                    ₫ {amount ? Number(amount).toLocaleString("vi-VN") : "0"}
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Phí giao dịch:</span>
                  <span className="text-emerald-400">₫ 0 (Miễn phí)</span>
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
                  <p className="font-bold text-emerald-400 text-[10px] mt-2">EMP-8821</p>
                  <p className="italic text-[9px]">(Đã xác nhận e-Stamp)</p>
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
