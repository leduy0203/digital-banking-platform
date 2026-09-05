'use client';

import { useState, useEffect } from 'react';
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
  FileCheck,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Loader2,
  MapPin,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  // Steps: 1 (Register Auth) -> 2 (Verify OTP) -> 3 (eKYC) -> 4 (Success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Global Flow State
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State (Step 2)
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // eKYC State (Step 3)
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  // Final Account State (Step 4)
  const [newAccountNumber] = useState('9333' + Math.floor(100000 + Math.random() * 900000));

  // UI Status State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password validation checks
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const validCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  // OTP Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, countdown]);

  // Start OTP Timer
  const startOtpTimer = () => {
    setCountdown(60);
    setIsTimerActive(true);
  };

  // STEP 1: Submit Register Auth API
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !phone || !password || !confirmPassword) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.register({
        email: email.trim(),
        phoneNumber: phone.trim(),
        password: password,
        confirmPassword: confirmPassword,
      });

      if (res && res.success) {
        setUserId(res.data?.userId || '');
        setSuccessMessage('Đăng ký tài khoản thành công! Mã OTP đã được gửi đến Gmail.');
        startOtpTimer();
        setCurrentStep(2);
      } else {
        setErrorMessage(res?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err: any) {
      const errorText = err.response?.data?.detail || err.response?.data?.message || err.message || 'Không thể kết nối đến máy chủ API.';
      setErrorMessage(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Submit Verify OTP API
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Vui lòng nhập đầy đủ mã OTP.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.verifyOtp({
        email: email.trim(),
        code: otpCode.trim(),
        purpose: 'EMAIL_VERIFICATION',
      });

      if (res && res.success) {
        setSuccessMessage('Xác thực Email OTP thành công!');
        setCurrentStep(3);
      } else {
        setErrorMessage(res?.message || 'Mã OTP không chính xác hoặc đã hết hạn.');
      }
    } catch (err: any) {
      const errorText = err.response?.data?.detail || err.response?.data?.message || err.message || 'Mã OTP không chính xác hoặc đã hết hạn.';
      setErrorMessage(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Resend OTP API
  const handleResendOtp = async () => {
    if (isTimerActive) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authApi.sendOtp({
        email: email.trim(),
        purpose: 'EMAIL_VERIFICATION',
      });

      if (res && res.success) {
        setSuccessMessage('Đã gửi lại mã OTP mới đến Gmail của bạn.');
        startOtpTimer();
      } else {
        setErrorMessage(res?.message || 'Gửi lại mã OTP thất bại.');
      }
    } catch (err: any) {
      const errorText = err.response?.data?.detail || err.response?.data?.message || err.message || 'Gửi lại mã OTP thất bại.';
      setErrorMessage(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 3: Complete eKYC
  const handleEkycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !idNumber.trim() || !dob || !address.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Số CCCD, Ngày sinh và Địa chỉ thường trú.');
      return;
    }
    if (!frontUploaded || !backUploaded || !selfieUploaded) {
      setErrorMessage('Vui lòng tải lên đủ 3 ảnh: Mặt trước CCCD, Mặt sau CCCD và Ảnh chân dung.');
      return;
    }
    setErrorMessage(null);
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0D1527] text-slate-100 flex flex-col font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Header */}
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

      {/* Main Body */}
      <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-6 my-2">

        {/* Step Progress Bar */}
        <div className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>
              Bước: <span className="text-[#A3E635] font-extrabold">{currentStep}/4</span> - {' '}
              {currentStep === 1 && 'Đăng ký tài khoản'}
              {currentStep === 2 && 'Xác thực Email OTP'}
              {currentStep === 3 && 'Định danh eKYC'}
              {currentStep === 4 && 'Hoàn tất mở tài khoản'}
            </span>
            <span className="text-emerald-400 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Ngân Hàng Số
            </span>
          </div>

          <div className="h-2 w-full bg-[#1A253D] rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-[#A3E635] to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="w-full bg-rose-950/80 border border-rose-600/60 p-4 rounded-2xl flex items-start gap-3 text-rose-200 text-xs shadow-lg animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="w-full bg-emerald-950/80 border border-emerald-600/60 p-4 rounded-2xl flex items-start gap-3 text-emerald-200 text-xs shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* STEP 1: REGISTRATION FORM */}
        {currentStep === 1 && (
          <form onSubmit={handleRegisterSubmit} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <h2 className="text-2xl font-black text-white">Mở Tài Khoản Mới</h2>
              <p className="text-xs text-slate-400">Tạo tài khoản truy cập Ngân hàng số bảo mật</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Địa chỉ Email (Nhận mã OTP)</label>
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

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Số điện thoại</label>
                <div className="relative">
                  <Input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-2xl h-13 text-sm pl-11"
                  />
                  <Phone className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Mật khẩu</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono rounded-2xl h-13 text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-4 text-slate-400 hover:text-white"
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
              </div>

              {/* Password checklist */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Tối thiểu 6 ký tự</span>
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 h-14 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang xử lý đăng ký...</span>
                </>
              ) : (
                <>
                  <span>Tiếp Tục Nhận Mã OTP</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP FORM */}
        {currentStep === 2 && (
          <form onSubmit={handleVerifyOtpSubmit} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] mx-auto shadow-md">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white">Xác Thực Mã OTP</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Mã xác thực OTP đã được gửi tới email <span className="text-[#A3E635] font-bold">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-semibold block text-center">Nhập mã OTP 6 chữ số</label>
                <Input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono font-black text-center text-2xl tracking-[0.5em] rounded-2xl h-16"
                />
              </div>

              <div className="flex items-center justify-between text-xs px-2">
                <span className="text-slate-400">
                  {isTimerActive ? (
                    <span>Mã hiệu lực trong: <strong className="text-[#A3E635] font-mono">{countdown}s</strong></span>
                  ) : (
                    <span className="text-amber-400">Mã OTP đã hết hiệu lực</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isTimerActive || isLoading}
                  className="text-[#A3E635] hover:underline font-bold disabled:text-slate-600 disabled:no-underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Gửi lại mã OTP</span>
                </button>
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
                disabled={isLoading}
                className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Xác Nhận OTP'}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: eKYC IDENTITY FORM */}
        {currentStep === 3 && (
          <form onSubmit={handleEkycSubmit} className="w-full bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-slate-800 pb-3 space-y-1">
              <h2 className="text-2xl font-black text-white">Định Danh eKYC Trực Tuyến</h2>
              <p className="text-xs text-slate-400">Xác minh giấy tờ tùy thân CCCD / CMND và ảnh chụp khuôn mặt chính chủ</p>
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
                  <label className="text-xs text-slate-400 font-semibold">Số CCCD / CMND (12 chữ số)</label>
                  <div className="relative">
                    <Input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="001200012345"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white font-mono font-bold rounded-2xl h-13 text-sm pl-11"
                    />
                    <CreditCard className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Ngày sinh</label>
                  <div className="relative">
                    <Input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white rounded-2xl h-13 text-sm pl-11"
                    />
                    <Calendar className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Input Address */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-semibold">Địa chỉ thường trú / Nơi ở hiện tại</label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    placeholder="Số 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-white rounded-2xl h-13 text-sm pl-11"
                  />
                  <MapPin className="w-4 h-4 absolute left-4 top-4 text-slate-400" />
                </div>
              </div>

              {/* Upload ID Card & Selfie Photo Cards (3 items) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs text-slate-400 font-semibold">Giấy tờ định danh & Ảnh chân dung</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mặt trước */}
                  <div
                    onClick={() => setFrontUploaded(!frontUploaded)}
                    className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${frontUploaded
                      ? 'border-[#A3E635] bg-emerald-950/40 text-[#A3E635]'
                      : 'border-slate-700 bg-[#1A253D] text-slate-400 hover:border-slate-500'
                      }`}
                  >
                    {frontUploaded ? <CheckCircle2 className="w-7 h-7 text-[#A3E635]" /> : <Upload className="w-7 h-7" />}
                    <span className="text-xs font-bold text-white">Mặt trước CCCD</span>
                    <span className="text-[10px] text-slate-400">{frontUploaded ? 'Đã tải lên ✓' : 'Nhấp để tải ảnh'}</span>
                  </div>

                  {/* Mặt sau */}
                  <div
                    onClick={() => setBackUploaded(!backUploaded)}
                    className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${backUploaded
                      ? 'border-[#A3E635] bg-emerald-950/40 text-[#A3E635]'
                      : 'border-slate-700 bg-[#1A253D] text-slate-400 hover:border-slate-500'
                      }`}
                  >
                    {backUploaded ? <CheckCircle2 className="w-7 h-7 text-[#A3E635]" /> : <Upload className="w-7 h-7" />}
                    <span className="text-xs font-bold text-white">Mặt sau CCCD</span>
                    <span className="text-[10px] text-slate-400">{backUploaded ? 'Đã tải lên ✓' : 'Nhấp để tải ảnh'}</span>
                  </div>

                  {/* Ảnh selfie */}
                  <div
                    onClick={() => setSelfieUploaded(!selfieUploaded)}
                    className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${selfieUploaded
                      ? 'border-[#A3E635] bg-emerald-950/40 text-[#A3E635]'
                      : 'border-slate-700 bg-[#1A253D] text-slate-400 hover:border-slate-500'
                      }`}
                  >
                    {selfieUploaded ? <CheckCircle2 className="w-7 h-7 text-[#A3E635]" /> : <Camera className="w-7 h-7" />}
                    <span className="text-xs font-bold text-white">Ảnh chân dung</span>
                    <span className="text-[10px] text-slate-400">{selfieUploaded ? 'Đã tải lên ✓' : 'Chụp/Tải selfie'}</span>
                  </div>
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
                Hoàn Tất Định Danh
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {currentStep === 4 && (
          <div className="w-full bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] mx-auto shadow-xl shadow-emerald-500/20">
              <FileCheck className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 font-semibold px-3.5 py-1 rounded-full text-xs">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Mở tài khoản thành công
              </Badge>
              <h2 className="text-2xl font-black text-white">Tài Khoản Số Chọn Đã Kích Hoạt</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Chào mừng <span className="font-bold text-white">{fullName || 'Khách hàng'}</span> gia nhập ngân hàng số Digital Bank!
              </p>
            </div>

            <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-3 text-sm text-left max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs">Số tài khoản thanh toán:</span>
                <span className="font-mono font-black text-[#A3E635] text-lg">{newAccountNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-slate-400">Email đăng ký:</span>
                <span className="font-medium text-white">{email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-slate-400">Địa chỉ thường trú:</span>
                <span className="font-medium text-white">{address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="text-slate-400">Xác thực OTP Gmail:</span>
                <span className="text-[#A3E635] font-bold">Đã xác thực ✓</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Trạng thái eKYC:</span>
                <span className="text-[#A3E635] font-bold">Hoàn tất định danh ✓</span>
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
