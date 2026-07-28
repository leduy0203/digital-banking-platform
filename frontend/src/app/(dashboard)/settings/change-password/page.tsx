'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowLeft
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live password criteria validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatching = newPassword !== "" && newPassword === confirmPassword;

  const validCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  let strengthLabel = "Rất yếu";
  let strengthColor = "bg-red-500";
  if (validCount >= 5) {
    strengthLabel = "Cực kỳ mạnh 🛡️";
    strengthColor = "bg-[#A3E635]";
  } else if (validCount >= 3) {
    strengthLabel = "Trung bình";
    strengthColor = "bg-amber-400";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (validCount < 4) {
      setErrorMessage("Mật khẩu mới chưa đạt yêu cầu độ mạnh tối thiểu.");
      return;
    }

    if (!isMatching) {
      setErrorMessage("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
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
            <Link href="/settings" className="flex items-center gap-2 text-white font-bold transition-colors">
              <SettingsIcon className="w-4 h-4 text-[#A3E635]" />
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
            <Link href="/settings" className="hover:text-white transition-colors">Cài đặt</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Đổi mật khẩu đăng nhập</span>
          </div>

          {/* Page Title with Back Link */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Đổi mật khẩu đăng nhập</h1>
              <p className="text-xs text-slate-400 mt-1">Cập nhật mật khẩu định kỳ để bảo vệ an toàn cho tài khoản ngân hàng số</p>
            </div>

            <Link href="/settings">
              <Button variant="outline" className="border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 text-xs font-bold rounded-full flex items-center gap-2">
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>Quay lại Cài đặt</span>
              </Button>
            </Link>
          </div>

          {/* Main Form Container / Success Screen */}
          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <div className="bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Đổi Mật Khẩu Thành Công!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Mật khẩu tài khoản ngân hàng số của bạn đã được thay đổi an toàn. Vui lòng sử dụng mật khẩu mới cho các lần đăng nhập tiếp theo.
                  </p>
                </div>

                <div className="pt-4 flex gap-4">
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3.5 rounded-full shadow-lg shadow-[#A3E635]/20 h-12">
                      Về Trang Chủ Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                {/* Security Requirement Alert Box */}
                <div className="bg-[#1A253D] border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">Quy định mật khẩu an toàn:</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Mật khẩu phải có độ dài từ 8 - 32 ký tự, chứa cả chữ hoa, chữ thường, chữ số và ít nhất 1 ký tự đặc biệt (!@#$%^&*).
                    </p>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-4 rounded-2xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Input 1: Current Password */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono rounded-2xl h-13 text-sm pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Input 2: New Password */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Mật khẩu mới</label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono rounded-2xl h-13 text-sm pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Độ mạnh mật khẩu:</span>
                        <span className="font-bold text-white">{strengthLabel}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${(validCount / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  )}

                  {/* Real-time Validation Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ít nhất 8 ký tự</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Có chữ cái hoa (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Có chữ cái thường (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Có chữ số (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ký tự đặc biệt (!@#$)</span>
                    </div>
                  </div>
                </div>

                {/* Input 3: Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono rounded-2xl h-13 text-sm pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && !isMatching && (
                    <p className="text-xs text-red-400 font-medium pt-1">Mật khẩu xác nhận không khớp</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 transition-all h-14 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-5 h-5" />
                  <span>{isSubmitting ? "Đang Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu"}</span>
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
