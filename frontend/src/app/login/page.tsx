'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Landmark, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  KeyRound,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('demouser@digitalbank.vn');
  const [password, setPassword] = useState('DigitalBank@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  const fillDemoAccount = () => {
    setUsername('demouser@digitalbank.vn');
    setPassword('DigitalBank@2026');
  };

  return (
    <div className="min-h-screen w-screen bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950 overflow-hidden">
      {/* LEFT HERO PANEL (Visual Showcase) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1120] via-[#141C2E] to-[#162238] p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
        {/* Background Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#A3E635]/20">
            <Landmark className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white font-sans">
            Digital <span className="font-light text-slate-300">Bank</span>
          </span>
        </div>

        {/* 3D Glassmorphism Banking Card Preview Showcase */}
        <div className="z-10 my-auto space-y-6 max-w-lg">
          <div className="space-y-3">
            <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-xs px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Kỷ Nguyên Ngân Hàng Số 4.0
            </Badge>
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Trải nghiệm tài chính thông minh, bảo mật tuyệt đối.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Quản lý tài khoản, chuyển tiền nhanh Napas 24/7 tức thì, gửi tiết kiệm trực tuyến với lãi suất ưu đãi vượt trội.
            </p>
          </div>

          {/* 3D Metallic Premium Card Floating Preview */}
          <div className="relative w-full h-52 rounded-3xl p-6 bg-gradient-to-tr from-[#0F2027] via-[#203A43] to-[#2C5364] border border-slate-600/50 shadow-2xl flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-base tracking-wider">Visa Platinum Signature</span>
              <CreditCard className="w-6 h-6 text-[#A3E635]" />
            </div>

            <div className="w-10 h-7 bg-gradient-to-tr from-amber-300 to-yellow-500 rounded-md border border-amber-600/60 shadow-sm my-2"></div>

            <div className="space-y-1">
              <div className="font-mono text-lg tracking-widest text-white font-bold drop-shadow-md">
                4129 •••• •••• 8899
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/80 font-mono">
                <span>LE CONG DUY</span>
                <span>EXP: 08/29</span>
              </div>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Mã hóa SSL 256-bit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-slate-500 font-mono">
          © 2026 Digital Bank Core. Enterprise Banking Platform.
        </div>
      </div>

      {/* RIGHT LOGIN FORM PANEL */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-between items-center overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-8">
          {/* Mobile Logo View Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] flex items-center justify-center text-slate-950 font-black">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#A3E635]">
              Digital <span className="font-light text-slate-300">Bank</span>
            </span>
          </div>

          {/* Title Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Chào mừng trở lại!</h2>
            <p className="text-xs text-slate-400">Vui lòng nhập thông tin đăng nhập để truy cập tài khoản Digital Bank</p>
          </div>

          {/* Quick Demo Fill Pill */}
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full bg-[#141C2E] hover:bg-[#1A253D] border border-slate-700/80 p-3 rounded-2xl text-xs text-slate-300 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>Dùng tài khoản thử nghiệm nhanh:</span>
            </div>
            <span className="font-mono text-emerald-400 font-bold group-hover:underline">Bấm để tự điền</span>
          </button>

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input 1: Username / Email */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">Tên đăng nhập / Email / Số điện thoại</label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#141C2E] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-medium rounded-2xl h-13 text-sm pl-11 transition-all"
                />
                <User className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400 font-semibold">Mật khẩu đăng nhập</label>
                <Link href="/settings/change-password" className="text-xs text-[#A3E635] hover:underline font-semibold">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#141C2E] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono rounded-2xl h-13 text-sm pl-11 pr-12 transition-all"
                />
                <Lock className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#141C2E] text-[#A3E635] focus:ring-0 accent-[#A3E635]"
                />
                <span>Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            {/* Neon Lime Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 transition-all h-14 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LockKeyhole className="w-5 h-5" />
              <span>{isLoading ? "Đang Xác Thực An Toàn..." : "Đăng Nhập An Toàn"}</span>
            </Button>
          </form>

          {/* Bottom Register Redirect Link */}
          <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            Chưa có tài khoản ngân hàng số?{' '}
            <Link href="/register" className="text-[#A3E635] font-extrabold hover:underline">
              Mở tài khoản số chọn eKYC ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
