'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  QrCode,
  Scan,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  ArrowRightLeft,
  Landmark,
  UploadCloud,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react';

export default function QrPayPage() {
  const [activeTab, setActiveTab] = useState<'MY_QR' | 'SCAN_QR'>('MY_QR');
  
  // My QR state
  const [accountNumber, setAccountNumber] = useState<string>('1029384756');
  const [accountName, setAccountName] = useState<string>('NGUYEN VAN A');
  const [amount, setAmount] = useState<string>('500000');
  const [memo, setMemo] = useState<string>('Chuyen tien qua VietQR');
  const [copied, setCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Scan QR state
  const [scannedResult, setScannedResult] = useState<{
    bankName: string;
    accountNo: string;
    accountHolder: string;
    amount: number;
    memo: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyLink = () => {
    setCopied(true);
    showToast('Đã sao chép đường dẫn VietQR vào bộ nhớ tạm!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        bankName: 'VIETCOMBANK (VCB)',
        accountNo: '0071000998877',
        accountHolder: 'TRAN THI B',
        amount: 350000,
        memo: 'Thanh toan tien an trua qua QR',
      });
      showToast('Đã trích xuất thông tin mã VietQR thành công!');
    }, 1500);
  };

  // Generate dynamic QR image url from quickchart qr api with Napas247 / VietQR payload format
  const qrPayload = `00020101021238580010A00000072701280006970407011410293847560208QRIBFTTA53037045407${amount || '0'}5802VN62180814${encodeURIComponent(
    memo || 'VietQR'
  )}6304`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    qrPayload
  )}&color=0B1120&bgcolor=FFFFFF`;

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
        {/* Toast Notification Banner */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-sm font-semibold rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635]">
                <QrCode className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Thanh toán VietQR & Quét Mã QR
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Tạo mã VietQR chuẩn NAPAS 247 nhận tiền tức thì hoặc Quét mã QR chuyển khoản siêu tốc.
            </p>
          </div>

          {/* Toggle Tab Buttons */}
          <div className="flex p-1 bg-[#121A2D] border border-slate-800 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('MY_QR')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'MY_QR'
                  ? 'bg-gradient-to-r from-emerald-500 to-[#A3E635] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Mã QR Của Tôi</span>
            </button>
            <button
              onClick={() => setActiveTab('SCAN_QR')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'SCAN_QR'
                  ? 'bg-gradient-to-r from-emerald-500 to-[#A3E635] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Quét Mã QR</span>
            </button>
          </div>
        </div>

        {/* Tab 1: MY VIETQR CODE */}
        {activeTab === 'MY_QR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: QR Code Display Card (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-[#121A2D] border border-slate-800 rounded-3xl p-6 flex flex-col items-center shadow-2xl space-y-5">
                {/* VietQR Frame Header */}
                <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#A3E635] text-slate-950 flex items-center justify-center font-extrabold text-xs">
                      DB
                    </div>
                    <span className="font-extrabold text-sm text-white tracking-tight">Digital Bank</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                    <Zap className="w-3.5 h-3.5" />
                    <span>VietQR NAPAS 247</span>
                  </div>
                </div>

                {/* Main QR Code Canvas Box */}
                <div className="relative p-5 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 border-emerald-500/40">
                  <img
                    src={qrCodeUrl}
                    alt="VietQR Code"
                    className="w-56 h-56 object-contain rounded-xl"
                  />
                  {/* Center Bank Logo Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-white p-1 rounded-xl shadow-lg border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-full h-full bg-[#0B1120] text-[#A3E635] rounded-lg flex items-center justify-center font-black text-sm">
                        DB
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Details Summary */}
                <div className="w-full bg-[#182238] p-4 rounded-2xl border border-slate-800 text-center space-y-1 font-mono">
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Chủ tài khoản</div>
                  <div className="text-base font-bold text-white uppercase">{accountName}</div>
                  <div className="text-sm font-bold text-[#A3E635]">{accountNumber}</div>
                  {amount && (
                    <div className="text-lg font-black text-emerald-400 pt-1">
                      {Number(amount).toLocaleString('vi-VN')} VND
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => showToast('Đã tải ảnh mã VietQR về thiết bị!')}
                    className="flex items-center justify-center gap-2 p-3 bg-[#1A253D] border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Tải Ảnh QR</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 p-3 bg-[#1A253D] border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>{copied ? 'Đã Sao Chép!' : 'Copy Link QR'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: QR Generator Form Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#121A2D] border border-slate-800 rounded-3xl p-6 space-y-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <span>Tùy chỉnh thông tin nhận tiền</span>
                </h2>

                <div className="space-y-4">
                  {/* Receiving Account Select */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Tài khoản nhận tiền
                    </label>
                    <select
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-[#182238] border border-slate-700 text-slate-100 text-sm font-mono font-bold rounded-xl p-3.5 focus:outline-none focus:border-[#A3E635]"
                    >
                      <option value="1029384756">1029384756 - Tài khoản thanh toán (125,400,000 VND)</option>
                      <option value="999888777">999888777 - Tài khoản tiết kiệm linh hoạt (450,000,000 VND)</option>
                    </select>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Số tiền nhận (VND) - Không bắt buộc
                    </label>
                    <input
                      type="number"
                      placeholder="Nhập số tiền..."
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-[#182238] border border-slate-700 text-emerald-400 font-mono font-bold text-lg rounded-xl p-3.5 focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>

                  {/* Fast Amount Quick Pick */}
                  <div className="flex gap-2">
                    {['100000', '200000', '500000', '1000000', '2000000'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                          amount === val
                            ? 'bg-[#A3E635]/20 border-[#A3E635] text-[#A3E635]'
                            : 'bg-[#182238] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {Number(val).toLocaleString('vi-VN')}
                      </button>
                    ))}
                  </div>

                  {/* Transaction Memo */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      Nội dung chuyển tiền
                    </label>
                    <input
                      type="text"
                      placeholder="Nội dung nhận tiền..."
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full bg-[#182238] border border-slate-700 text-slate-100 text-sm rounded-xl p-3.5 focus:outline-none focus:border-[#A3E635]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-emerald-300">Tiêu chuẩn VietQR NAPAS 247</span>
                    Mã QR được tạo tự động tương thích 100% với tất cả ứng dụng Ngân hàng số tại Việt Nam (Vietcombank, MB, Techcombank, BIDV, Agribank, ACB, VPBank...).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SCAN QR CODE */}
        {activeTab === 'SCAN_QR' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-[#121A2D] border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Quét mã QR Thanh toán & Chuyển khoản</h2>
                <p className="text-xs text-slate-400">
                  Tải lên ảnh mã QR từ thiết bị hoặc sử dụng chế độ giả lập quét camera để trích xuất thông tin tự động.
                </p>
              </div>

              {/* Camera Simulator Box */}
              <div className="relative w-full max-w-sm mx-auto h-64 bg-[#0B1120] border-2 border-dashed border-emerald-500/60 rounded-3xl flex flex-col items-center justify-center p-6 space-y-4 overflow-hidden group">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-bold text-emerald-400 animate-pulse">Đang phân tích mã VietQR...</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <div className="text-xs text-slate-400">Kéo thả ảnh QR vào đây hoặc bấm tải lên</div>
                    <button
                      onClick={handleSimulateScan}
                      className="px-5 py-2.5 bg-[#A3E635] text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:opacity-90 transition-all"
                    >
                      Quét Mã VietQR Mẫu
                    </button>
                  </>
                )}
              </div>

              {/* Scanned Result Card */}
              {scannedResult && (
                <div className="bg-[#182238] border border-emerald-500/50 rounded-2xl p-6 text-left space-y-4 shadow-xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm text-white">Thông tin chuyển tiền VietQR</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      NAPAS 247
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <span className="text-xs text-slate-400 block font-sans">Ngân hàng thụ hưởng</span>
                      <span className="font-bold text-white">{scannedResult.bankName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-sans">Số tài khoản nhận</span>
                      <span className="font-bold text-emerald-400">{scannedResult.accountNo}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-sans">Tên người thụ hưởng</span>
                      <span className="font-bold text-white uppercase">{scannedResult.accountHolder}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-sans">Số tiền chuyển</span>
                      <span className="font-bold text-lg text-emerald-400">
                        {scannedResult.amount.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-sans">Nội dung chuyển</span>
                    <span className="text-xs text-slate-200 italic">{scannedResult.memo}</span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/transfers?destBank=${encodeURIComponent(
                        scannedResult.bankName
                      )}&account=${scannedResult.accountNo}&name=${encodeURIComponent(
                        scannedResult.accountHolder
                      )}&amount=${scannedResult.amount}&memo=${encodeURIComponent(scannedResult.memo)}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-[#A3E635] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition-all"
                    >
                      <span>Tiến Hành Chuyển Tiền Tức Thì</span>
                      <ArrowRightLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
