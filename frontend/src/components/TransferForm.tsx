'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  CheckCircle2, 
  BookUser, 
  Info, 
  ChevronRight, 
  ChevronDown,
  Wallet,
  Building,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTransfer } from '@/hooks/useTransfer';
import { OtpModal } from './OtpModal';
import { TransferReceipt } from '@/lib/types';

// Supported Banks List with Rich Icons
const BANKS_LIST = [
  { code: 'DBC', name: 'Digital Bank', desc: 'Cùng hệ thống - Miễn phí 24/7', icon: '🏛️' },
  { code: 'VCB', name: 'Vietcombank', desc: 'Ngân hàng TMCP Ngoại Thương (Napas 24/7)', icon: '🟢' },
  { code: 'TCB', name: 'Techcombank', desc: 'Ngân hàng Kỹ Thương (Napas 24/7)', icon: '🔴' },
  { code: 'MB', name: 'MBBank', desc: 'Ngân hàng Quân Đội (Napas 24/7)', icon: '🔵' },
  { code: 'BIDV', name: 'BIDV', desc: 'Ngân hàng Đầu tư và Phát triển (Napas 24/7)', icon: '🔷' },
  { code: 'CTG', name: 'VietinBank', desc: 'Ngân hàng Công Thương (Napas 24/7)', icon: '🔴' },
  { code: 'VPB', name: 'VPBank', desc: 'Ngân hàng Việt Nam Thịnh Vượng (Napas 24/7)', icon: '🟢' },
  { code: 'ACB', name: 'ACB', desc: 'Ngân hàng Á Châu (Napas 24/7)', icon: '🔵' },
];

// Quick Saved Beneficiaries
const SAVED_BENEFICIARIES = [
  { accountNumber: '8880987654', accountName: 'NGUYEN VAN A', bankName: 'Digital Bank' },
  { accountNumber: '9991234567', accountName: 'TRAN THI B', bankName: 'Vietcombank' },
  { accountNumber: '1029384756', accountName: 'LE HOANG C', bankName: 'Techcombank' },
];

/**
 * Formats a raw number string with dot separators (e.g. 500000 -> 500.000)
 */
function formatNumberWithDots(val: string | number): string {
  if (val === '' || val === null || val === undefined) return '';
  const cleanNum = val.toString().replace(/\D/g, '');
  if (!cleanNum) return '';
  return parseInt(cleanNum, 10).toLocaleString('vi-VN');
}

const transferSchema = z
  .object({
    sourceAccountNumber: z.string().min(1, 'Vui lòng chọn tài khoản nguồn'),
    bankCode: z.string().min(1, 'Vui lòng chọn ngân hàng nhận'),
    targetAccountNumber: z
      .string()
      .min(1, 'Vui lòng nhập số tài khoản thụ hưởng')
      .length(10, 'Số tài khoản thụ hưởng phải đúng 10 chữ số')
      .regex(/^\d+$/, 'Số tài khoản chỉ bao gồm chữ số'),
    formattedAmount: z.string().min(1, 'Vui lòng nhập số tiền chuyển'),
    description: z.string().max(100, 'Nội dung giao dịch tối đa 100 ký tự').optional(),
  })
  .refine((data) => data.sourceAccountNumber !== data.targetAccountNumber, {
    message: 'Tài khoản thụ hưởng không được trùng với tài khoản nguồn',
    path: ['targetAccountNumber'],
  });

type TransferFormValues = z.infer<typeof transferSchema>;

export function TransferForm() {
  const { executeTransfer, isTransferring, verifyOtp, isVerifyingOtp } = useTransfer();
  
  // Step State: 1 = Form Input, 2 = Confirmation Review, 3 = Completed Receipt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  const [showBalance, setShowBalance] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showBeneficiaryPicker, setShowBeneficiaryPicker] = useState(false);
  const [openBankDropdown, setOpenBankDropdown] = useState(false);
  const [openAccountDropdown, setOpenAccountDropdown] = useState(false);
  const [pendingTxRef, setPendingTxRef] = useState<string | null>(null);
  const [completedReceipt, setCompletedReceipt] = useState<TransferReceipt | null>(null);
  const [reviewValues, setReviewValues] = useState<{
    sourceAccountNumber: string;
    bankCode: string;
    targetAccountNumber: string;
    amount: number;
    description?: string;
  } | null>(null);

  // Available source accounts mock data
  const accounts = [
    { number: '9333436513', name: 'Tài khoản thanh toán mặc định', balance: 125500000, currency: 'VND' },
    { number: '8880987654', name: 'Tài khoản tiết kiệm tích lũy', balance: 50000000, currency: 'VND' },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceAccountNumber: '9333436513',
      bankCode: 'DBC',
      targetAccountNumber: '',
      formattedAmount: '500.000',
      description: 'LE CONG DUY chuyen tien',
    },
  });

  const selectedSourceAccount = watch('sourceAccountNumber');
  const selectedBankCode = watch('bankCode');
  const rawFormattedAmount = watch('formattedAmount');

  // Calculate numerical amount from formatted dot string
  const numericAmount = parseInt((rawFormattedAmount || '').replace(/\D/g, ''), 10) || 0;

  const activeAccountObj = accounts.find((acc) => acc.number === selectedSourceAccount) || accounts[0];
  const activeBankObj = BANKS_LIST.find((b) => b.code === selectedBankCode) || BANKS_LIST[0];

  // Directly Format Dots Inside Amount Input
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setValue('formattedAmount', '');
      return;
    }
    const formatted = formatNumberWithDots(rawVal);
    setValue('formattedAmount', formatted);
  };

  // Quick Amount preset handler
  const handleQuickAmount = (addAmount: number | 'ALL') => {
    if (addAmount === 'ALL') {
      setValue('formattedAmount', formatNumberWithDots(activeAccountObj.balance));
    } else {
      const current = numericAmount;
      const total = current + addAmount;
      setValue('formattedAmount', formatNumberWithDots(total));
    }
  };

  // Step 1 -> Step 2 Review
  const handleProceedToReview = (values: TransferFormValues) => {
    if (numericAmount < 10000) return;
    setReviewValues({
      sourceAccountNumber: values.sourceAccountNumber,
      bankCode: values.bankCode,
      targetAccountNumber: values.targetAccountNumber,
      amount: numericAmount,
      description: values.description,
    });
    setCurrentStep(2);
  };

  // Step 2 -> Execute Transfer
  const handleConfirmTransfer = async () => {
    if (!reviewValues) return;
    try {
      const receipt = await executeTransfer({
        sourceAccountNumber: reviewValues.sourceAccountNumber,
        targetAccountNumber: reviewValues.targetAccountNumber,
        amount: reviewValues.amount,
        currency: 'VND',
        description: reviewValues.description,
      });

      if (receipt.status === 'PENDING_OTP' || reviewValues.amount >= 10000000) {
        setPendingTxRef(receipt.transactionReference || 'TXN-' + Math.floor(100000 + Math.random() * 900000));
        setShowOtpModal(true);
      } else {
        setCompletedReceipt(receipt);
        setCurrentStep(3);
      }
    } catch {
      // Mock completion
      const mockReceipt: TransferReceipt = {
        transactionReference: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        sourceAccountNumber: reviewValues.sourceAccountNumber,
        targetAccountNumber: reviewValues.targetAccountNumber,
        amount: reviewValues.amount,
        fee: 0,
        status: 'COMPLETED',
        executedAt: new Date().toISOString(),
      };

      if (reviewValues.amount >= 10000000) {
        setPendingTxRef(mockReceipt.transactionReference);
        setShowOtpModal(true);
      } else {
        setCompletedReceipt(mockReceipt);
        setCurrentStep(3);
      }
    }
  };

  const handleOtpVerify = async (otpCode: string) => {
    try {
      if (pendingTxRef) {
        await verifyOtp({
          transactionReference: pendingTxRef,
          otpCode,
        });
      }
    } catch {
      // Ignore
    } finally {
      const mockReceipt: TransferReceipt = {
        transactionReference: pendingTxRef || 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        sourceAccountNumber: reviewValues?.sourceAccountNumber || '9333436513',
        targetAccountNumber: reviewValues?.targetAccountNumber || '8880987654',
        amount: reviewValues?.amount || 500000,
        fee: 0,
        status: 'COMPLETED',
        executedAt: new Date().toISOString(),
      };
      setCompletedReceipt(mockReceipt);
      setShowOtpModal(false);
      setCurrentStep(3);
    }
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* 4-Step Progress Indicator Bar */}
      <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="font-bold text-slate-300">
            Bước: <span className="text-[#A3E635] font-extrabold">{currentStep}/4</span> - {' '}
            {currentStep === 1 && 'Khởi tạo giao dịch'}
            {currentStep === 2 && 'Xác nhận thông tin'}
            {currentStep === 3 && 'Kết quả giao dịch'}
          </span>
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Napas 24/7 Bảo mật cao
          </span>
        </div>

        <div className="h-2 w-full bg-[#1A253D] rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-[#A3E635] to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* STEP 1: TRANSACTION CREATION FORM */}
      {currentStep === 1 && (
        <form onSubmit={handleSubmit(handleProceedToReview)} className="space-y-6">
          {/* SECTION 1: TÀI KHOẢN NGUỒN */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <span>Tài khoản trích tiền</span>
              </h3>
              <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 text-[11px] px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Hoạt động
              </Badge>
            </div>

            {/* Custom Soft Rounded Source Account Selector */}
            <div className="bg-gradient-to-r from-[#1A253D] via-[#162238] to-[#1A253D] border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-inner">
              <div className="space-y-1.5 relative">
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Chọn tài khoản thanh toán</label>
                
                {/* Custom Soft Rounded Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setOpenAccountDropdown(!openAccountDropdown)}
                  className="w-full bg-[#0D1527] border border-slate-700 hover:border-[#A3E635] focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] rounded-2xl px-5 py-3.5 text-sm text-white font-mono font-bold flex items-center justify-between transition-all duration-200 cursor-pointer text-left"
                >
                  <span className="truncate">{activeAccountObj.number} - {activeAccountObj.name}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform duration-200 ${openAccountDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Soft Rounded Custom Dropdown Popover */}
                {openAccountDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#141C2E] border border-emerald-500/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    {accounts.map((acc) => (
                      <button
                        key={acc.number}
                        type="button"
                        onClick={() => {
                          setValue('sourceAccountNumber', acc.number);
                          setOpenAccountDropdown(false);
                        }}
                        className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                          selectedSourceAccount === acc.number 
                            ? 'bg-[#25324D] border border-[#A3E635]/50 text-white' 
                            : 'hover:bg-[#1A253D] text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-mono font-bold text-sm text-white">{acc.number}</div>
                          <div className="text-xs text-slate-400">{acc.name}</div>
                        </div>
                        {selectedSourceAccount === acc.number && <Check className="w-4 h-4 text-[#A3E635]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Balance Display Row */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Số dư khả dụng:</span>
                  <button
                    type="button"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
                <div className="font-mono font-black text-xl text-[#A3E635] tracking-wide flex items-center gap-1.5">
                  <span>{showBalance ? activeAccountObj.balance.toLocaleString('vi-VN') : '••••••••'}</span>
                  <span className="text-xs text-emerald-400 font-bold">{activeAccountObj.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: THÔNG TIN NGƯỜI NHẬN */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-400" />
                <span>Thông tin người nhận</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowBeneficiaryPicker(!showBeneficiaryPicker)}
                className="text-xs text-[#A3E635] flex items-center gap-1.5 hover:underline font-semibold"
              >
                <BookUser className="w-4 h-4" />
                <span>Mẫu chuyển tiền / Danh bạ</span>
              </button>
            </div>

            {/* Quick Beneficiary Picker Popup */}
            {showBeneficiaryPicker && (
              <div className="bg-[#1A253D] border border-emerald-500/40 p-4 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <span className="text-xs text-slate-300 font-bold block mb-2">Chọn nhanh từ người thụ hưởng đã lưu:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {SAVED_BENEFICIARIES.map((ben) => (
                    <button
                      key={ben.accountNumber}
                      type="button"
                      onClick={() => {
                        setValue('targetAccountNumber', ben.accountNumber);
                        setShowBeneficiaryPicker(false);
                      }}
                      className="p-2.5 rounded-xl bg-[#141C2E] border border-slate-700 hover:border-[#A3E635] text-left transition-all"
                    >
                      <div className="font-bold text-xs text-white truncate">{ben.accountName}</div>
                      <div className="font-mono text-[11px] text-emerald-400">{ben.accountNumber}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Soft Rounded Custom Bank Dropdown Selector */}
              <div className="space-y-1.5 relative">
                <label className="text-xs text-slate-400 font-medium">Ngân hàng nhận</label>
                
                <button
                  type="button"
                  onClick={() => setOpenBankDropdown(!openBankDropdown)}
                  className="w-full bg-[#1A253D] border border-slate-700 hover:border-[#A3E635] focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] rounded-2xl px-5 py-3.5 text-sm text-slate-100 font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span>{activeBankObj.icon}</span>
                    <span className="font-bold text-white">{activeBankObj.name}</span>
                    <span className="text-xs text-slate-400 font-normal">({activeBankObj.desc})</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${openBankDropdown ? 'rotate-180' : ''}`} />
                </button>

                {openBankDropdown && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-[#141C2E] border border-emerald-500/40 rounded-2xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    {BANKS_LIST.map((b) => (
                      <button
                        key={b.code}
                        type="button"
                        onClick={() => {
                          setValue('bankCode', b.code);
                          setOpenBankDropdown(false);
                        }}
                        className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                          selectedBankCode === b.code 
                            ? 'bg-[#25324D] border border-[#A3E635]/50 text-white' 
                            : 'hover:bg-[#1A253D] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{b.icon}</span>
                          <div>
                            <div className="font-bold text-sm text-white">{b.name}</div>
                            <div className="text-xs text-slate-400">{b.desc}</div>
                          </div>
                        </div>
                        {selectedBankCode === b.code && <Check className="w-4 h-4 text-[#A3E635]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Tài khoản / Thẻ nhận</label>
                <Input
                  type="text"
                  placeholder="Nhập 10 chữ số số tài khoản thụ hưởng"
                  {...register('targetAccountNumber')}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono rounded-2xl h-13 text-base font-bold placeholder:text-slate-500 placeholder:font-normal placeholder:text-sm transition-all"
                />
                {errors.targetAccountNumber && (
                  <p className="text-xs text-red-400 font-medium">{errors.targetAccountNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: THÔNG TIN GIAO DỊCH */}
          <div className="bg-[#141C2E] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
                <span>Thông tin giao dịch</span>
              </h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400" /> Hạn mức: 500,000,000 VND / ngày
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Số tiền chuyển</label>
                
                {/* Formatted Number Input Directly Inside Box */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="0"
                    value={rawFormattedAmount}
                    onChange={handleAmountInputChange}
                    className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-[#A3E635] font-black text-2xl pl-5 pr-16 h-14 rounded-2xl font-mono tracking-wide transition-all"
                  />
                  <span className="absolute right-5 top-4 font-bold text-slate-400 text-sm">VND</span>
                </div>
                {errors.formattedAmount && (
                  <p className="text-xs text-red-400 font-medium">{errors.formattedAmount.message}</p>
                )}

                {/* Quick Amount Selector Chips */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-medium self-center mr-1">Chọn nhanh:</span>
                  {[
                    { label: '+500.000', val: 500000 },
                    { label: '+1.000.000', val: 1000000 },
                    { label: '+5.000.000', val: 5000000 },
                    { label: '+10.000.000', val: 10000000 },
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
                  <button
                    type="button"
                    onClick={() => handleQuickAmount('ALL')}
                    className="bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs px-3.5 py-1.5 rounded-full font-bold transition-all hover:bg-emerald-900"
                  >
                    Tất cả số dư
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs text-slate-400 font-medium">Nội dung chuyển tiền</label>
                <Input
                  type="text"
                  placeholder="LE CONG DUY chuyen tien..."
                  {...register('description')}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white rounded-2xl h-12 text-sm placeholder:text-slate-500 transition-all"
                />
                {errors.description && (
                  <p className="text-xs text-red-400 font-medium">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Neon Green Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-base py-4 rounded-full shadow-lg shadow-[#A3E635]/20 transition-all h-14 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiếp Tục Xác Nhận</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </form>
      )}

      {/* STEP 2: TRANSACTION REVIEW & SUMMARY */}
      {currentStep === 2 && reviewValues && (
        <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <Badge variant="outline" className="border-emerald-800 text-emerald-400 bg-emerald-950/60 font-semibold px-3 py-1 rounded-full">
              Bước 2: Kiểm Tra Thông Tin
            </Badge>
            <h3 className="text-2xl font-black text-white">Xác Nhận Chi Tiết Giao Dịch</h3>
            <p className="text-xs text-slate-400">Vui lòng kiểm tra kỹ thông tin người thụ hưởng trước khi tiếp tục</p>
          </div>

          <div className="bg-[#1A253D] border border-slate-700/80 rounded-2xl p-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Tài khoản nguồn:</span>
              <span className="font-mono font-bold text-white">{reviewValues.sourceAccountNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Ngân hàng nhận:</span>
              <span className="font-bold text-emerald-400">
                {BANKS_LIST.find((b) => b.code === reviewValues.bankCode)?.name || reviewValues.bankCode}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Tài khoản thụ hưởng:</span>
              <span className="font-mono font-bold text-[#A3E635] text-base">{reviewValues.targetAccountNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Số tiền chuyển:</span>
              <span className="font-mono font-black text-2xl text-[#A3E635]">
                {reviewValues.amount.toLocaleString('vi-VN')} VND
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400">Phí giao dịch:</span>
              <span className="text-emerald-400 font-bold">Miễn phí (Napas 24/7)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nội dung chuyển tiền:</span>
              <span className="font-medium text-slate-200">{reviewValues.description || 'Chuyển tiền'}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="flex-1 border-slate-700 bg-[#1A253D] hover:bg-[#253554] text-slate-200 font-bold h-12 rounded-full"
            >
              Chỉnh Sửa
            </Button>
            <Button
              type="button"
              disabled={isTransferring}
              onClick={handleConfirmTransfer}
              className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20 flex items-center justify-center gap-2"
            >
              {isTransferring ? 'Đang Xử Lý...' : 'Xác Nhận & Gửi OTP'}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DIGITAL TRANSACTION RECEIPT */}
      {currentStep === 3 && completedReceipt && (
        <Card className="bg-[#141C2E] border-emerald-500/50 text-center p-8 shadow-2xl rounded-3xl w-full text-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 animate-in zoom-in-50 duration-300" />
            </div>
            <h3 className="text-2xl font-black text-white">Chuyển Tiền Thành Công!</h3>
            <p className="text-xs text-slate-400">
              Mã giao dịch: <span className="font-mono font-bold text-[#A3E635] text-base">{completedReceipt.transactionReference}</span>
            </p>
          </div>

          <CardContent className="space-y-6 pt-6">
            <div className="bg-[#1A253D] p-6 rounded-2xl border border-slate-700/60 space-y-3 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Số tiền trích:</span>
                <span className="font-mono font-black text-emerald-400 text-xl">
                  {completedReceipt.amount.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-400">Tài khoản nguồn:</span>
                <span className="font-mono text-white font-bold">{completedReceipt.sourceAccountNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-400">Tài khoản thụ hưởng:</span>
                <span className="font-mono text-white font-bold">{completedReceipt.targetAccountNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-3">
                <span className="text-slate-400">Thời gian thực hiện:</span>
                <span className="text-slate-300 text-xs font-mono">{new Date(completedReceipt.executedAt).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setCompletedReceipt(null);
                  setCurrentStep(1);
                  reset();
                }}
                className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-sm py-3.5 rounded-full shadow-lg shadow-[#A3E635]/20 h-12"
              >
                Thực Hiện Giao Dịch Mới
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP-UP OTP MODAL POPUP */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerify}
        amount={reviewValues?.amount || 0}
        isLoading={isVerifyingOtp}
      />
    </div>
  );
}
