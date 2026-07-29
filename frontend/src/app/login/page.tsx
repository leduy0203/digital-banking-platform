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
  Sparkles,
  CreditCard,
  CheckCircle2,
  LockKeyhole,
  Shield,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type RoleType = 'USER' | 'EMPLOYEE' | 'ADMIN';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleType>('USER');
  const [username, setUsername] = useState('khachhang@digitalbank.vn');
  const [password, setPassword] = useState('Customer123@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [adminNoticeOpen, setAdminNoticeOpen] = useState(false);

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    if (role === 'USER') {
      setUsername('khachhang@vcb.com');
      setPassword('123456');
    } else if (role === 'EMPLOYEE') {
      setUsername('nhanvien@vcb.com');
      setPassword('123456');
    } else if (role === 'ADMIN') {
      setUsername('admin.system@digitalbank.vn');
      setPassword('Admin123@2026');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (selectedRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }, 600);
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
              Hệ thống vận hành đa phân quyền dành cho Khách hàng cá nhân, Nhân viên ngân hàng (Teller/Staff) và Quản trị viên (Admin Core).
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
      <div className="w-full lg:w-1/2 p-6 sm:p-12 md:p-14 flex flex-col justify-between items-center overflow-y-auto">
        <div className="w-full max-w-md my-auto space-y-6">
          {/* Mobile Logo View Header */}
          <div className="flex lg:hidden items-center gap-2.5 mb-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] flex items-center justify-center text-slate-950 font-black">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#A3E635]">
              Digital <span className="font-light text-slate-300">Bank</span>
            </span>
          </div>

          {/* Title Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Đăng nhập Hệ Thống Ngân Hàng</h2>
            <p className="text-xs text-slate-400">Chọn vai trò để tự động điền tài khoản thử nghiệm</p>
          </div>

          {/* 3 DEMO ROLE SELECTOR PILLS */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Chọn vai trò truy cập (Role Accounts)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Role 1: Customer / User */}
              <button
                type="button"
                onClick={() => handleSelectRole('USER')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedRole === 'USER'
                  ? 'bg-[#1E293B] border-[#A3E635] text-white shadow-md shadow-[#A3E635]/10'
                  : 'bg-[#141C2E] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <User className={`w-4 h-4 ${selectedRole === 'USER' ? 'text-[#A3E635]' : 'text-slate-400'}`} />
                  {selectedRole === 'USER' && <span className="w-2 h-2 rounded-full bg-[#A3E635]"></span>}
                </div>
                <div className="mt-2">
                  <p className="font-bold text-xs text-white">1. Khách Hàng</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Digital Banking</p>
                </div>
              </button>

              {/* Role 2: Employee / Staff */}
              <button
                type="button"
                onClick={() => handleSelectRole('EMPLOYEE')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedRole === 'EMPLOYEE'
                  ? 'bg-[#003B23] border-emerald-400 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-[#141C2E] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <UserCheck className={`w-4 h-4 ${selectedRole === 'EMPLOYEE' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {selectedRole === 'EMPLOYEE' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </div>
                <div className="mt-2">
                  <p className="font-bold text-xs text-white">2. Nhân Viên</p>
                  <p className="text-[10px] text-emerald-300/80 leading-tight">Teller Portal</p>
                </div>
              </button>

              {/* Role 3: Admin */}
              <button
                type="button"
                onClick={() => handleSelectRole('ADMIN')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${selectedRole === 'ADMIN'
                  ? 'bg-purple-950/60 border-purple-400 text-white shadow-md'
                  : 'bg-[#141C2E] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <Shield className={`w-4 h-4 ${selectedRole === 'ADMIN' ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span className="px-1 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded font-mono">Next</span>
                </div>
                <div className="mt-2">
                  <p className="font-bold text-xs text-white">3. Quản Trị Viên</p>
                  <p className="text-[10px] text-purple-300/80 leading-tight">Admin System</p>
                </div>
              </button>
            </div>
          </div>

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input 1: Username / Email */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold">Tên đăng nhập / Email</label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#141C2E] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-medium rounded-xl h-12 text-xs pl-10 transition-all"
                />
                <User className="w-4 h-4 absolute left-3.5 top-4 text-slate-400" />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1">
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
                  className="bg-[#141C2E] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-xl h-12 text-xs pl-10 pr-10 transition-all"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-4 text-slate-400 hover:text-white"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition-all h-12 flex items-center justify-center gap-2 cursor-pointer mt-2 ${selectedRole === 'EMPLOYEE'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                : selectedRole === 'ADMIN'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40'
                  : 'bg-[#A3E635] hover:bg-[#86efac] text-slate-950 shadow-[#A3E635]/20'
                }`}
            >
              <LockKeyhole className="w-4 h-4" />
              <span>
                {isLoading
                  ? "Đang Xác Thực An Toàn..."
                  : selectedRole === 'EMPLOYEE'
                    ? "Đăng Nhập Quầy Nhân Viên"
                    : selectedRole === 'ADMIN'
                      ? "Đăng Nhập Cổng Admin"
                      : "Đăng Nhập Ngân Hàng Số"}
              </span>
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

      {/* Admin Notice Modal */}
      {adminNoticeOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-2xl max-w-md w-full p-6 space-y-4 border border-purple-500/30 text-white shadow-2xl">
            <div className="flex items-center gap-3 text-purple-400">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Cổng Quản Trị Viên (Admin Portal)</h3>
                <p className="text-xs text-purple-300/80">Tính năng đang trong lộ trình phát triển</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Role <strong>Admin (ROLE_ADMIN)</strong> được thiết kế cho quản trị hệ thống (cấu hình hạn mức chuyển tiền, phí giao dịch, giám sát log hệ thống và quản lý tài khoản nhân viên).
            </p>

            <div className="p-3 bg-purple-950/60 border border-purple-500/20 rounded-xl text-xs space-y-1">
              <p className="font-bold text-purple-200">Tài khoản Admin thử nghiệm:</p>
              <p className="font-mono text-slate-300">Email: admin.system@digitalbank.vn</p>
              <p className="font-mono text-slate-300">Password: Admin123@2026</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAdminNoticeOpen(false)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Đã Hiểu, Quay Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
