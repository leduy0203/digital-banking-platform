"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  X,
  Sparkles
} from "lucide-react";
import { employeeApi } from "@/lib/api";
import { EmployeeTransaction } from "@/lib/types/employee";

export default function TransactionsRollbackPage() {
  const [txList, setTxList] = useState<EmployeeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState<EmployeeTransaction | null>(null);
  const [rollbackModalOpen, setRollbackModalOpen] = useState(false);
  const [rollbackReason, setRollbackReason] = useState("Chuyển tiền nhầm số tài khoản / Tên người nhận");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await employeeApi.getTransactions(searchTerm);
      setTxList(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm]);

  const handleRollbackConfirm = async () => {
    if (!selectedTx) return;
    const res = await employeeApi.requestRollback(selectedTx.txHash, rollbackReason);
    
    // Refresh list
    const updated = await employeeApi.getTransactions(searchTerm);
    setTxList(updated);
    setRollbackModalOpen(false);
    showToast(res.message);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto px-6 lg:px-8 py-6 space-y-6 text-slate-100 selection:bg-[#A3E635] selection:text-slate-950">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#141C2E] text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#A3E635] shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-7 h-7 text-[#A3E635]" /> Nhật Ký Giao Dịch & Hỗ Trợ Rollback
          </h1>
          <p className="text-xs text-slate-400">Tra cứu chi tiết mọi giao dịch trên hệ thống và xử lý yêu cầu hoàn tiền/đảo bút toán</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#141C2E] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo Mã giao dịch (TxHash), STK chuyển/nhận, Tên khách hàng..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D1527] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#A3E635]"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#141C2E] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A3E635] animate-spin" /> Đang tải lịch sử giao dịch...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0D1527] text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Mã Giao Dịch (TxHash)</th>
                  <th className="px-6 py-4">Tài Khoản Nguồn</th>
                  <th className="px-6 py-4">Tài Khoản Đích</th>
                  <th className="px-6 py-4">Số Tiền</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Thời Gian</th>
                  <th className="px-6 py-4 text-right">Hỗ Trợ Rollback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {txList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white text-xs">{tx.txHash}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{tx.senderName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{tx.senderAcc}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{tx.receiverName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{tx.receiverAcc}</p>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#A3E635] text-sm font-mono">
                      ₫ {tx.amount.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === "SUCCESS" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30" :
                        tx.status === "REVERSED" ? "bg-purple-950/80 text-purple-300 border border-purple-500/30" : "bg-amber-950/80 text-amber-300 border border-amber-500/30"
                      }`}>
                        {tx.status === "SUCCESS" ? "THÀNH CÔNG" : tx.status === "REVERSED" ? "ĐÃ HOÀN TIỀN (REVERSED)" : "ĐANG XỬ LÝ"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{tx.timestamp}</td>
                    <td className="px-6 py-4 text-right">
                      {tx.canRollback ? (
                        <button
                          onClick={() => {
                            setSelectedTx(tx);
                            setRollbackModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Yêu Cầu Rollback
                        </button>
                      ) : (
                        <span className="text-slate-500 italic">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rollback Request Modal */}
      {rollbackModalOpen && selectedTx && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#141C2E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-700 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-400" /> Khởi Tạo Yêu Cầu Hoàn Tiền (Rollback)
              </h3>
              <button onClick={() => setRollbackModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-950/50 rounded-2xl border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <p className="font-bold">Mã GD: {selectedTx.txHash}</p>
              <p>Số tiền đảo bút toán: <strong className="text-[#A3E635]">₫ {selectedTx.amount.toLocaleString("vi-VN")}</strong></p>
              <p>Nguồn: {selectedTx.senderName} ({selectedTx.senderAcc}) → Đích: {selectedTx.receiverName} ({selectedTx.receiverAcc})</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Lý Do Đảo Bút Toán / Hoàn Tiền</label>
                <select
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  className="w-full p-3 bg-[#0D1527] border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 font-medium text-white"
                >
                  <option value="Chuyển tiền nhầm số tài khoản / Tên người nhận">Chuyển tiền nhầm số tài khoản / Tên người nhận</option>
                  <option value="Lỗi đối soát hệ thống ngân hàng đối ứng">Lỗi đối soát hệ thống ngân hàng đối ứng</option>
                  <option value="Lệnh giao dịch bị trùng lặp (Duplicate)">Lệnh giao dịch bị trùng lặp (Duplicate)</option>
                  <option value="Khách hàng yêu cầu hủy giao dịch tại quầy">Khách hàng yêu cầu hủy giao dịch tại quầy</option>
                </select>
              </div>

              <div className="p-3 bg-[#0D1527] rounded-xl border border-slate-800 text-[11px] text-slate-400">
                ⚠️ Quy trình Maker-Checker: Yêu cầu sau khi khởi tạo sẽ được gửi tới <strong>Kiểm soát viên (Checker)</strong> phê duyệt trước khi tiền được hoàn về tài khoản gốc.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setRollbackModalOpen(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl">
                Hủy bỏ
              </button>
              <button onClick={handleRollbackConfirm} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md">
                Gửi Yêu Cầu Rollback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
