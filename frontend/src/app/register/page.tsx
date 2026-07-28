'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft,
  FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  // Step 2 State (eKYC)
  const [idNumber, setIdNumber] = useState('');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  // Step 3 State (Password)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step 4 Generated Account
  const [newAccountNumber] = useState('9333' + Math.floor(100000 + Math.random() * 900000));

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const validCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber) return;
    setCurrentStep(3);
  };

  const handleNextStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validCount < 4 || password !== confirmPassword) return;
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0D1527] text-slate-100 flex flex-col font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Top Brand Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/80 bg-[#0D1527]/95 backdrop-blur-md sticky top-0 z-30">
        <Link href="/login" className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] flex items-center justify-center text-slate-950 font-black shadow-md">
            <Landmark className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#A3E635]">
            Digital <span className="font-light text-slate-300">Bank</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">Đã có tài khoản?</span>
          <Link href="/login">
            <Button variant="outline" className="border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 font-bold rounded-full px-5 py-2">
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Registration Body */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-6 my-4">
        {/* Step Progress Indicator */}
        <div className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>
              Bước: <span className="text-[#A3E635] font-extrabold">{currentStep}/4</span> - {' '}
              {currentStep === 1 && 'Thông tin cá nhân'}
              {currentStep === 2 && 'Định danh eKYC'}
              {currentStep === 3 && 'Tạo mật khẩu đăng nhập'}
              {currentStep === 4 && 'Mở tài khoản thành công'}
            </span>
            <span className="text-emerald-400 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật eKYC chuẩn Ngân hàng
            </span>
          </div>

          <div className="h-2 w-full bg-[#1A253D] rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-[#A3E635] to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: THÔNG TIN CÁ NHÂN */}
        {currentStep === 1 && (
          <form onSubmit={handleNextStep1} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <h2 className="text-2xl font-black text-white">Mở Tài Khoản Trực Tuyến</h2>
              <p className="text-xs text-slate-400">Nhập thông tin cá nhân của bạn để khởi tạo hồ sơ mở tài khoản số chọn</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Họ và tên (như trên CCCD)</label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="NGUYEN VAN A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value.toUpperCase())}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-bold rounded-2xl h-13 text-sm pl-11 uppercase"
                  />
                  <User className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Số điện thoại</label>
                  <div className="relative">
                    <Input
                      type="tel"
                      required
                      placeholder="0988 888 999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-2xl h-13 text-sm pl-11"
                    />
                    <Phone className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Ngày sinh</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white rounded-2xl h-13 text-sm pl-11"
                    />
                    <Calendar className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Địa chỉ Email nhận thông báo</label>
                <div className="relative">
                  <Input
                    type="email"
                    required
                    placeholder="nguyenvana@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white rounded-2xl h-13 text-sm pl-11"
                  />
                  <Mail className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 h-14 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiếp Tục Định Danh eKYC</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </form>
        )}

        {/* STEP 2: ĐỊNH DANH eKYC (CCCD) */}
        {currentStep === 2 && (
          <form onSubmit={handleNextStep2} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <h2 className="text-2xl font-black text-white">Định Danh eKYC Trực Tuyến</h2>
              <p className="text-xs text-slate-400">Xác minh giấy tờ tùy thân CCCD / CMND chính chủ</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Số CCCD / CMND (12 chữ số)</label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="001203009999"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono font-bold rounded-2xl h-13 text-base pl-11"
                  />
                  <CreditCard className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                </div>
              </div>

              {/* Upload ID Card Photo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div 
                  onClick={() => setFrontUploaded(!frontUploaded)}
                  className={`p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                    frontUploaded 
                      ? 'border-[#A3E635] bg-emerald-950/40 text-[#A3E635]' 
                      : 'border-slate-700 bg-[#1A253D] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {frontUploaded ? <CheckCircle2 className="w-8 h-8 text-[#A3E635]" /> : <Upload className="w-8 h-8" />}
                  <span className="text-xs font-bold text-white">Mặt trước CCCD</span>
                  <span className="text-[10px] text-slate-400">{frontUploaded ? 'Đã tải lên ✓' : 'Nhấp để tải ảnh lên'}</span>
                </div>

                <div 
                  onClick={() => setBackUploaded(!backUploaded)}
                  className={`p-5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                    backUploaded 
                      ? 'border-[#A3E635] bg-emerald-950/40 text-[#A3E635]' 
                      : 'border-slate-700 bg-[#1A253D] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {backUploaded ? <CheckCircle2 className="w-8 h-8 text-[#A3E635]" /> : <Upload className="w-8 h-8" />}
                  <span className="text-xs font-bold text-white">Mặt sau CCCD</span>
                  <span className="text-[10px] text-slate-400">{backUploaded ? 'Đã tải lên ✓' : 'Nhấp để tải ảnh lên'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 border-slate-700 bg-[#1A253D] text-slate-200 font-bold h-12 rounded-full"
              >
                Quay Lại
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20"
              >
                Tiếp Tục Tạo Mật Khẩu
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: TẠO MẬT KHẨU */}
        {currentStep === 3 && (
          <form onSubmit={handleNextStep3} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <h2 className="text-2xl font-black text-white">Tạo Mật Khẩu Bảo Vệ</h2>
              <p className="text-xs text-slate-400">Đặt mật khẩu an toàn để đăng nhập ứng dụng Ngân hàng số</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Mật khẩu đăng nhập</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-2xl h-13 text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Xác nhận mật khẩu</label>
                <Input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-2xl h-13 text-sm"
                />
              </div>

              {/* Password Checklist */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Ít nhất 8 ký tự</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Chữ hoa (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Chữ thường (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Chữ số (0-9)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1 border-slate-700 bg-[#1A253D] text-slate-200 font-bold h-12 rounded-full"
              >
                Quay Lại
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20"
              >
                Hoàn Tất Đăng Ký
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: MỞ TÀI KHOẢN THÀNH CÔNG RECEIPT */}
        {currentStep === 4 && (
          <div className="w-full bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
              <FileCheck className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 font-semibold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Chúc mừng! Mở tài khoản thành công
              </Badge>
              <h2 className="text-2xl font-black text-white">Tài Khoản Số Chọn Đã Kích Hoạt</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Chào mừng <span className="font-bold text-white">{fullName}</span> gia nhập ngân hàng số Digital Bank!
              </p>
            </div>

            <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-3 text-sm text-left max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Số tài khoản thanh toán:</span>
                <span className="font-mono font-black text-[#A3E635] text-lg">{newAccountNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Hạn mức chuyển tiền:</span>
                <span className="font-bold text-emerald-400">500,000,000 VND / ngày</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trạng thái eKYC:</span>
                <span className="text-emerald-400 font-bold">Đã định danh ✓</span>
              </div>
            </div>

            <Link href="/login" className="block w-full max-w-md mx-auto">
              <Button className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 h-14">
                Đăng Nhập Ứng Dụng Ngay
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
