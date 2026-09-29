'use client';

import { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { customerApi } from '@/lib/api/customerApi';

interface TransactionPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'SETUP' | 'CHANGE';
  onSuccess?: () => void;
}

export function TransactionPinModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
}: TransactionPinModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (mode === 'CHANGE' && currentPin.length !== 6) {
      setErrorMsg('Vui lòng nhập đầy đủ mã PIN hiện tại (6 chữ số)');
      return;
    }

    if (newPin.length !== 6) {
      setErrorMsg('Mã PIN mới phải bao gồm đúng 6 chữ số');
      return;
    }

    if (newPin !== confirmNewPin) {
      setErrorMsg('Xác nhận mã PIN mới không trùng khớp');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'SETUP') {
        const res = await customerApi.setupPin({
          pin: newPin,
          confirmPin: confirmNewPin,
        });
        setSuccessMsg(res.message || 'Thiết lập mã PIN giao dịch thành công!');
      } else {
        const res = await customerApi.changePin({
          currentPin,
          newPin,
          confirmNewPin,
        });
        setSuccessMsg(res.message || 'Đổi mã PIN giao dịch thành công!');
      }

      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#141C2E] border-slate-800 text-slate-100 max-w-md rounded-3xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[#A3E635] mb-2 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl text-white font-black tracking-tight">
            {mode === 'SETUP' ? 'Thiết Lập Mã PIN Giao Dịch' : 'Đổi Mã PIN Giao Dịch'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            {mode === 'SETUP'
              ? 'Mã PIN gồm 6 số dùng để ký duyệt chuyển tiền & thanh toán an toàn.'
              : 'Nhập mã PIN hiện tại và thiết lập mã PIN 6 số mới.'}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/70 border border-emerald-600/80 text-emerald-300 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#A3E635] shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {mode === 'CHANGE' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Mã PIN hiện tại</label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                className="bg-[#1A253D] border-slate-700 text-center font-mono text-xl tracking-[0.4em] font-extrabold text-white h-11 rounded-xl focus:border-[#A3E635]"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              {mode === 'SETUP' ? 'Nhập mã PIN 6 số' : 'Mã PIN 6 số mới'}
            </label>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              className="bg-[#1A253D] border-slate-700 text-center font-mono text-xl tracking-[0.4em] font-extrabold text-[#A3E635] h-11 rounded-xl focus:border-[#A3E635]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Xác nhận lại mã PIN</label>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={confirmNewPin}
              onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
              className="bg-[#1A253D] border-slate-700 text-center font-mono text-xl tracking-[0.4em] font-extrabold text-[#A3E635] h-11 rounded-xl focus:border-[#A3E635]"
              disabled={isLoading}
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300 text-xs h-11 rounded-full"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading || newPin.length !== 6 || confirmNewPin.length !== 6}
              className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-black text-xs h-11 rounded-full shadow-lg shadow-[#A3E635]/20 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </div>
              ) : mode === 'SETUP' ? (
                'Tạo Mã PIN'
              ) : (
                'Đổi Mã PIN'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
