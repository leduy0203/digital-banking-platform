'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Power, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Calendar, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  BadgePercent,
  ChevronDown,
  Wallet,
  Loader2,
  RefreshCw,
  ChevronLeft
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { CustomerTopbar } from '@/components/layout/CustomerTopbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TransactionReceiptModal } from '@/components/TransactionReceiptModal';
import { 
  transactionApi, 
  TransactionSummaryData, 
  accountApi, 
  AccountResponseData 
} from '@/lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionSummaryData[]>([]);
  const [userAccounts, setUserAccounts] = useState<AccountResponseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 15;

  // Filter States
  const [txFilterType, setTxFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<string>('ALL');
  const [isAccDropdownOpen, setIsAccDropdownOpen] = useState(false);
  const [txSearchQuery, setTxSearchQuery] = useState('');

  // Receipt Modal State
  const [selectedTxCode, setSelectedTxCode] = useState<string | null>(null);

  // Load User Accounts for Account Filter
  useEffect(() => {
    accountApi.getMyAccounts()
      .then((res) => {
        if (res?.success && res.data) {
          setUserAccounts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Transaction History from Backend
  const fetchTransactions = () => {
    setIsLoading(true);
    transactionApi.getMyHistory({
      page,
      size: pageSize,
      accountNumber: selectedAccountFilter !== 'ALL' ? selectedAccountFilter : undefined,
    })
      .then((res) => {
        if (res?.success && res.data) {
          setTransactions(res.data.content || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalElements(res.data.totalElements || 0);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch transaction history:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, selectedAccountFilter]);

  // Filter and Search in Memory for Tab / Search queries
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Filter by Direction
      if (txFilterType !== 'ALL' && tx.direction !== txFilterType) {
        return false;
      }

      // Filter by Search text
      if (txSearchQuery.trim()) {
        const query = txSearchQuery.toLowerCase();
        const matchCode = tx.transactionCode?.toLowerCase().includes(query);
        const matchName = tx.counterpartName?.toLowerCase().includes(query);
        const matchAcc = tx.counterpartAccountNumber?.toLowerCase().includes(query);
        const matchDesc = tx.description?.toLowerCase().includes(query);
        return matchCode || matchName || matchAcc || matchDesc;
      }

      return true;
    });
  }, [transactions, txFilterType, txSearchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [dateStr: string]: TransactionSummaryData[] } = {};

    filteredTransactions.forEach((tx) => {
      const dateObj = new Date(tx.createdAt);
      const isToday = new Date().toDateString() === dateObj.toDateString();
      const dateLabel = isToday
        ? `Hôm nay, ${dateObj.toLocaleDateString('vi-VN')}`
        : dateObj.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(tx);
    });

    return Object.entries(groups).map(([dateGroup, items]) => ({
      dateGroup,
      items,
    }));
  }, [filteredTransactions]);

  // Calculate stats from loaded transactions
  const totalIncome = useMemo(() => {
    return transactions
      .filter((tx) => tx.direction === 'IN' && tx.status === 'COMPLETED')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((tx) => tx.direction === 'OUT' && tx.status === 'COMPLETED')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  }, [transactions]);

  const netCashflow = totalIncome - totalExpense;

  const currentAccLabel = selectedAccountFilter === 'ALL'
    ? 'Tất cả tài khoản'
    : userAccounts.find((a) => a.accountNumber === selectedAccountFilter)?.accountNumber || selectedAccountFilter;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0D1527] text-slate-100 flex font-sans selection:bg-[#A3E635] selection:text-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Topbar */}
        <CustomerTopbar />

        {/* Scrollable Main Content */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">Lịch sử giao dịch & Biến động số dư</span>
          </div>

          {/* Page Title & Action */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Lịch sử giao dịch & Biến động số dư</h1>
              <p className="text-xs text-slate-400 mt-1">
                Tra cứu chi tiết dòng tiền vào/ra, xem và tải biên lai giao dịch thời gian thực
              </p>
            </div>

            <Button 
              onClick={fetchTransactions}
              variant="outline"
              className="self-start md:self-auto border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 h-11"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới danh sách</span>
            </Button>
          </div>

          {/* Cashflow Summary Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Income */}
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

            {/* Total Expense */}
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

            {/* Net Cashflow */}
            <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Dòng tiền ròng</span>
                <div className={`font-mono font-black text-2xl ${netCashflow >= 0 ? 'text-[#A3E635]' : 'text-amber-400'}`}>
                  {netCashflow >= 0 ? '+' : ''}{netCashflow.toLocaleString('vi-VN')} VND
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[#A3E635]">
                <BadgePercent className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Search & Filter Controls Bar */}
          <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm mã TXN, tên người nhận, STK, nội dung..."
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] text-white rounded-2xl pl-11 h-12 text-xs"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Account Filter Dropdown */}
                <div className="relative min-w-[220px]">
                  <button
                    type="button"
                    onClick={() => setIsAccDropdownOpen(!isAccDropdownOpen)}
                    className={`w-full bg-[#1A253D] border ${
                      isAccDropdownOpen ? 'border-[#A3E635] ring-2 ring-[#A3E635]/30' : 'border-slate-700'
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
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAccountFilter('ALL');
                          setIsAccDropdownOpen(false);
                          setPage(0);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                          selectedAccountFilter === 'ALL' 
                            ? 'bg-[#25324D] text-[#A3E635]' 
                            : 'text-slate-300 hover:bg-[#1D2B47] hover:text-white'
                        }`}
                      >
                        <span>Tất cả tài khoản</span>
                        {selectedAccountFilter === 'ALL' && <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />}
                      </button>

                      {userAccounts.map((acc) => (
                        <button
                          key={acc.accountNumber}
                          type="button"
                          onClick={() => {
                            setSelectedAccountFilter(acc.accountNumber);
                            setIsAccDropdownOpen(false);
                            setPage(0);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                            selectedAccountFilter === acc.accountNumber 
                              ? 'bg-[#25324D] text-[#A3E635]' 
                              : 'text-slate-300 hover:bg-[#1D2B47] hover:text-white'
                          }`}
                        >
                          <span className="truncate">{acc.accountNumber} ({acc.accountType})</span>
                          {selectedAccountFilter === acc.accountNumber && <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direction Chips */}
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
                    onClick={() => setTxFilterType('IN')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      txFilterType === 'IN' ? 'bg-emerald-950 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiền vào (+)
                  </button>
                  <button
                    onClick={() => setTxFilterType('OUT')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      txFilterType === 'OUT' ? 'bg-slate-900 text-slate-200 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiền ra (-)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-6 pb-12">
            {isLoading && (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#A3E635]" />
                <span className="text-xs">Đang tải lịch sử giao dịch...</span>
              </div>
            )}

            {!isLoading && groupedTransactions.length === 0 && (
              <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#1A253D] text-slate-500 mx-auto flex items-center justify-center">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Chưa có giao dịch nào</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Bạn chưa có biến động số dư nào phù hợp với bộ lọc hiện tại. Hãy thực hiện chuyển tiền ngay!
                </p>
                <Link href="/transfers" className="inline-block pt-2">
                  <Button className="bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-full">
                    Chuyển Tiền Ngay
                  </Button>
                </Link>
              </div>
            )}

            {!isLoading && groupedTransactions.map((group) => (
              <div key={group.dateGroup} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{group.dateGroup}</span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {group.items.map((tx) => {
                    const isIncome = tx.direction === 'IN';
                    const counterpartDisplay = tx.counterpartName || tx.counterpartAccountNumber || 'Đối tác giao dịch';

                    return (
                      <div
                        key={tx.id || tx.transactionCode}
                        onClick={() => setSelectedTxCode(tx.transactionCode)}
                        className="bg-[#141C2E] hover:bg-[#1A253D] border border-slate-800 hover:border-[#A3E635]/50 p-5 rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-200 group shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          {/* Direction Icon */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                            isIncome
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 group-hover:scale-105'
                              : 'bg-slate-900 text-slate-300 border border-slate-700 group-hover:scale-105'
                          }`}>
                            {isIncome ? (
                              <ArrowDownLeft className="w-6 h-6" />
                            ) : (
                              <ArrowUpRight className="w-6 h-6" />
                            )}
                          </div>

                          <div>
                            <div className="font-extrabold text-base text-white group-hover:text-[#A3E635] transition-colors">
                              {isIncome ? `Nhận tiền từ ${counterpartDisplay}` : `Chuyển tiền cho ${counterpartDisplay}`}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span className="font-mono text-[11px]">
                                {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span>•</span>
                              <span className="text-slate-300 truncate max-w-[200px] sm:max-w-[300px]">
                                {tx.description || (isIncome ? 'Nhận tiền chuyển khoản' : 'Chuyển tiền')}
                              </span>
                              <span>•</span>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  tx.status === 'COMPLETED'
                                    ? 'border-emerald-800 text-emerald-400 bg-emerald-950/60'
                                    : 'border-amber-800 text-amber-400 bg-amber-950/60'
                                } text-[10px] px-2 py-0.5 rounded-full`}
                              >
                                {tx.status === 'COMPLETED' ? 'Thành công' : tx.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Reference */}
                        <div className="text-right">
                          <div className={`font-mono font-black text-xl ${
                            isIncome ? 'text-emerald-400' : 'text-slate-100'
                          }`}>
                            {isIncome ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} VND
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 font-semibold">{tx.transactionCode}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-medium">
                  Hiển thị trang <span className="text-white font-bold">{page + 1}</span> / {totalPages} (Tổng cộng {totalElements} giao dịch)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0 || isLoading}
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    className="border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 text-xs rounded-xl h-9"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span>Trang trước</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1 || isLoading}
                    onClick={() => setPage((p) => p + 1)}
                    className="border-slate-700 bg-[#141C2E] hover:bg-[#1A253D] text-slate-200 text-xs rounded-xl h-9"
                  >
                    <span>Trang sau</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Transaction Receipt Popover Modal */}
      <TransactionReceiptModal
        isOpen={!!selectedTxCode}
        onClose={() => setSelectedTxCode(null)}
        transactionCode={selectedTxCode}
      />
    </div>
  );
}
