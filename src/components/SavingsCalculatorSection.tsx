import React, { useState, useMemo } from 'react';
import { 
  PiggyBank, 
  Coins, 
  Video, 
  Calendar, 
  Percent, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const SavingsCalculatorSection: React.FC = () => {
  const { savingsCalculator } = contentData;

  const [depositAmountStr, setDepositAmountStr] = useState<string>('100000000');
  const [selectedMonths, setSelectedMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(4.7);

  // Validation errors
  const [amountError, setAmountError] = useState<string>('');
  const [termError, setTermError] = useState<string>('');
  const [rateError, setRateError] = useState<string>('');

  // Handle amount change with numeric only
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmountStr(rawVal);

    const num = parseFloat(rawVal);
    if (!rawVal || isNaN(num) || num <= 0) {
      setAmountError(savingsCalculator.errorMessages.invalidAmount);
    } else {
      setAmountError('');
    }
  };

  // Handle term select
  const handleTermSelect = (months: number) => {
    setSelectedMonths(months);
    setTermError('');
    const matchedTerm = savingsCalculator.terms.find((t) => t.months === months);
    if (matchedTerm) {
      setInterestRate(matchedTerm.rate);
      setRateError('');
    }
  };

  // Handle interest rate change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInterestRate(val);
    if (isNaN(val) || val < 0 || val > 30) {
      setRateError(savingsCalculator.errorMessages.invalidRate);
    } else {
      setRateError('');
    }
  };

  // Calculation
  const calculation = useMemo(() => {
    const amount = parseFloat(depositAmountStr) || 0;
    if (amount <= 0 || !selectedMonths || interestRate < 0) {
      return { interestEarned: 0, totalMaturity: 0 };
    }
    // Standard Vietnamese Bank Deposit Formula for monthly term:
    // Tiền lãi = Số tiền gửi × (Lãi suất %/năm / 100) × (Số tháng / 12)
    const interestEarned = Math.round((amount * (interestRate / 100) * selectedMonths) / 12);
    const totalMaturity = amount + interestEarned;
    return { interestEarned, totalMaturity };
  }, [depositAmountStr, selectedMonths, interestRate]);

  // Format currency VND
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VND';
  };

  const parsedAmount = parseFloat(depositAmountStr) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#00529C] to-[#003B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <PiggyBank className="w-3.5 h-3.5 text-amber-300" />
            <span>Tiết kiệm tích luỹ VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {savingsCalculator.title}
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mt-1">
            {savingsCalculator.description}
          </p>
        </div>

        {/* Video Guide Link */}
        {savingsCalculator.videoGuide && (
          <a
            href={savingsCalculator.videoGuide.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Video className="w-4 h-4 text-amber-300" />
            <span>{savingsCalculator.videoGuide.title}</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        )}
      </div>

      {/* Main Grid Calculator & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left: 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Thông tin tiền gửi
          </h3>

          {/* 1. Deposit Amount Input */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#00529C]" />
                <span>Số tiền gửi</span>
              </span>
              <span className="text-2xs text-slate-500 font-semibold">Đơn vị: VND</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={parsedAmount > 0 ? new Intl.NumberFormat('vi-VN').format(parsedAmount) : depositAmountStr}
                onChange={handleAmountChange}
                placeholder="Nhập số tiền gửi (ví dụ: 100,000,000)"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-slate-900 font-bold text-lg focus:outline-hidden focus:ring-2 transition-all ${
                  amountError ? 'border-red-400 focus:ring-red-200 bg-red-50/30' : 'border-slate-300 focus:ring-blue-200 focus:border-[#00529C]'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                VND
              </span>
            </div>
            {amountError && (
              <p className="text-xs text-red-600 font-semibold">{amountError}</p>
            )}
            
            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[20000000, 50000000, 100000000, 200000000, 500000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setDepositAmountStr(amt.toString());
                    setAmountError('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#00529C] text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Triệu`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Term Selection */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00529C]" />
                <span>Kỳ hạn gửi</span>
              </span>
              <span className="text-2xs text-[#00529C] font-semibold">Theo biểu lãi suất niêm yết</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {savingsCalculator.terms.map((term) => {
                const isSelected = selectedMonths === term.months;
                return (
                  <button
                    key={term.months}
                    type="button"
                    onClick={() => handleTermSelect(term.months)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00529C] bg-blue-50/70 text-[#00529C] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-sm">{term.label}</div>
                    <div className="text-2xs font-semibold text-slate-500 mt-0.5">
                      {term.rate}%/năm
                    </div>
                  </button>
                );
              })}
            </div>
            {termError && (
              <p className="text-xs text-red-600 font-semibold">{termError}</p>
            )}
          </div>

          {/* 3. Interest Rate (%/year) */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#00529C]" />
                <span>Lãi suất (% / năm)</span>
              </span>
              <span className="text-2xs text-slate-500">Có thể tuỳ chỉnh theo thỏa thuận</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={isNaN(interestRate) ? '' : interestRate}
                onChange={handleRateChange}
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-slate-900 font-bold text-base focus:outline-hidden focus:ring-2 transition-all ${
                  rateError ? 'border-red-400 focus:ring-red-200 bg-red-50/30' : 'border-slate-300 focus:ring-blue-200 focus:border-[#00529C]'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                %/năm
              </span>
            </div>
            {rateError && (
              <p className="text-xs text-red-600 font-semibold">{rateError}</p>
            )}
          </div>
        </div>

        {/* Results Card (Right: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#002D54] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-2xs uppercase tracking-widest font-extrabold text-blue-200 block">
                KẾT QUẢ DỰ TÍNH
              </span>
              <h4 className="text-xl font-bold mt-1">Lợi nhuận tiền gửi</h4>
            </div>

            <div className="space-y-4">
              {/* Tiền gửi gốc */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Tiền gửi gốc:</span>
                <span className="font-bold text-white font-mono tabular-nums">
                  {formatCurrency(parsedAmount)}
                </span>
              </div>

              {/* Kỳ hạn & lãi suất */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Kỳ hạn & Lãi suất:</span>
                <span className="font-semibold text-white">
                  {selectedMonths} tháng ({interestRate}%/năm)
                </span>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* Tiền lãi dự tính */}
              <div className="bg-white/10 rounded-2xl p-4 space-y-1 border border-white/10">
                <span className="text-xs text-blue-200 font-semibold">Tiền lãi dự tính:</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
                  {formatCurrency(calculation.interestEarned)}
                </div>
              </div>

              {/* Tổng tiền khi đến hạn */}
              <div className="bg-white/10 rounded-2xl p-4 space-y-1 border border-white/10">
                <span className="text-xs text-blue-200 font-semibold">Tổng tiền khi đến hạn (Gốc + Lãi):</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                  {formatCurrency(calculation.totalMaturity)}
                </div>
              </div>
            </div>

            {/* Benefit info */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-2xs text-blue-100 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mẹo hay:</strong> Gửi tiết kiệm online qua <strong>VietinBank iPay</strong> nhận lãi suất ưu đãi cao hơn tại quầy lên đến <strong>0.3% - 0.5%/năm</strong> và chủ động quản lý rút gốc từng phần bất cứ lúc nào!
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-5 h-5 text-[#00529C] shrink-0" />
            <span>
              Công cụ tính mang tính chất tham khảo. Lãi suất thực tế được áp dụng theo thời điểm mở sổ tiết kiệm tại VietinBank.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
