import React from "react";
import { EmployeeSidebar } from "@/components/employee/EmployeeSidebar";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";

export const metadata = {
  title: "Digital Bank - Staff Operations Portal",
  description: "Cổng thông tin vận hành dành cho nhân viên ngân hàng",
};

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D1527] text-slate-100 flex font-sans antialiased selection:bg-[#A3E635] selection:text-slate-950">
      {/* Sidebar navigation */}
      <EmployeeSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
