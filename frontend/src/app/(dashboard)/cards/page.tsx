'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { INITIAL_CARDS, MOCK_CARD_TRANSACTIONS } from '@/lib/mock/cardsData';
import { BankCard, CardType } from '@/lib/types/cards';
import {
  CreditCard,
  Lock,
  Unlock,
  ShieldCheck,
  Globe,
  ShoppingCart,
  Eye,
  EyeOff,
  Sliders,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  KeyRound,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function CardsPage() {
  const [cards, setCards] = useState<BankCard[]>(INITIAL_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>('CARD-001');
  const [showSensitiveDetails, setShowSensitiveDetails] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<{ newPin: string; confirmPin: string }>({ newPin: '', confirmPin: '' });
  const [notification, setNotification] = useState<string | null>(null);

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleLockCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const newStatus = c.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
          showToast(newStatus === 'LOCKED' ? `Đã khóa thẻ ${c.cardNumber} thành công!` : `Đã mở khóa thẻ ${c.cardNumber}!`);
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  const handleToggleOnlinePayment = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const updated = !c.isOnlinePaymentEnabled;
          showToast(updated ? 'Đã BẬT thanh toán trực tuyến (E-Commerce).' : 'Đã TẮT thanh toán trực tuyến.');
          return { ...c, isOnlinePaymentEnabled: updated };
        }
        return c;
      })
    );
  };

  const handleToggleInternational = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const updated = !c.isInternationalPaymentEnabled;
          showToast(updated ? 'Đã BẬT thanh toán quốc tế.' : 'Đã TẮT thanh toán quốc tế.');
          return { ...c, isInternationalPaymentEnabled: updated };
        }
        return c;
      })
    );
  };

  const handleUpdateLimit = (cardId: string, limitType: 'online' | 'atm' | 'pos', newValue: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          if (limitType === 'online') return { ...c, dailyOnlineLimit: newValue };
          if (limitType === 'atm') return { ...c, dailyAtmLimit: newValue };
          if (limitType === 'pos') return { ...c, dailyPosLimit: newValue };
        }
        return c;
      })
    );
    showToast('Đã lưu cài đặt hạn mức giao dịch mới.');
  };

  const handleCreateVirtualCard = () => {
    const newCard: BankCard = {
      id: `CARD-00${cards.length + 1}`,
      cardNumber: `4888 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      cardHolderName: 'NGUYEN VAN A',
      expiryDate: '08/30',
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      cardType: 'VIRTUAL',
      network: 'VISA',
      status: 'ACTIVE',
      linkedAccountId: 'ACC-1001',
      accountNumber: '1029384756',
      availableBalance: 125400000,
      isOnlinePaymentEnabled: true,
      isInternationalPaymentEnabled: true,
      dailyOnlineLimit: 15000000,
      dailyAtmLimit: 0,
      dailyPosLimit: 15000000,
      colorScheme: 'blue',
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [...prev, newCard]);
    setSelectedCardId(newCard.id);
    setIsNewCardModalOpen(false);
    showToast('Chúc mừng! Thẻ ảo phi vật lý Visa Virtual đã được phát hành thành công.');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.newPin.length !== 6 || !/^\d+$/.test(pinInput.newPin)) {
      alert('Mã PIN phải bao gồm đúng 6 chữ số!');
      return;
    }
    if (pinInput.newPin !== pinInput.confirmPin) {
      alert('Mã PIN xác nhận không trùng khớp!');
      return;
    }
    setIsPinModalOpen(false);
    setPinInput({ newPin: '', confirmPin: '' });
    showToast(`Đã đổi mã PIN cho thẻ ${activeCard.cardNumber} thành công.`);
  };

  const cardTransactions = MOCK_CARD_TRANSACTIONS.filter((t) => t.cardId === activeCard.id);

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
        {/* Toast Notification Banner */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-sm font-semibold rounded-xl shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Quản lý Thẻ ngân hàng
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Quản lý danh sách thẻ ghi nợ, thẻ tín dụng, phát hành thẻ ảo & khóa thẻ tức thì.
            </p>
          </div>

          <button
            onClick={() => setIsNewCardModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-[#A3E635] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mở Thẻ Ảo Phi Vật Lý</span>
          </button>
        </div>

        {/* Card Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {cards.map((card) => {
            const isSelected = card.id === selectedCardId;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#1C2841] border-[#A3E635] text-white shadow-md'
                    : 'bg-[#121A2D] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    card.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                />
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{card.cardType === 'DEBIT' ? 'Thẻ Ghi Nợ' : card.cardType === 'CREDIT' ? 'Thẻ Tín Dụng' : 'Thẻ Ảo Virtual'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 uppercase font-mono">
                      {card.network}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">{card.cardNumber}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Card Visual + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: 3D Credit Card Visual & Quick Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Bank Card */}
            <div
              className={`relative h-56 md:h-64 rounded-3xl p-6 flex flex-col justify-between shadow-2xl border transition-all overflow-hidden ${
                activeCard.colorScheme === 'emerald'
                  ? 'bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 border-emerald-500/40 text-emerald-100'
                  : activeCard.colorScheme === 'dark'
                  ? 'bg-gradient-to-tr from-slate-950 via-zinc-900 to-slate-800 border-slate-700 text-slate-100'
                  : activeCard.colorScheme === 'purple'
                  ? 'bg-gradient-to-tr from-purple-950 via-indigo-950 to-slate-900 border-purple-500/40 text-purple-100'
                  : 'bg-gradient-to-tr from-blue-950 via-cyan-900 to-slate-900 border-blue-500/40 text-blue-100'
              }`}
            >
              {/* Card Watermark pattern overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Status Lock Overlay if locked */}
              {activeCard.status === 'LOCKED' && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
                  <Lock className="w-10 h-10 text-rose-500 animate-pulse" />
                  <span className="font-bold text-rose-400 text-sm">THẺ ĐÃ BỊ KHÓA TẠM THỜI</span>
                </div>
              )}

              {/* Top Row: Brand Logo & Network */}
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#A3E635] text-slate-950 flex items-center justify-center font-extrabold text-xs">
                    DB
                  </div>
                  <span className="font-bold tracking-tight text-sm text-white">Digital Bank</span>
                </div>
                <div className="font-black italic text-lg tracking-wider text-amber-400">
                  {activeCard.network}
                </div>
              </div>

              {/* Middle Row: EMV Chip & Contactless Icon */}
              <div className="flex items-center gap-4 z-10 my-2">
                {/* 3D EMV Chip visual */}
                <div className="w-11 h-8 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 rounded-md border border-amber-200/50 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 border border-amber-700/40 rounded-sm" />
                </div>
                {/* Contactless waves icon */}
                <Zap className="w-5 h-5 text-slate-400 rotate-90 opacity-80" />
              </div>

              {/* Bottom Row: Card Number, Cardholder, Expiry */}
              <div className="space-y-3 z-10">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Số thẻ</div>
                  <div className="text-xl md:text-2xl font-mono font-bold tracking-widest text-white flex items-center gap-3">
                    <span>
                      {showSensitiveDetails
                        ? activeCard.cardNumber
                        : `${activeCard.cardNumber.slice(0, 4)} **** **** ${activeCard.cardNumber.slice(-4)}`}
                    </span>
                    <button
                      onClick={() => setShowSensitiveDetails(!showSensitiveDetails)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title={showSensitiveDetails ? 'Ẩn thông tin' : 'Hiển thị đầy đủ'}
                    >
                      {showSensitiveDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Chủ thẻ</div>
                    <div className="font-bold text-white uppercase">{activeCard.cardHolderName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Hết hạn</div>
                    <div className="font-bold text-white">{activeCard.expiryDate}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">CVV</div>
                    <div className="font-bold text-amber-300">
                      {showSensitiveDetails ? activeCard.cvv : '***'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button Bar */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleToggleLockCard(activeCard.id)}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border font-bold text-sm transition-all shadow-md ${
                  activeCard.status === 'ACTIVE'
                    ? 'bg-rose-950/40 border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
                    : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/60'
                }`}
              >
                {activeCard.status === 'ACTIVE' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Khóa Thẻ Tạm Thời</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Mở Khóa Thẻ</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsPinModalOpen(true)}
                className="flex items-center justify-center gap-2.5 p-3.5 bg-[#141C2E] border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm rounded-2xl transition-all shadow-md"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Đổi Mã PIN Thẻ</span>
              </button>
            </div>
          </div>

          {/* Right Column: Settings & Limits & Recent Transactions (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card Info & Balance Summary Card */}
            <div className="p-6 rounded-2xl bg-[#121A2D] border border-slate-800/80 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Thông tin & Hạn mức thanh toán</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Tài khoản liên kết</span>
                  <span className="font-mono font-bold text-slate-200">{activeCard.accountNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Số dư khả dụng</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {activeCard.availableBalance.toLocaleString('vi-VN')} VND
                  </span>
                </div>
                {activeCard.cardType === 'CREDIT' && (
                  <div>
                    <span className="text-xs text-slate-400 block">Hạn mức tín dụng</span>
                    <span className="font-mono font-bold text-amber-400">
                      {activeCard.creditLimit?.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                )}
              </div>

              {/* Toggles for Features */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A253D] border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Thanh toán trực tuyến (E-Commerce)</div>
                      <div className="text-xs text-slate-400">Mua sắm Shopee, Tiki, Lazada & website thương mại điện tử</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.isOnlinePaymentEnabled}
                    onChange={() => handleToggleOnlinePayment(activeCard.id)}
                    className="w-5 h-5 accent-[#A3E635] cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A253D] border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Thanh toán quốc tế</div>
                      <div className="text-xs text-slate-400">Giao dịch ngoại tệ, quẹt POS & rút tiền ATM tại nước ngoài</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.isInternationalPaymentEnabled}
                    onChange={() => handleToggleInternational(activeCard.id)}
                    className="w-5 h-5 accent-[#A3E635] cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Limit Adjustment Controls */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Cấu hình Hạn Mức Giao Dịch Hàng Ngày</span>
                </div>

                {/* Online limit slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Hạn mức Online / ngày:</span>
                    <span className="font-mono text-[#A3E635] font-bold">
                      {activeCard.dailyOnlineLimit.toLocaleString('vi-VN')} VND
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000000"
                    max="100000000"
                    step="5000000"
                    value={activeCard.dailyOnlineLimit}
                    onChange={(e) => handleUpdateLimit(activeCard.id, 'online', Number(e.target.value))}
                    className="w-full accent-[#A3E635] bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Recent Card Transactions List */}
            <div className="p-6 rounded-2xl bg-[#121A2D] border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">Giao dịch bằng thẻ gần đây</h3>
                <Link href="/transactions" className="text-xs text-[#A3E635] font-semibold hover:underline flex items-center gap-1">
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {cardTransactions.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">Chưa có giao dịch thẻ nào phát sinh.</div>
              ) : (
                <div className="space-y-3">
                  {cardTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#182238] border border-slate-800/60 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{tx.merchantName}</div>
                          <div className="text-xs text-slate-400">
                            {tx.merchantCategory} • {new Date(tx.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-rose-400">
                          -{tx.amount.toLocaleString('vi-VN')} {tx.currency}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-semibold">{tx.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Change PIN Modal */}
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#121A2D] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Đổi Mã PIN Thẻ</h3>
                </div>
                <button onClick={() => setIsPinModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Mã PIN 6 số mới</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="******"
                    value={pinInput.newPin}
                    onChange={(e) => setPinInput({ ...pinInput, newPin: e.target.value })}
                    className="w-full bg-[#182238] border border-slate-700 text-center font-mono text-xl tracking-widest rounded-xl p-3 text-white focus:outline-none focus:border-[#A3E635]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Xác nhận mã PIN mới</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="******"
                    value={pinInput.confirmPin}
                    onChange={(e) => setPinInput({ ...pinInput, confirmPin: e.target.value })}
                    className="w-full bg-[#182238] border border-slate-700 text-center font-mono text-xl tracking-widest rounded-xl p-3 text-white focus:outline-none focus:border-[#A3E635]"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#A3E635] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:opacity-90 transition-all"
                  >
                    Cập nhật PIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* New Virtual Card Modal */}
        {isNewCardModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#121A2D] border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Mở Thẻ Ảo Virtual Card (Tức thì)</h3>
                </div>
                <button onClick={() => setIsNewCardModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Miễn phí phát hành & Duy trì thẻ năm đầu tiên</span>
                </div>
                <p>Thẻ ảo phi vật lý Visa Virtual sẽ được kích hoạt ngay lập tức để sử dụng thanh toán Shopee, Grab, Netflix & giao dịch online.</p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Chủ thẻ:</span>
                  <span className="font-bold text-white">NGUYEN VAN A</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Tài khoản liên kết:</span>
                  <span className="font-bold font-mono text-white">1029384756 (VND)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Hạn mức trực tuyến ban đầu:</span>
                  <span className="font-bold font-mono text-[#A3E635]">15,000,000 VND / ngày</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsNewCardModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
                >
                  Đóng
                </button>
                <button
                  onClick={handleCreateVirtualCard}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-[#A3E635] text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition-all"
                >
                  Xác Nhận Phát Hành
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
