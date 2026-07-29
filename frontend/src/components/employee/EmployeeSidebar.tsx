"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  Banknote, 
  History, 
  ShieldCheck, 
  LogOut,
  Building2,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Tổng quan Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Phê duyệt KYC",
    href: "/employee/kyc",
    icon: UserCheck,
    badge: "28",
  },
  {
    name: "Quản lý Khách hàng",
    href: "/employee/customers",
    icon: Users,
  },
  {
    name: "Quản lý Tài khoản",
    href: "/employee/accounts",
    icon: CreditCard,
  },
  {
    name: "Giao dịch tại Quầy",
    href: "/employee/cash-ops",
    icon: Banknote,
  },
  {
    name: "Lịch sử & Rollback",
    href: "/employee/transactions",
    icon: History,
  },
];

export function EmployeeSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shadow-2xl z-20 shrink-0 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Brand Header (h-20 matches Topbar height h-20 for pixel-perfect line alignment) */}
      <div className="h-20 px-6 border-b border-slate-800/80 flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#A3E635]/20">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1.5 font-sans">
            Digital <span className="text-[#A3E635] font-light">Bank</span>
          </h1>
          <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" /> Staff Portal
          </p>
        </div>
      </div>

      {/* Branch Info Badge (Spacious mt-5 mb-4) */}
      <div className="mx-4 mt-5 mb-4 p-4 rounded-2xl bg-[#141C2E] border border-slate-800 text-xs flex items-center gap-3 text-slate-300 shadow-md">
        <Building2 className="w-5 h-5 text-[#A3E635] shrink-0" />
        <div className="truncate">
          <p className="font-bold text-white truncate text-xs">CN Bến Thành - TPHCM</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Quầy: TELLER-04</p>
        </div>
      </div>

      {/* Navigation Links (Spacious padding py-3.5 & gap-3.5) */}
      <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
        <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Chức năng Vận hành
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-[#25324D] text-white shadow-sm font-semibold border-l-4 border-[#A3E635]"
                  : "text-slate-300 hover:bg-[#162035] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-[#A3E635]" : "text-emerald-400")} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2.5 py-0.5 text-[11px] font-extrabold rounded-full",
                  isActive ? "bg-[#A3E635] text-slate-950" : "bg-amber-500 text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Staff Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B1120]">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141C2E] border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#A3E635] text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
              NV
            </div>
            <div className="text-xs">
              <p className="font-bold text-white leading-tight text-xs">Nguyễn Văn An</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Giao dịch viên (Teller)</p>
            </div>
          </div>
          <Link 
            href="/login" 
            className="p-2 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
