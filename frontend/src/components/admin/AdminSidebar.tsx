"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Users, 
  UserCheck,
  ShieldCheck, 
  FileText, 
  LogOut, 
  Landmark,
  Shield,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    name: "Tổng quan System",
    href: "/admin/dashboard",
    icon: Activity,
  },
  {
    name: "Quản lý Khách hàng",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Quản lý Nhân viên",
    href: "/admin/employees",
    icon: ShieldCheck,
  },
  {
    name: "Phân quyền RBAC",
    href: "/admin/roles",
    icon: UserCheck,
  },
  {
    name: "Vận hành Hệ thống",
    href: "/admin/system",
    icon: Server,
  },
  {
    name: "Audit & Security Logs",
    href: "/admin/audit",
    icon: FileText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0B0F17] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800/80 shadow-2xl z-20 shrink-0 selection:bg-blue-600 selection:text-white">
      {/* Brand Header (h-20 matches Topbar height h-20 for pixel-perfect line alignment) */}
      <div className="h-20 px-6 border-b border-slate-800/80 flex items-center gap-3 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black shadow-sm">
          <Landmark className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-1 font-sans">
            Digital <span className="text-blue-400 font-normal">Admin</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" /> Core Enterprise
          </p>
        </div>
      </div>

      {/* Admin System Environment Badge (Spacious mt-5 mb-4) */}
      <div className="mx-4 mt-5 mb-4 p-4 rounded-2xl bg-[#141C2E] border border-slate-800 text-xs flex items-center gap-3 text-slate-300 shadow-md">
        <Server className="w-5 h-5 text-blue-400 shrink-0" />
        <div className="truncate">
          <p className="font-bold text-white truncate text-xs">Core Engine v2.4.0</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Cluster: HCMC-PRIMARY-01</p>
        </div>
      </div>

      {/* Navigation Links (Spacious padding py-3.5 & gap-3.5) */}
      <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
        <div className="px-4 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Quản trị Hệ thống
        </div>
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-slate-800 text-white font-semibold border-l-4 border-blue-500 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3.5">
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200")} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B0F17]">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141C2E] border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="text-xs">
              <p className="font-bold text-white leading-tight">Phạm Minh Hoàng</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">ROLE_ADMIN</p>
            </div>
          </div>
          <Link 
            href="/login" 
            className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
