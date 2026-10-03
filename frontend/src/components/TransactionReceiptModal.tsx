'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  X, 
  Copy, 
  Share2, 
  Download, 
  Loader2, 
  ArrowDownLeft, 
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { transactionApi, TransactionResponseData } from '@/lib/api';

interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionCode: string | null;
}

export function TransactionReceiptModal({
  isOpen,
  onClose,
  transactionCode,
}: TransactionReceiptModalProps) {
  const [detail, setDetail] = useState<TransactionResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !transactionCode) {
      setDetail(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    transactionApi.getTransactionDetail(transactionCode)
      .then((res) => {
        if (res?.success && res.data) {
          setDetail(res.data);
        } else {
          setError('Không tìm thấy thông tin chi tiết giao dịch.');
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Không thể tải chi tiết biên lai.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, transactionCode]);

  const handleCopy = () => {
    if (!detail) return;
    const text = `BIÊN LAI GIAO DỊCH DIGITAL BANK\n` +
      `Mã GD: ${detail.transactionCode}\n` +
      `Số tiền: ${detail.amount.toLocaleString('vi-VN')} VND\n` +
      `Người nhận: ${detail.targetAccountName || detail.targetAccountNumber}\n` +
      `STK nhận: ${detail.targetAccountNumber}\n` +
      `Nội dung: ${detail.description || ''}\n` +
      `Thời gian: ${detail.completedAt ? new Date(detail.completedAt).toLocaleString('vi-VN') : new Date(detail.createdAt).toLocaleString('vi-VN')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141C2E] border-slate-800 text-slate-100 max-w-md rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <DialogTitle className="text-base text-white font-extrabold">Biên Lai Giao Dịch Điện Tử</DialogTitle>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#A3E635]" />
            <span className="text-xs">Đang tải chi tiết biên lai...</span>
          </div>
        )}

        {error && (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-red-400">
            <AlertCircle className="w-8 h-8" />
            <span className="text-xs text-center">{error}</span>
          </div>
        )}

        {!isLoading && !error && detail && (
          <div className="space-y-5">
            {/* Amount Banner */}
            <div className="text-center space-y-1 pt-1">
              <span className="text-xs text-slate-400">Số tiền giao dịch</span>
              <div className="font-mono font-black text-3xl text-[#A3E635]">
                {detail.amount.toLocaleString('vi-VN')} VND
              </div>
              <div className="flex justify-center pt-1">
                <Badge
                  variant="outline"
                  className={`${
                    detail.status === 'COMPLETED'
                      ? 'border-emerald-800 text-emerald-400 bg-emerald-950/60'
                      : detail.status === 'FAILED'
                      ? 'border-red-800 text-red-400 bg-red-950/60'
                      : 'border-amber-800 text-amber-400 bg-amber-950/60'
                  } text-[10px] px-3 py-0.5 rounded-full`}
                >
                  {detail.status === 'COMPLETED' ? 'Giao dịch thành công' : detail.status}
                </Badge>
              </div>
            </div>

            {/* Receipt Key-Value Details */}
            <div className="bg-[#1A253D] p-5 rounded-2xl border border-slate-700/60 space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Mã giao dịch:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[#A3E635]">{detail.transactionCode}</span>
                  <button onClick={handleCopy} className="text-slate-400 hover:text-white p-0.5" title="Sao chép">
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  {copied && <span className="text-[10px] text-[#A3E635] font-bold">Đã chép!</span>}
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Thời gian thực hiện:</span>
                <span className="font-mono text-slate-200">
                  {detail.completedAt 
                    ? new Date(detail.completedAt).toLocaleString('vi-VN') 
                    : new Date(detail.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tài khoản nguồn:</span>
                <span className="font-mono text-white font-bold">{detail.sourceAccountNumber}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tài khoản thụ hưởng:</span>
                <span className="font-mono text-white font-bold">{detail.targetAccountNumber}</span>
              </div>

              {detail.targetAccountName && (
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Tên người nhận:</span>
                  <span className="font-bold text-emerald-400 uppercase">{detail.targetAccountName}</span>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Loại giao dịch:</span>
                <span className="font-semibold text-slate-200">
                  {detail.transactionType === 'INTERNAL_TRANSFER' 
                    ? 'Chuyển khoản nội bộ' 
                    : detail.transactionType === 'EXTERNAL_TRANSFER'
                    ? 'Chuyển khoản liên ngân hàng'
                    : detail.transactionType === 'DEPOSIT'
                    ? 'Nạp tiền mặt'
                    : detail.transactionType === 'WITHDRAWAL'
                    ? 'Rút tiền mặt'
                    : detail.transactionType}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Phí giao dịch:</span>
                <span className="text-emerald-400 font-bold">
                  {detail.feeAmount > 0 ? `${detail.feeAmount.toLocaleString('vi-VN')} VND` : 'Miễn phí'}
                </span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <span className="text-slate-400 shrink-0">Nội dung:</span>
                <span className="text-slate-200 font-medium text-right max-w-[220px] break-words">
                  {detail.description || 'Chuyển tiền'}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopy}
                className="flex-1 border-slate-700 bg-[#1A253D] hover:bg-[#253554] text-slate-200 font-bold text-xs h-11 rounded-full flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs h-11 rounded-full flex items-center justify-center gap-1.5 shadow-lg shadow-[#A3E635]/20"
              >
                <span>Đóng</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
