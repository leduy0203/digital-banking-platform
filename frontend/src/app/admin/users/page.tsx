"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/employees");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px] text-slate-400 text-xs">
      Đang chuyển hướng sang trang Quản lý Nhân viên...
    </div>
  );
}
