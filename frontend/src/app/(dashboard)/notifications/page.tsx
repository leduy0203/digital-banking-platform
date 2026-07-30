'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock/notificationsData';
import { NotificationItem, NotificationCategory } from '@/lib/types/notifications';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Gift,
  Server,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'ALL'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu tất cả thông báo là ĐÃ ĐỌC.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Đã xóa thông báo thành công.');
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'ALL') return true;
    return n.category === activeCategory;
  });

  const getCategoryBadge = (category: NotificationCategory, transactionType?: 'CREDIT' | 'DEBIT') => {
    if (category === 'BALANCE') {
      return transactionType === 'CREDIT' ? (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <ArrowDownLeft className="w-5 h-5" />
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      );
    }
    if (category === 'SECURITY') {
      return (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
      );
    }
    if (category === 'PROMOTION') {
      return (
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Gift className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
        <Server className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-sm font-semibold rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 relative">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Trung tâm Thông báo
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Theo dõi biến động số dư tức thì, tin tức bảo mật và thông tin ưu đãi từ Digital Bank.
            </p>
          </div>

          {/* Global Actions */}
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#121A2D] border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all shadow-md"
              >
                <CheckCheck className="w-4 h-4 text-[#A3E635]" />
                <span>Đọc Tất Cả ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          {[
            { key: 'ALL', label: 'Tất cả thông báo' },
            { key: 'BALANCE', label: 'Biến động số dư' },
            { key: 'SECURITY', label: 'Cảnh báo bảo mật' },
            { key: 'PROMOTION', label: 'Chương trình ưu đãi' },
            { key: 'SYSTEM', label: 'Hệ thống' },
          ].map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#A3E635] text-slate-950 shadow-md'
                    : 'bg-[#121A2D] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-[#121A2D] border border-slate-800 rounded-3xl space-y-3">
              <Bell className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-slate-400 text-sm">Không có thông báo nào trong danh mục này.</div>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 shadow-lg ${
                  item.isRead
                    ? 'bg-[#121A2D]/60 border-slate-800/60 text-slate-300'
                    : 'bg-[#162138] border-emerald-500/40 text-white shadow-emerald-500/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Category Badge Icon */}
                  {getCategoryBadge(item.category, item.transactionType)}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        )}
                      </h3>
                      {item.amount && (
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            item.transactionType === 'CREDIT'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {item.transactionType === 'CREDIT' ? '+' : '-'}
                          {item.amount.toLocaleString('vi-VN')} VND
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{item.message}</p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                      </span>
                      {item.referenceId && <span>Ref: {item.referenceId}</span>}
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-[#1A253D] border border-slate-700 text-emerald-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Xem</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(item.id);
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
