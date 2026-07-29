import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Digital Bank - System Admin Portal",
  description: "Cổng thông tin quản trị hệ thống ngân hàng",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex font-sans antialiased selection:bg-purple-500 selection:text-white">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
