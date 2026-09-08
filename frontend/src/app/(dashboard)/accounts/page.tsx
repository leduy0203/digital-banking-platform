'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard, 
  Wallet, 
  Copy, 
  Eye, 
  EyeOff, 
  History, 
  Lock, 
  Unlock, 
  ArrowRightLeft,
  Wifi,
  Sparkles,
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CustomerTopbar } from "@/components/layout/CustomerTopbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { customerApi, CustomerProfile } from "@/lib/api/customerApi";
import { accountApi, AccountResponseData } from "@/lib/api/accountApi";

// Static Cards Demo Data
const CARDS_DATA = [
  {
    id: "card-1",
    cardNumber: "4129 •••• •••• 8899",
    holderName: "LE CONG DUY",
    expiry: "08/29",
    type: "VISA_PLATINUM",
    brand: "Visa Platinum Signature",
    isLocked: false,
    color: "from-[#0F2027] via-[#203A43] to-[#2C5364]",
    accent: "#A3E635",
  },
  {
    id: "card-2",
    cardNumber: "9704 •••• •••• 3314",
    holderName: "LE CONG DUY",
    expiry: "12/28",
    type: "NAPAS_DEBIT",
    brand: "Napas Domestic Debit",
    isLocked: false,
    color: "from-[#11998e] via-[#38ef7d] to-[#0575E6]",
    accent: "#ffffff",
  },
];

export default function AccountsPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [accounts, setAccounts] = useState<AccountResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [cardsState, setCardsState] = useState(CARDS_DATA);
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'CARDS'>('ACCOUNTS');

  useEffect(() => {
    // 1. Fetch profile for holder name & info
    customerApi.getMyProfile()
      .then((res) => {
        if (res?.success && res.data) {
          setProfile(res.data);
          if (res.data.fullName) {
            setCardsState(prev => prev.map(c => ({ ...c, holderName: res.data.fullName })));
          }
        }
      })
      .catch(() => {});

    // 2. Fetch real accounts list via /api/v1/accounts/my-accounts
    accountApi.getMyAccounts()
      .then((res) => {
        if (res?.success && res.data) {
          setAccounts(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const toggleLockCard = (cardId: string) => {
    setCardsState(prev => prev.map(c => c.id === cardId ? { ...c, isLocked: !c.isLocked } : c));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.availableBalance ?? acc.balance ?? 0), 0);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Fixed Sticky Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport Column (Fixed Header + Scrollable Body) */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Dynamic Connected Topbar */}
        <CustomerTopbar />

        {/* Scrollable Main Body */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Quản lý tài khoản & Thẻ</span>
          </div>

          {/* Page Title & Eye Toggle Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Quản lý tài khoản & Thẻ</h1>
              <p className="text-xs text-slate-400 mt-1">Danh sách tài khoản thanh toán, tiết kiệm và quản lý thẻ trực tuyến</p>
            </div>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="self-start md:self-auto bg-[#141C2E] hover:bg-[#1A253D] border border-slate-700/80 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {showBalance ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-400" />
                  <span>Ẩn tất cả số dư</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Hiển thị số dư</span>
                </>
              )}
            </button>
          </div>

          {/* Top 3 Summary Stat Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Tổng tài sản khả dụng</span>
                <div className="font-mono font-black text-2xl text-[#A3E635]">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#A3E635]" />
                  ) : showBalance ? (
                    `${totalBalance.toLocaleString('vi-VN')} VND`
                  ) : (
                    '•••••••• VND'
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Số tài khoản đang có</span>
                <div className="font-extrabold text-xl text-white">
                  {accounts.length} <span className="text-xs text-slate-400 font-normal">tài khoản hoạt động</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Thẻ đang hoạt động</span>
                <div className="font-extrabold text-xl text-white">
                  2 <span className="text-xs text-emerald-400 font-medium">(Visa & Napas active)</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex gap-2">
              {[
                { id: 'ACCOUNTS', label: 'Tài khoản của tôi', icon: Wallet },
                { id: 'CARDS', label: 'Danh sách Thẻ 3D', icon: CreditCard },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#A3E635] text-slate-950 shadow-lg shadow-[#A3E635]/20' 
                        : 'bg-[#141C2E] text-slate-300 hover:bg-[#1A253D] hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <Link href="/transactions">
              <Button variant="outline" className="border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 text-xs font-bold rounded-full flex items-center gap-2">
                <History className="w-4 h-4 text-[#A3E635]" />
                <span>Xem Lịch Sử Giao Dịch & Sao Kê &gt;</span>
              </Button>
            </Link>
          </div>

          {/* TAB 1: ACCOUNTS SECTION */}
          {activeTab === 'ACCOUNTS' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-12 flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-[#A3E635]" />
                  <span className="text-sm text-slate-300">Đang tải danh sách tài khoản...</span>
                </div>
              ) : accounts.length === 0 ? (
                <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-sm text-slate-300">Chưa có tài khoản thanh toán nào.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {accounts.map((acc, idx) => (
                    <div 
                      key={acc.id}
                      className="bg-[#141C2E] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-5 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">
                            {acc.accountType === 'CHECKING' ? 'Tài khoản thanh toán' : 'Tài khoản tiết kiệm'} ({acc.currency})
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono font-black text-white text-lg">{acc.accountNumber}</span>
                            <button
                              onClick={() => copyToClipboard(acc.accountNumber)}
                              className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                              title="Sao chép số tài khoản"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedAccount === acc.accountNumber && (
                              <span className="text-[10px] text-emerald-400 font-semibold animate-in fade-in">Đã chép!</span>
                            )}
                          </div>
                        </div>

                        <Badge 
                          variant="outline" 
                          className={acc.status === 'ACTIVE' 
                            ? "border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px] px-3 py-1 rounded-full"
                            : "border-red-800 text-red-400 bg-red-950/60 text-[10px] px-3 py-1 rounded-full"
                          }
                        >
                          {acc.status}
                        </Badge>
                      </div>

                      {/* Balance Container */}
                      <div className="bg-gradient-to-r from-[#1A253D] via-[#162238] to-[#1A253D] border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Số dư khả dụng:</span>
                          <div className="font-mono font-black text-2xl text-[#A3E635] mt-1">
                            {showBalance 
                              ? `${(acc.availableBalance ?? acc.balance ?? 0).toLocaleString('vi-VN')} ${acc.currency}` 
                              : '•••••••• VND'}
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#0D1527] flex items-center justify-center text-emerald-400 border border-slate-700">
                          <Wallet className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Account Quick Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Link href="/transfers" className="w-full">
                          <Button className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Chuyển tiền</span>
                          </Button>
                        </Link>
                        <Link href="/transactions" className="w-full">
                          <Button 
                            variant="outline"
                            className="w-full border-slate-700 bg-[#1A253D] hover:bg-[#253554] text-slate-200 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <History className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Tra cứu biến động</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CARDS SHOWCASE SECTION */}
          {activeTab === 'CARDS' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {cardsState.map((card) => (
                  <div key={card.id} className="space-y-4">
                    {/* Metallic 3D Banking Card Showcase */}
                    <div className={`relative w-full h-56 rounded-3xl p-6 bg-gradient-to-tr ${card.color} border border-slate-600/50 shadow-2xl flex flex-col justify-between overflow-hidden group`}>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="flex items-center justify-between z-10">
                        <span className="font-extrabold text-white text-base tracking-wider">{card.brand}</span>
                        <Wifi className="w-6 h-6 text-white/80 rotate-90" />
                      </div>

                      <div className="w-11 h-8 bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-200 rounded-md border border-amber-600/60 shadow-sm z-10 my-2"></div>

                      <div className="z-10 space-y-2">
                        <div className="font-mono text-xl tracking-widest text-white font-bold drop-shadow-md">
                          {card.cardNumber}
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/90 font-mono font-semibold uppercase">
                          <span>{card.holderName}</span>
                          <span>EXP: {card.expiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#141C2E] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={card.isLocked 
                          ? "border-red-800 text-red-400 bg-red-950/60" 
                          : "border-emerald-800 text-emerald-400 bg-emerald-950/60"
                        }
                      >
                        {card.isLocked ? "Đã khóa thẻ 🔒" : "Đang hoạt động ✓"}
                      </Badge>

                      <button
                        onClick={() => toggleLockCard(card.id)}
                        className="text-xs font-bold text-slate-200 hover:text-white bg-[#1A253D] hover:bg-[#253554] px-4 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {card.isLocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mở khóa thẻ</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Khóa thẻ tạm thời</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
