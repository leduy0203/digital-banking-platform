'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  ChevronRight, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Loader2, 
  CheckCircle2, 
  UploadCloud,
  ArrowRight,
  Shield,
  Building
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CustomerTopbar } from "@/components/layout/CustomerTopbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { customerApi, CustomerProfile } from "@/lib/api/customerApi";
import { mediaApi } from "@/lib/api/mediaApi";

export default function ProfilePage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [editAddress, setEditAddress] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // 1. Read stored user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.email) setEmail(u.email);
        if (u.phoneNumber) setPhone(u.phoneNumber);
      } catch {
        // ignore
      }
    }

    // 2. Fetch profile from API
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await customerApi.getMyProfile();
      if (res?.success && res.data) {
        setProfile(res.data);
        setEditAddress(res.data.address || "");
        setEditAvatarUrl(res.data.avatarUrl || "");
      }
    } catch (err: any) {
      setErrorMsg("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setErrorMsg(null);
    try {
      const uploadRes = await mediaApi.uploadKycImage(file, 'selfie');
      if (uploadRes?.success && uploadRes.data?.url) {
        setEditAvatarUrl(uploadRes.data.url);
        // If not in editing mode, immediately update avatar
        if (!isEditing) {
          const updateRes = await customerApi.updateProfile({ avatarUrl: uploadRes.data.url });
          if (updateRes?.success) {
            setProfile(updateRes.data);
            setSuccessMsg("Cập nhật ảnh đại diện thành công!");
            setTimeout(() => setSuccessMsg(null), 3000);
          }
        }
      } else {
        setErrorMsg("Upload ảnh thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      setErrorMsg("Không thể tải ảnh lên. Dung lượng ảnh tối đa là 10MB.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await customerApi.updateProfile({
        address: editAddress.trim(),
        avatarUrl: editAvatarUrl || undefined
      });

      if (res?.success && res.data) {
        setProfile(res.data);
        setIsEditing(false);
        setSuccessMsg("Cập nhật thông tin cá nhân thành công!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res?.message || "Cập nhật không thành công.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Lỗi khi lưu thông tin.";
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const renderKycBadge = () => {
    if (profile?.kycStatus === 'VERIFIED') {
      return (
        <Badge variant="outline" className="border-emerald-700 text-[#A3E635] bg-emerald-950/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
          <span>Đã xác thực eKYC (Toàn quyền sử dụng)</span>
        </Badge>
      );
    }
    if (profile?.kycStatus === 'REJECTED') {
      return (
        <Badge variant="outline" className="border-red-700 text-red-400 bg-red-950/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>eKYC Bị Từ Chối (Cần tải lại giấy tờ)</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-amber-700 text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-amber-400" />
        <span>Chờ nhân viên thẩm định eKYC</span>
      </Badge>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return 'CD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Topbar */}
        <CustomerTopbar />

        {/* Scrollable Main Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Hồ sơ khách hàng</span>
          </div>

          {/* Page Title & Status */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Hồ sơ cá nhân</h1>
              <p className="text-xs text-slate-400 mt-1">Thông tin định danh điện tử eKYC và hồ sơ tài khoản ngân hàng số</p>
            </div>

            {profile && renderKycBadge()}
          </div>

          {/* Notification Banners */}
          {successMsg && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs p-4 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/80 border border-red-800 text-red-300 text-xs p-4 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLoading ? (
            <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
              <Loader2 className="w-10 h-10 text-[#A3E635] animate-spin" />
              <span className="text-sm font-semibold text-slate-300">Đang tải thông tin hồ sơ...</span>
            </div>
          ) : !profile ? (
            <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Chưa hoàn tất eKYC</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Tài khoản của bạn chưa hoàn tất định danh eKYC. Vui lòng hoàn tất để kích hoạt đầy đủ tính năng ngân hàng.
              </p>
              <Link href="/register?step=3">
                <Button className="bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-bold text-xs px-6 py-2.5 rounded-full">
                  Hoàn tất eKYC ngay
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Avatar & Identity Card */}
              <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col items-center text-center">
                {/* Avatar with Upload button */}
                <div className="relative group">
                  {editAvatarUrl || profile.avatarUrl ? (
                    <img 
                      src={editAvatarUrl || profile.avatarUrl} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#A3E635]/40 shadow-2xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-3xl shadow-2xl border-4 border-slate-700">
                      {getInitials(profile.fullName)}
                    </div>
                  )}

                  {/* Upload Avatar Overlay Button */}
                  <label 
                    className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-[#A3E635]"
                    title="Đổi ảnh đại diện"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#A3E635]" />
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-[#A3E635]" />
                        <span className="text-[10px] font-bold mt-1">Đổi ảnh</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    />
                  </label>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-black text-white tracking-wide">{profile.fullName}</h2>
                  <div className="text-xs font-mono text-[#A3E635] bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full inline-block">
                    Mã CIF: {profile.customerCode}
                  </div>
                </div>

                {/* Status description */}
                <div className="w-full bg-[#1A253D] border border-slate-700/80 rounded-2xl p-4 text-left space-y-2 text-xs">
                  <span className="text-slate-400 font-semibold block">Trạng thái tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A3E635] animate-pulse"></div>
                    <span className="text-white font-bold">Hoạt động bình thường (ACTIVE)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    {profile.kycStatus === 'VERIFIED' ? (
                      <span className="text-[#A3E635]">✓ Tài khoản đã xác thực đầy đủ, không giới hạn giao dịch.</span>
                    ) : (
                      <span className="text-amber-400">⏳ Đang chờ nhân viên hậu kiểm giấy tờ eKYC. Bạn vẫn có thể nhận tiền và xem tài khoản bình thường.</span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="w-full pt-2">
                  <Link href="/accounts" className="w-full block">
                    <Button variant="outline" className="w-full border-slate-700 bg-[#1A253D] hover:bg-[#253554] text-slate-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Xem Tài khoản & Thẻ</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Column 2 & 3: Detailed Information Form */}
              <div className="lg:col-span-2 bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-[#A3E635]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Thông tin chi tiết</h3>
                      <p className="text-xs text-slate-400">Thông tin cá nhân đã được xác minh qua hệ thống eKYC</p>
                    </div>
                  </div>

                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-[#1A253D] hover:bg-[#253554] border border-slate-700 text-slate-200 hover:text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>Chỉnh sửa địa chỉ</span>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-slate-700 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Hủy</span>
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name (Readonly) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Họ và tên (Theo CCCD)</span>
                      </label>
                      <Input 
                        value={profile.fullName} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-slate-300 font-bold rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>

                    {/* National ID / CCCD (Readonly) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-500" />
                        <span>Số CCCD / CMND (12 chữ số)</span>
                      </label>
                      <Input 
                        value={profile.nationalId} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-slate-300 font-mono font-bold rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>

                    {/* Date of Birth (Readonly) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ngày sinh</span>
                      </label>
                      <Input 
                        value={profile.dateOfBirth} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-slate-300 font-mono rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>

                    {/* Default Account Number (Readonly) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tài khoản thanh toán mặc định</span>
                      </label>
                      <Input 
                        value={profile.defaultAccountNumber || "9333xxxxxx"} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-[#A3E635] font-mono font-bold rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Number (Readonly from Auth) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Số điện thoại đăng ký</span>
                      </label>
                      <Input 
                        value={phone || "09xx xxx xxx"} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-slate-300 font-mono rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>

                    {/* Email (Readonly from Auth) */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>Địa chỉ Email</span>
                      </label>
                      <Input 
                        value={email || "user@domain.com"} 
                        readOnly 
                        className="bg-[#1A253D]/50 border-slate-800 text-slate-300 rounded-2xl h-12 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Editable Field: Address */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Địa chỉ thường trú / liên hệ</span>
                      </span>
                      {isEditing && <span className="text-[10px] text-[#A3E635]">Có thể chỉnh sửa</span>}
                    </label>
                    <Input 
                      value={isEditing ? editAddress : profile.address} 
                      onChange={(e) => setEditAddress(e.target.value)}
                      readOnly={!isEditing} 
                      placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className={`h-12 rounded-2xl text-sm transition-all ${
                        isEditing 
                          ? "bg-[#1A253D] border-[#A3E635]/50 focus:border-[#A3E635] text-white" 
                          : "bg-[#1A253D]/50 border-slate-800 text-slate-300 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* Save Button (when editing) */}
                  {isEditing && (
                    <div className="pt-4 flex justify-end gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditAddress(profile.address || "");
                          setIsEditing(false);
                        }}
                        variant="outline"
                        className="border-slate-700 bg-transparent text-slate-300 text-xs px-5 py-2.5 rounded-full"
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-[#A3E635]/20 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang lưu...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Lưu thay đổi</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
