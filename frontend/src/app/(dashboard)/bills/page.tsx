'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  Zap, 
  Droplets, 
  Wifi, 
  Smartphone, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Building2
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OtpModal } from '@/components/OtpModal';

// Bill Payment Categories
const BILL_SERVICES = [
  { id: 'ELECTRICITY', title: 'Thanh toán tiền Điện', desc: 'EVN Miền Bắc, Miền Nam, Hà Nội, TP.HCM', icon: Zap, color: 'from-amber-500 to-yellow-400' },
  { id: 'WATER', title: 'Thanh toán tiền Nước', desc: 'Công ty Nước sạch Sawaco, Viwaco', icon: Droplets, color: 'from-cyan-500 to-blue-400' },
  { id: 'DATA', title: 'Nạp Data 4G/5G', desc: 'Gói cước Viettel, Vina, Mobi ưu đãi 20%', icon: Wifi, color: 'from-emerald-500 to-teal-400' },
  { id: 'MOBILE', title: 'Nạp tiền điện thoại', desc: 'Chiết khấu tức thì cho mọi nhà mạng', icon: Smartphone, color: 'from-indigo-500 to-purple-400' },
  { id: 'TUITION', title: 'Thanh toán Học phí', desc: 'Trường Đại học, Cao đẳng, Phổ thông', icon: GraduationCap, color: 'from-pink-500 to-rose-400' },
];

const ELECTRICITY_PROVIDERS = [
  { code: 'EVN_MB', name: 'EVN Miền Bắc' },
  { code: 'EVN_HN', name: 'EVN Hà Nội' },
  { code: 'EVN_HCM', name: 'EVN TP.HCM' },
  { code: 'EVN_MN', name: 'EVN Miền Nam' },
];

export default function BillsPage() {
  const [activeCategory, setActiveCategory] = useState<'ELECTRICITY' | 'WATER' | 'DATA' | 'MOBILE' | 'TUITION'>('ELECTRICITY');
  
  // Electricity form state
  const [selectedProvider, setSelectedProvider] = useState('EVN_MB');
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [customerCode, setCustomerCode] = useState('PE010293847');
  const [billAmount] = useState<number | null>(1250000);
  const [customerName] = useState('LE CONG DUY');
  
  // Data topup state
  const [selectedDataPkg, setSelectedDataPkg] = useState(120000);

  // Mobile topup state
  const [selectedMobileAmount, setSelectedMobileAmount] = useState(100000);

  const [showOtp, setShowOtp] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentProviderName = ELECTRICITY_PROVIDERS.find(p => p.code === selectedProvider)?.name || 'EVN Miền Bắc';

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
  };

  const handleOtpVerify = async () => {
    setShowOtp(false);
    setIsCompleted(true);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column (Fixed Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Taller & Spacious Fixed Topbar (h-20) */}
        <header className="h-20 px-8 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 bg-[#0D1527]/95 backdrop-blur-md shrink-0 z-30 shadow-md">
          <div className="flex items-center gap-3 bg-[#141C2E] border border-slate-800/80 px-4 py-2 rounded-full">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              CD
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-sm tracking-wide">LÊ CÔNG DUY</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Tiêu chuẩn &gt;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <Link href="/settings" className="flex items-center gap-2 hover:text-white transition-colors">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Cài đặt</span>
            </Link>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">English</span>
            </button>
            <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors">
              <Power className="w-4 h-4" />
              <span>Đăng xuất</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Main Content Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Thanh toán hóa đơn & Dịch vụ</span>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Thanh toán Hóa đơn & Nạp tiền</h1>
            <p className="text-xs text-slate-400 mt-1">Thanh toán tiền điện, nước, cước viễn thông và nạp Data 4G/5G tự động 24/7</p>
          </div>

          {/* Service Category Grid Selection Pills */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {BILL_SERVICES.map((srv) => {
              const Icon = srv.icon;
              const isActive = activeCategory === srv.id;
              return (
                <button
                  key={srv.id}
                  onClick={() => {
                    setActiveCategory(srv.id as any);
                    setIsCompleted(false);
                  }}
                  className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-[#1A253D] border-[#A3E635] text-white shadow-xl shadow-[#A3E635]/10 scale-105' 
                      : 'bg-[#141C2E] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${srv.color} flex items-center justify-center text-slate-950 font-black shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-xs">{srv.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Payment Form Container */}
          <div className="max-w-2xl mx-auto pb-12">
            {isCompleted ? (
              <div className="bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Thanh Toán Thành Công!</h3>
                  <p className="text-xs text-slate-300">
                    Mã giao dịch: <span className="font-mono font-bold text-[#A3E635]">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </p>
                </div>

                <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-3 text-sm text-left max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Dịch vụ:</span>
                    <span className="font-bold text-white">
                      {activeCategory === 'ELECTRICITY' && 'Thanh toán tiền Điện EVN'}
                      {activeCategory === 'WATER' && 'Thanh toán tiền Nước'}
                      {activeCategory === 'DATA' && 'Nạp Data 4G/5G Viettel'}
                      {activeCategory === 'MOBILE' && 'Nạp tiền điện thoại'}
                      {activeCategory === 'TUITION' && 'Thanh toán Học phí'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Khách hàng:</span>
                    <span className="font-bold text-slate-200">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số tiền trích:</span>
                    <span className="font-mono font-black text-[#A3E635] text-lg">
                      {(activeCategory === 'ELECTRICITY' ? (billAmount || 0) : activeCategory === 'DATA' ? selectedDataPkg : selectedMobileAmount).toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setIsCompleted(false)}
                  className="w-full max-w-md bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3.5 rounded-full shadow-lg shadow-[#A3E635]/20 h-12"
                >
                  Thực Hiện Giao Dịch Khác
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePayBill} className="bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                {/* 1. ELECTRICITY FORM */}
                {activeCategory === 'ELECTRICITY' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <span>Thanh toán tiền Điện EVN</span>
                      </h3>
                      <Badge variant="outline" className="border-amber-800 text-amber-400 bg-amber-950/60 text-[10px]">
                        Tự động tra cứu hóa đơn
                      </Badge>
                    </div>

                    {/* CUSTOM SOFT ROUNDED POPOVER DROPDOWN */}
                    <div className="space-y-1.5 relative">
                      <label className="text-xs text-slate-400 font-semibold">Nhà cung cấp điện lực</label>
                      <button
                        type="button"
                        onClick={() => setIsProviderOpen(!isProviderOpen)}
                        className={`w-full bg-[#1A253D] border ${
                          isProviderOpen ? 'border-[#A3E635] ring-2 ring-[#A3E635]/30 shadow-[0_0_15px_rgba(163,230,53,0.25)]' : 'border-slate-700'
                        } rounded-2xl px-4 py-3.5 text-sm font-extrabold text-white flex items-center justify-between transition-all cursor-pointer`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          <span>{currentProviderName}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProviderOpen ? 'rotate-180 text-[#A3E635]' : ''}`} />
                      </button>

                      {isProviderOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#162238] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in zoom-in-95 duration-150">
                          {ELECTRICITY_PROVIDERS.map((p) => (
                            <button
                              key={p.code}
                              type="button"
                              onClick={() => {
                                setSelectedProvider(p.code);
                                setIsProviderOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                                selectedProvider === p.code 
                                  ? 'bg-[#25324D] text-[#A3E635]' 
                                  : 'text-slate-300 hover:bg-[#1D2B47] hover:text-white'
                              }`}
                            >
                              <span>{p.name}</span>
                              {selectedProvider === p.code && <CheckCircle2 className="w-4 h-4 text-[#A3E635]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold">Mã khách hàng (PE...)</label>
                      <Input
                        type="text"
                        value={customerCode}
                        onChange={(e) => setCustomerCode(e.target.value)}
                        className="bg-[#1A253D] text-white font-mono font-bold rounded-2xl h-13 text-base"
                      />
                    </div>

                    {/* Bill Lookup Result Preview */}
                    {billAmount && (
                      <div className="bg-[#1A253D] border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Tên chủ hộ:</span>
                          <span className="font-bold text-white">{customerName}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Kỳ cước:</span>
                          <span className="font-mono text-slate-200">Tháng 07/2026</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-800">
                          <span className="font-bold text-white">Số tiền cước:</span>
                          <span className="font-mono font-black text-xl text-[#A3E635]">
                            {billAmount.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. DATA 4G/5G FORM */}
                {activeCategory === 'DATA' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-emerald-400" />
                        <span>Nạp Data 4G/5G Siêu Tốc</span>
                      </h3>
                      <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px]">
                        Ưu đãi 20%
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold">Số điện thoại nhận Data</label>
                      <Input
                        type="tel"
                        defaultValue="0988888999"
                        className="bg-[#1A253D] text-white font-mono font-bold rounded-2xl h-13 text-base"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400 font-semibold">Chọn gói cước Data 4G/5G</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: '30GB / Tháng', val: 90000, desc: '1GB/ngày' },
                          { label: '60GB / Tháng', val: 120000, desc: '2GB/ngày' },
                          { label: '120GB / Tháng', val: 200000, desc: '4GB/ngày' },
                        ].map((pkg) => (
                          <button
                            key={pkg.val}
                            type="button"
                            onClick={() => setSelectedDataPkg(pkg.val)}
                            className={`p-3.5 rounded-2xl border text-left transition-all ${
                              selectedDataPkg === pkg.val 
                                ? 'bg-[#25324D] border-[#A3E635] text-white shadow-lg shadow-[#A3E635]/10' 
                                : 'bg-[#1A253D] border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="font-extrabold text-xs text-white">{pkg.label}</div>
                            <div className="font-mono font-black text-sm text-[#A3E635] mt-1">{pkg.val.toLocaleString('vi-VN')}đ</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{pkg.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. MOBILE TOP-UP FORM */}
                {activeCategory === 'MOBILE' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-base text-white flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-400" />
                        <span>Nạp tiền điện thoại trả trước</span>
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold">Số điện thoại</label>
                      <Input
                        type="tel"
                        defaultValue="0988888999"
                        className="bg-[#1A253D] text-white font-mono font-bold rounded-2xl h-13 text-base"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-slate-400 font-semibold">Mệnh giá nạp</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[50000, 100000, 200000, 500000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSelectedMobileAmount(amt)}
                            className={`p-3 rounded-2xl border text-center font-mono font-bold text-xs transition-all ${
                              selectedMobileAmount === amt 
                                ? 'bg-[#25324D] border-[#A3E635] text-[#A3E635] shadow-lg shadow-[#A3E635]/10' 
                                : 'bg-[#1A253D] border-slate-700 text-slate-200'
                            }`}
                          >
                            {amt.toLocaleString('vi-VN')}đ
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Payment Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 h-14 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Thanh Toán Tức Thì</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            )}
          </div>

          <OtpModal
            isOpen={showOtp}
            onClose={() => setShowOtp(false)}
            onVerify={handleOtpVerify}
            amount={activeCategory === 'ELECTRICITY' ? (billAmount || 0) : activeCategory === 'DATA' ? selectedDataPkg : selectedMobileAmount}
            isLoading={false}
          />
        </main>
      </div>
    </div>
  );
}
