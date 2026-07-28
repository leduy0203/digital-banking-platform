'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookUser, 
  Search, 
  Trash2, 
  Copy, 
  ArrowRightLeft, 
  UserPlus, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBeneficiaries } from '@/hooks/useBeneficiaries';

const MOCK_BANKS = [
  { code: 'DBC', name: 'Digital Bank (Cùng hệ thống)' },
  { code: 'VCB', name: 'Vietcombank (Napas 24/7)' },
  { code: 'TCB', name: 'Techcombank (Napas 24/7)' },
  { code: 'MB', name: 'MBBank (Napas 24/7)' },
  { code: 'BIDV', name: 'BIDV (Napas 24/7)' },
];

export function BeneficiaryList() {
  const { beneficiaries, addBeneficiary } = useBeneficiaries();
  
  const [localBeneficiaries, setLocalBeneficiaries] = useState(beneficiaries);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FAVORITE' | 'DBC'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // New beneficiary form state
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newBank, setNewBank] = useState('DBC');
  const [newNickName, setNewNickName] = useState('');

  const displayList = localBeneficiaries.length > 0 ? localBeneficiaries : beneficiaries;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNumber || !newName) return;
    try {
      await addBeneficiary({
        accountNumber: newAccNumber,
        accountName: newName,
        bankName: MOCK_BANKS.find(b => b.code === newBank)?.name || newBank,
        nickname: newNickName || undefined,
      });
    } catch {
      // Ignore
    } finally {
      setNewAccNumber('');
      setNewName('');
      setNewNickName('');
      setShowAddModal(false);
    }
  };

  const removeBeneficiaryItem = (id: string) => {
    setLocalBeneficiaries(prev => prev.filter(b => b.id !== id));
  };

  const filteredBeneficiaries = displayList.filter((b) => {
    const matchesSearch = 
      b.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.accountNumber.includes(searchQuery) ||
      (b.nickname && b.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeFilter === 'DBC') return matchesSearch && b.bankName.includes('Digital Bank');
    return matchesSearch;
  });

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Search & Actions Bar */}
      <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm theo tên, số tài khoản hoặc tên gợi nhớ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white rounded-2xl pl-11 h-12 text-xs transition-all"
            />
          </div>

          {/* Add Beneficiary Button */}
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold text-xs px-5 py-3 rounded-full shadow-lg shadow-[#A3E635]/20 flex items-center justify-center gap-2 h-12 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Người Thụ Hưởng Mới</span>
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'ALL' 
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' 
                : 'bg-[#1A253D] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Tất cả ({displayList.length})
          </button>
          <button
            onClick={() => setActiveFilter('DBC')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeFilter === 'DBC' 
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' 
                : 'bg-[#1A253D] text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Cùng hệ thống Digital Bank
          </button>
        </div>
      </div>

      {/* Beneficiaries Cards Grid */}
      {filteredBeneficiaries.length === 0 ? (
        <div className="bg-[#141C2E] border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <BookUser className="w-12 h-12 text-slate-600 mx-auto" />
          <h4 className="font-bold text-white text-base">Chưa có người thụ hưởng phù hợp</h4>
          <p className="text-xs">Bấm nút "Thêm Người Thụ Hưởng Mới" để lưu thông tin tài khoản hay giao dịch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeneficiaries.map((b) => (
            <div 
              key={b.id}
              className="bg-[#141C2E] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Avatar Initial Capsule */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                      {b.accountName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-[#A3E635] transition-colors">{b.accountName}</h4>
                      {b.nickname && (
                        <span className="text-[11px] text-emerald-400 font-medium">({b.nickname})</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeBeneficiaryItem(b.id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/40 transition-colors"
                    title="Xóa thụ hưởng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[#1A253D] border border-slate-700/60 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Số tài khoản:</span>
                    <button
                      onClick={() => copyToClipboard(b.accountNumber)}
                      className="font-mono font-bold text-white flex items-center gap-1 hover:text-[#A3E635]"
                    >
                      <span>{b.accountNumber}</span>
                      <Copy className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                  {copiedAccount === b.accountNumber && (
                    <div className="text-[10px] text-emerald-400 font-semibold text-right">Đã sao chép!</div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="font-bold text-slate-200 truncate max-w-[150px]">{b.bankName}</span>
                  </div>
                </div>
              </div>

              {/* Quick Transfer Button */}
              <Link href="/transfers" className="w-full">
                <Button className="w-full bg-[#1A253D] hover:bg-[#253554] border border-slate-700 hover:border-[#A3E635] text-slate-100 hover:text-white font-extrabold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>Chuyển Tiền Cho Người Này</span>
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Beneficiary Modal Popover */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateBeneficiary} className="bg-[#141C2E] border border-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-md space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>Thêm Người Thụ Hưởng Mới</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Ngân hàng nhận</label>
                <select
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="w-full bg-[#1A253D] border border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-bold rounded-2xl p-3.5 outline-none transition-all cursor-pointer"
                >
                  {MOCK_BANKS.map(b => (
                    <option key={b.code} value={b.code} className="bg-[#141C2E]">{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Số tài khoản thụ hưởng</label>
                <Input
                  type="text"
                  required
                  placeholder="8880987654"
                  value={newAccNumber}
                  onChange={(e) => setNewAccNumber(e.target.value)}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-mono font-bold rounded-2xl h-12 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Tên người nhận (Viết hoa)</label>
                <Input
                  type="text"
                  required
                  placeholder="NGUYEN VAN A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white font-bold rounded-2xl h-12 uppercase transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold">Tên gợi nhớ (Tùy chọn)</label>
                <Input
                  type="text"
                  placeholder="Anh A bạn cấp 3..."
                  value={newNickName}
                  onChange={(e) => setNewNickName(e.target.value)}
                  className="bg-[#1A253D] border-slate-700 focus:border-[#A3E635] focus:ring-2 focus:ring-[#A3E635]/30 focus:shadow-[0_0_15px_rgba(163,230,53,0.25)] text-white rounded-2xl h-12 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-slate-700 bg-[#1A253D] text-slate-300 font-bold h-12 rounded-full">
                Hủy Bỏ
              </Button>
              <Button type="submit" className="flex-1 bg-[#A3E635] hover:bg-[#86efac] text-slate-950 font-extrabold h-12 rounded-full shadow-lg shadow-[#A3E635]/20">
                Lưu Thụ Hưởng
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
