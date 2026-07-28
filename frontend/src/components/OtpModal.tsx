'use client';

import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otpCode: string) => Promise<void>;
  amount: number;
  isLoading: boolean;
}

export function OtpModal({ isOpen, onClose, onVerify, amount, isLoading }: OtpModalProps) {
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(300);

  useEffect(() => {
    if (!isOpen) {
      setOtpCode('');
      setTimeLeft(300);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleConfirm = async () => {
    if (otpCode.length === 6) {
      await onVerify(otpCode);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141C2E] border-slate-800 text-slate-100 max-w-md rounded-3xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl text-white font-extrabold">Xác Thực OTP Giao Dịch Hạn Mức Lớn</DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Giao dịch <span className="font-bold text-[#A3E635]">${amount.toFixed(2)} USD</span> vượt $1,000. Vui lòng nhập mã OTP 6 chữ số vừa gửi đến email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-300">Mã Xác Thực OTP (6 Chữ Số)</label>
              <span className="font-mono text-amber-400 font-semibold">Hạn dùng: {formatTimer(timeLeft)}</span>
            </div>
            <Input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="bg-[#1A253D] border-slate-700 text-center font-mono text-2xl tracking-[0.5em] font-extrabold text-[#A3E635] h-12 rounded-xl"
            />
          </div>

          <Button
            disabled={otpCode.length !== 6 || isLoading || timeLeft === 0}
            onClick={handleConfirm}
            className="w-full bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm h-12 rounded-full transition-all"
          >
            {isLoading ? 'Đang Xác Thực...' : 'Xác Nhận Mã OTP'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
