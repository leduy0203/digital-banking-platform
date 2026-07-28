'use client';

import { useState } from 'react';
import { 
  PiggyBank, 
  Sparkles, 
  Calculator, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSavings } from '@/hooks/useSavings';

const TERMS = [
  { months: 1, rate: 4.0 },
  { months: 3, rate: 4.5 },
  { months: 6, rate: 5.5 },
  { months: 12, rate: 5.8 },
  { months: 24, rate: 6.2 },
];

/**
 * Format raw number string into thousands dot format (e.g. 500000 -> 500.000)
 */
function formatNumberWithDots(val: string | number): string {
  if (val === '' || val === null || val === undefined) return '';
  const cleanNum = val.toString().replace(/\D/g, '');
  if (!cleanNum) return '';
  return parseInt(cleanNum, 10).toLocaleString('vi-VN');
}

export function SavingsForm() {
  const { openSavings, isOpenSaving } = useSavings();

  const [formattedAmount, setFormattedAmount] = useState('50.000.000');
  const [selectedTermMonths, setSelectedTermMonths] = useState(12);
  const [isSuccess, setIsSuccess] = useState(false);

  const numericAmount = parseInt(formattedAmount.replace(/\D/g, ''), 10) || 0;
  const currentTermObj = TERMS.find(t => t.months === selectedTermMonths) || TERMS[3];

  // Calculate projected interest: (Amount * Rate / 100) * (Months / 12)
  const projectedInterest = Math.round((numericAmount * (currentTermObj.rate / 100)) * (selectedTermMonths / 12));

  // Compute maturity date
  const today = new Date();
  const maturityDate = new Date(today.setMonth(today.getMonth() + selectedTermMonths)).toLocaleDateString('vi-VN');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setFormattedAmount(formatNumberWithDots(rawVal));
  };

  const handleQuickAmount = (val: number) => {
    setFormattedAmount(formatNumberWithDots(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount < 1000000) return;
    try {
      await openSavings({
        sourceAccountNumber: '9333436513',
        depositAmount: numericAmount,
        termMonths: selectedTermMonths,
        autoRollover: true,
      });
    } catch {
      // Mock completion
    } finally {
      setIsSuccess(true);
    }
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Interest Rate Promo Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#162238] to-[#141C2E] border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border border-emerald-500/50 flex items-center justify-center text-[#A3E635] shadow-lg">
            <PiggyBank className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px] px-3 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 mr-1" /> Lãi suất ưu đãi online
            </Badge>
            <h3 className="text-xl font-extrabold text-white">Tiết Kiệm Tích Lũy Điện Tử</h3>
            <p className="text-xs text-slate-300">Lãi suất lên đến <span className="text-[#A3E635] font-black text-sm">6.2%/năm</span>, nhận lãi đúng hạn an toàn tuyệt đối</p>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-[#141C2E] border border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Mở Sổ Tiết Kiệm Thành Công!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Sổ tiết kiệm điện tử mã <span className="font-mono font-bold text-[#A3E635]">#SAV-{Math.floor(100000 + Math.random() * 900000)}</span> đã được khởi tạo.
            </p>
          </div>

          <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-3 text-sm text-left max-w-md mx-auto">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Số tiền gốc gửi:</span>
              <span className="font-mono font-black text-[#A3E635] text-lg">{numericAmount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Kỳ hạn gửi:</span>
              <span className="font-bold text-white">{selectedTermMonths} Tháng ({currentTermObj.rate}%/năm)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Tiền lãi dự kiến:</span>
              <span className="font-mono font-bold text-emerald-400">+{projectedInterest.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ngày tất toán:</span>
              <span className="font-mono text-slate-200">{maturityDate}</span>
            </div>
          </div>

          <Button
            onClick={() => setIsSuccess(false)}
            className="w-full max-w-md bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3.5 rounded-full shadow-lg shadow-[#A3E635]/20 h-12"
          >
            Mở Thêm Sổ Tiết Kiệm Mới
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <span>Khởi tạo sổ tiết kiệm</span>
            </h3>
            <span className="text-xs text-slate-400">Gửi tối thiểu: 1,000,000 VND</span>
          </div>

          {/* Source Account */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-semibold">Tài khoản trích tiền</label>
            <div className="bg-[#1A253D] border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-white text-sm">9333436513 (Tài khoản mặc định)</span>
                <div className="text-xs text-slate-400 mt-0.5">Số dư khả dụng: <span className="text-emerald-400 font-mono font-bold">125,500,000 VND</span></div>
              </div>
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[10px]">
                Hoạt động
              </Badge>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold">Số tiền gửi tiết kiệm</label>
            <div className="relative">
              <Input
                type="text"
                value={formattedAmount}
                onChange={handleAmountChange}
                className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 text-[#A3E635] font-mono font-black text-2xl pl-4 pr-16 h-14 rounded-2xl"
              />
              <span className="absolute right-4 top-4 font-bold text-slate-400 text-sm">VND</span>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium self-center mr-1">Chọn nhanh:</span>
              {[
                { label: '10.000.000đ', val: 10000000 },
                { label: '50.000.000đ', val: 50000000 },
                { label: '100.000.000đ', val: 100000000 },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleQuickAmount(chip.val)}
                  className="bg-[#1A253D] hover:bg-[#253554] border border-slate-700 text-slate-200 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all hover:border-[#A3E635]"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Term Duration Grid Chips */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-semibold">Chọn kỳ hạn gửi</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {TERMS.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => setSelectedTermMonths(t.months)}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    selectedTermMonths === t.months 
                      ? 'bg-[#25324D] border-[#A3E635] text-white shadow-md' 
                      : 'bg-[#1A253D] border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-extrabold text-sm text-white">{t.months} Tháng</div>
                  <div className="font-mono font-black text-emerald-400 text-xs mt-1">{t.rate}%/năm</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Earnings Projection Card */}
          <div className="bg-gradient-to-r from-[#1A253D] via-[#162238] to-[#1A253D] border border-emerald-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tiền lãi dự kiến nhận được:</span>
              <span className="font-mono font-black text-2xl text-[#A3E635]">
                +{projectedInterest.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2 text-slate-400">
              <span>Ngày tất toán dự kiến:</span>
              <span className="font-mono font-bold text-white">{maturityDate}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isOpenSaving}
            className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 h-14 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isOpenSaving ? 'Đang Khởi Tạo Sổ...' : 'Mở Sổ Tiết Kiệm Ngay'}</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </form>
      )}
    </div>
  );
}
