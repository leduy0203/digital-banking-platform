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
import { CustomerTopbar } from "@/components/layout/CustomerTopbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
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
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isMatching = newPassword !== "" && newPassword === confirmPassword;

  const validCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  let strengthLabel = "Rất yếu";
  let strengthColor = "bg-red-500";
  if (validCount >= 4) {
    strengthLabel = "Cực kỳ mạnh 🛡️";
    strengthColor = "bg-[#A3E635]";
  } else if (validCount >= 2) {
    strengthLabel = "Trung bình";
    strengthColor = "bg-amber-400";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }

    if (!hasMinLength) {
      setErrorMessage("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    if (!isMatching) {
      setErrorMessage("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setIsSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column (Fixed Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Dynamic Connected Topbar */}
        <CustomerTopbar />

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

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="flex-1 border-slate-700 bg-[#1A253D] hover:bg-[#253554] text-slate-200 font-bold text-xs rounded-full h-12"
                  >
                    Ở lại trang Cài đặt
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs rounded-full shadow-lg shadow-[#A3E635]/20 h-12">
                      Về Trang Chủ Dashboard &gt;
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
