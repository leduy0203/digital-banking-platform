'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  History, 
  Search, 
  Calendar, 
  Download, 
  Share2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  X, 
  FileSpreadsheet,
  BadgePercent,
  ChevronDown,
  Wallet
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock Timeline Transactions Data
const TIMELINE_TRANSACTIONS = [
  {
    dateGroup: "Hôm nay, 28/07/2026",
    items: [
      {
        id: "tx-1",
        reference: "TXN-984210",
        title: "Nhận tiền từ NGUYEN VAN A",
        senderName: "NGUYEN VAN A",
        senderAccount: "8880987654",
        receiverAccount: "9333436513",
        amount: +15000000,
        type: "INCOME",
        category: "Chuyển tiền vào",
        date: "28/07/2026 14:30:12",
        description: "CHUYEN TIEN LUONG THANG 07/2026",
        status: "SUCCESS"
      },
      {
        id: "tx-2",
        reference: "TXN-874109",
        title: "Chuyển tiền cho TRAN THI B",
        senderName: "LE CONG DUY",
        senderAccount: "9333436513",
        receiverAccount: "9991234567",
        amount: -500000,
        type: "EXPENSE",
        category: "Chuyển tiền đi",
        date: "28/07/2026 09:15:44",
        description: "LE CONG DUY chuyen tien thanh toan hoa don",
        status: "SUCCESS"
      },
    ]
  },
  {
    dateGroup: "Hôm qua, 27/07/2026",
    items: [
      {
        id: "tx-3",
        reference: "TXN-651290",
        title: "Trích tiền tiết kiệm online",
        senderName: "LE CONG DUY",
        senderAccount: "9333436513",
        receiverAccount: "8880987654",
        amount: -2000000,
        type: "EXPENSE",
        category: "Tiết kiệm",
        date: "27/07/2026 18:45:00",
        description: "Gui tiet kiem tich luy dinh ky hang thang",
        status: "SUCCESS"
      },
      {
        id: "tx-4",
        reference: "TXN-412093",
        title: "Thanh toán hóa đơn Tiền Điện EVN",
        senderName: "LE CONG DUY",
        senderAccount: "9333436513",
        receiverAccount: "EVN-HN-001",
        amount: -1250000,
        type: "EXPENSE",
        category: "Thanh toán hóa đơn",
        date: "27/07/2026 11:20:10",
        description: "Thanh toan tien dien EVN ky thang 07/2026",
        status: "SUCCESS"
      },
    ]
  }
];

const ACCOUNT_FILTER_OPTIONS = [
  { code: 'ALL', label: 'Tất cả tài khoản' },
  { code: '9333436513', label: '9333436513 (Thanh toán mặc định)' },
  { code: '8880987654', label: '8880987654 (Tiết kiệm tích lũy)' },
];

export default function TransactionsPage() {
  const [txFilterType, setTxFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<'ALL' | '9333436513' | '8880987654'>('ALL');
  const [isAccDropdownOpen, setIsAccDropdownOpen] = useState(false);
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [selectedTxDetail, setSelectedTxDetail] = useState<any | null>(null);

  // Calculate totals
  const totalIncome = 15000000;
  const totalExpense = 3750000;
  const netCashflow = totalIncome - totalExpense;

  const currentAccLabel = ACCOUNT_FILTER_OPTIONS.find(a => a.code === selectedAccountFilter)?.label || 'Tất cả tài khoản';

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
            <Link href="/settings" className="flex items-center gap-2 hover:text-white transition-colors">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
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
            <span className="text-white font-bold">Lịch sử giao dịch & Biến động số dư</span>
          </div>

          {/* Page Title & Export Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Lịch sử giao dịch & Biến động số dư</h1>
              <p className="text-xs text-slate-400 mt-1">Trung tâm tra cứu dòng tiền, xem chi tiết biên lai và xuất sao kê ngân hàng</p>
            </div>

            <Button className="self-start md:self-auto bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs px-5 py-3 rounded-full shadow-lg shadow-[#A3E635]/20 flex items-center gap-2 h-11 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Sao Kê Tài Khoản (PDF/Excel)</span>
            </Button>
          </div>

          {/* Cashflow Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Tổng thu vào (+)</span>
                <div className="font-mono font-black text-2xl text-emerald-400">
                  +{totalIncome.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Tổng chi ra (-)</span>
                <div className="font-mono font-black text-2xl text-slate-100">
                  -{totalExpense.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Dòng tiền ròng tháng này</span>
                <div className="font-mono font-black text-2xl text-[#A3E635]">
                  +{netCashflow.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[#A3E635]">
                <BadgePercent className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Advanced Search & Filter Controls Bar */}
          <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm mã TXN, tên người nhận, nội dung..."
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  className="bg-[#1A253D] text-white rounded-2xl pl-11 h-12 text-xs"
                />
              </div>

              {/* Filter Controls Row */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* CUSTOM SOFT ROUNDED POPOVER DROPDOWN FOR ACCOUNT FILTER */}
                <div className="relative min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => setIsAccDropdownOpen(!isAccDropdownOpen)}
                    className={`w-full bg-[#1A253D] border ${
                      isAccDropdownOpen ? 'border-[#A3E635] ring-2 ring-[#A3E635]/30 shadow-[0_0_15px_rgba(163,230,53,0.25)]' : 'border-slate-700'
                    } rounded-2xl px-4 py-3 text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">{currentAccLabel}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isAccDropdownOpen ? 'rotate-180 text-[#A3E635]' : ''}`} />
                  </button>

                  {isAccDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#162238] border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-in zoom-in-95 duration-150">
                      {ACCOUNT_FILTER_OPTIONS.map((opt) => (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => {
                            setSelectedAccountFilter(opt.code as any);
                            setIsAccDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                            selectedAccountFilter === opt.code 
                              ? 'bg-[#25324D] text-[#A3E635]' 
                              : 'text-slate-300 hover:bg-[#1D2B47] hover:text-white'
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {selectedAccountFilter === opt.code && <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Type Filter Chips */}
                <div className="flex gap-1 bg-[#1A253D] p-1 rounded-2xl border border-slate-700">
                  <button
                    onClick={() => setTxFilterType('ALL')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      txFilterType === 'ALL' ? 'bg-[#25324D] text-[#A3E635] shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setTxFilterType('INCOME')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      txFilterType === 'INCOME' ? 'bg-emerald-950 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiền vào (+)
                  </button>
                  <button
                    onClick={() => setTxFilterType('EXPENSE')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      txFilterType === 'EXPENSE' ? 'bg-slate-900 text-slate-200 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiền ra (-)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grouped Timeline Transactions List Stream */}
          <div className="space-y-6 pb-12">
            {TIMELINE_TRANSACTIONS.map((group) => {
              const filteredItems = group.items.filter((item) => {
                const matchesType = txFilterType === 'ALL' || item.type === txFilterType;
                const matchesAccount = selectedAccountFilter === 'ALL' || item.senderAccount === selectedAccountFilter || item.receiverAccount === selectedAccountFilter;
                const matchesSearch = 
                  item.title.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                  item.reference.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(txSearchQuery.toLowerCase());
                return matchesType && matchesAccount && matchesSearch;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div key={group.dateGroup} className="space-y-3">
                  {/* Date Group Header */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{group.dateGroup}</span>
                  </div>

                  {/* Transaction Items */}
                  <div className="space-y-2">
                    {filteredItems.map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTxDetail(tx)}
                        className="bg-[#141C2E] hover:bg-[#1A253D] border border-slate-800 hover:border-[#A3E635]/50 p-5 rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          {/* Avatar Icon */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                            tx.type === 'INCOME'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 group-hover:scale-105'
                              : 'bg-slate-900 text-slate-300 border border-slate-700 group-hover:scale-105'
                          }`}>
                            {tx.type === 'INCOME' ? (
                              <ArrowDownLeft className="w-6 h-6" />
                            ) : (
                              <ArrowUpRight className="w-6 h-6" />
                            )}
                          </div>

                          <div>
                            <div className="font-extrabold text-base text-white group-hover:text-[#A3E635] transition-colors">
                              {tx.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span className="font-mono text-[11px]">{tx.date}</span>
                              <span>•</span>
                              <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px] px-2.5 py-0.5 rounded-full">
                                {tx.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Reference Badge */}
                        <div className="text-right">
                          <div className={`font-mono font-black text-xl ${
                            tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-100'
                          }`}>
                            {tx.type === 'INCOME' ? '+' : ''}{tx.amount.toLocaleString('vi-VN')} VND
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 font-semibold">{tx.reference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transaction Detail Digital Receipt Popover Modal */}
          {selectedTxDetail && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-6 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-base text-white">Biên Lai Giao Dịch Điện Tử</h3>
                  </div>
                  <button onClick={() => setSelectedTxDetail(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <span className="text-xs text-slate-400">Số tiền biến động:</span>
                  <div className={`font-mono font-black text-3xl ${selectedTxDetail.type === 'INCOME' ? 'text-[#A3E635]' : 'text-white'}`}>
                    {selectedTxDetail.type === 'INCOME' ? '+' : ''}{selectedTxDetail.amount.toLocaleString('vi-VN')} VND
                  </div>
                  <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px] px-3 py-0.5 mt-1 rounded-full">
                    Giao dịch thành công (Napas 24/7)
                  </Badge>
                </div>

                <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Mã tham chiếu:</span>
                    <span className="font-mono font-bold text-[#A3E635]">{selectedTxDetail.reference}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Thời gian thực hiện:</span>
                    <span className="font-mono text-slate-200">{selectedTxDetail.date}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Tài khoản trích/nhận:</span>
                    <span className="font-mono text-white font-bold">{selectedTxDetail.senderAccount}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Nội dung giao dịch:</span>
                    <span className="text-slate-200 font-medium text-right max-w-[200px]">{selectedTxDetail.description}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button variant="outline" className="flex-1 border-slate-700 bg-[#1A253D] text-slate-200 font-bold text-xs h-11 rounded-full flex items-center justify-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chia Sẻ</span>
                  </Button>
                  <Button className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs h-11 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-[#A3E635]/20">
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Biên Lai (PDF)</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
