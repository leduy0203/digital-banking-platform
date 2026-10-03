'use client';

import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => Promise<void>;
  amount: number;
  targetAccountName?: string;
  targetAccountNumber?: string;
  transactionCode?: string;
  isLoading: boolean;
  errorMessage?: string | null;
  expiresInSeconds?: number;
}

export function PinVerificationModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  targetAccountName,
  targetAccountNumber,
  transactionCode,
  isLoading,
  errorMessage,
  expiresInSeconds = 300,
}: PinVerificationModalProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState<number>(expiresInSeconds);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setPin(['', '', '', '', '', '']);
      setTimeLeft(expiresInSeconds);
      return;
    }

    setTimeLeft(expiresInSeconds);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Auto-focus first digit
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);

    return () => clearInterval(timer);
  }, [isOpen, expiresInSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newPin = [...pin];
    newPin[index] = cleanVal;
    setPin(newPin);

    // Auto move to next input if digit entered
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newPin = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      newPin[i] = pasted[i];
    }
    setPin(newPin);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const fullPin = pin.join('');
  const isPinComplete = fullPin.length === 6;

  const handleSubmit = async () => {
    if (isPinComplete && !isLoading && timeLeft > 0) {
      await onConfirm(fullPin);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141C2E] border-slate-800 text-slate-100 max-w-md rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-2 text-center items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] shadow-lg shadow-emerald-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <DialogTitle className="text-xl text-white font-extrabold">Xác Thực Smart PIN</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Nhập mã PIN giao dịch 6 chữ số để hoàn tất chuyển tiền
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Brief Info */}
        <div className="bg-[#1A253D] p-4 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-slate-400">Số tiền:</span>
            <span className="font-mono font-black text-base text-[#A3E635]">
              {amount.toLocaleString('vi-VN')} VND
            </span>
          </div>
          {targetAccountName && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">Người nhận:</span>
              <span className="font-bold text-white uppercase">{targetAccountName}</span>
            </div>
          )}
          {targetAccountNumber && (
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">STK thụ hưởng:</span>
              <span className="font-mono font-bold text-slate-300">{targetAccountNumber}</span>
            </div>
          )}
          {transactionCode && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Mã giao dịch:</span>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">{transactionCode}</span>
            </div>
          )}
        </div>

        {/* 6 Digit PIN Boxes */}
        <div className="space-y-4 py-1">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Mã Smart PIN (6 số)
            </label>
            <span className={`font-mono text-xs font-semibold ${timeLeft <= 60 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
              Hết hạn sau: {formatTimer(timeLeft)}
            </span>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {pin.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLoading || timeLeft === 0}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-mono font-extrabold bg-[#0D1527] border border-slate-700 rounded-xl text-[#A3E635] focus:outline-none focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] transition-all"
              />
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 border-slate-700 bg-[#1A253D] text-slate-200 font-bold h-12 rounded-full hover:bg-[#253554]"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!isPinComplete || isLoading || timeLeft === 0}
              onClick={handleSubmit}
              className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
