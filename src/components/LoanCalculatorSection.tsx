import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  Calendar, 
  Percent, 
  Table, 
  X, 
  Download, 
  TrendingDown, 
  Info,
  CheckCircle2
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface ScheduleRow {
  period: number;
  paymentDate: string;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export const LoanCalculatorSection: React.FC = () => {
  const { loanCalculator } = contentData;

  // Form states - Input text format, NOT slider
  const [loanAmountStr, setLoanAmountStr] = useState<string>('500000000');
  const [tenureMonths, setTenureMonths] = useState<number>(60);
  const [annualRate, setAnnualRate] = useState<number>(8.0);
  const [disbursementDate, setDisbursementDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedCycleId, setSelectedCycleId] = useState<string>('monthly');
  const [repaymentDay, setRepaymentDay] = useState<number>(25);

  // Modal detail table
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Parse loan amount safely
  const loanAmount = Math.max(0, parseFloat(loanAmountStr.replace(/[^0-9]/g, '')) || 0);

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setLoanAmountStr(rawVal);
  };

  // Find cycle config
  const currentCycle = loanCalculator.cycles.find((c) => c.id === selectedCycleId) || loanCalculator.cycles[0];

  // Calculate schedule based on:
  // 1. Trả gốc đều: Gốc kỳ = Tổng tiền vay / Tổng số kỳ
  // 2. Lãi kỳ = Dư nợ đầu kỳ × Lãi suất kỳ
  // 3. Chu kỳ quy đổi: tháng (/12), quý (/4), 6 tháng (/2), năm (/1)
  // 4. Sinh ngày trả nợ định kỳ từ ngày giải ngân + ngày trả nợ do người dùng chọn
  // 5. Làm tròn đến 1.000 đồng, sai lệch làm tròn dồn vào kỳ cuối cùng
  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || tenureMonths <= 0 || annualRate < 0) {
      return {
        schedule: [] as ScheduleRow[],
        totalPrincipal: 0,
        totalInterest: 0,
        totalPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0
      };
    }

    // Determine number of periods based on cycle
    let periodStepMonths = 1;
    let cycleRate = annualRate / 100 / 12;

    if (selectedCycleId === 'quarterly') {
      periodStepMonths = 3;
      cycleRate = annualRate / 100 / 4;
    } else if (selectedCycleId === 'semiAnnual') {
      periodStepMonths = 6;
      cycleRate = annualRate / 100 / 2;
    } else if (selectedCycleId === 'yearly') {
      periodStepMonths = 12;
      cycleRate = annualRate / 100 / 1;
    }

    const totalPeriods = Math.ceil(tenureMonths / periodStepMonths);
    if (totalPeriods <= 0) {
      return { schedule: [], totalPrincipal: 0, totalInterest: 0, totalPayment: 0, firstMonthPayment: 0, lastMonthPayment: 0 };
    }

    // Rounding base principal per period (to 1,000 VND)
    const rawPrincipalPerPeriod = loanAmount / totalPeriods;
    const standardPrincipal = Math.round(rawPrincipalPerPeriod / 1000) * 1000;

    const rows: ScheduleRow[] = [];
    let currentBalance = loanAmount;
    let sumPrincipal = 0;
    let sumInterest = 0;

    const [disbYear, disbMonth, disbDate] = disbursementDate.split('-').map(Number);
    const startDate = new Date(disbYear, disbMonth - 1, disbDate || 1);

    for (let i = 1; i <= totalPeriods; i++) {
      const isLast = i === totalPeriods;

      // Adjust principal for last period
      let principalThisPeriod = isLast ? (loanAmount - sumPrincipal) : standardPrincipal;
      if (principalThisPeriod > currentBalance) principalThisPeriod = currentBalance;

      // Interest this period = currentBalance * cycleRate
      let interestThisPeriod = Math.round((currentBalance * cycleRate) / 1000) * 1000;

      const totalThisPeriod = principalThisPeriod + interestThisPeriod;
      const closingBalance = Math.max(0, currentBalance - principalThisPeriod);

      // Generate repayment date
      // month offset = i * periodStepMonths
      const payMonthTarget = startDate.getMonth() + (i * periodStepMonths);
      const payDateObj = new Date(startDate.getFullYear(), payMonthTarget, repaymentDay);

      const formattedDate = `${String(payDateObj.getDate()).padStart(2, '0')}/${String(payDateObj.getMonth() + 1).padStart(2, '0')}/${payDateObj.getFullYear()}`;

      rows.push({
        period: i,
        paymentDate: formattedDate,
        openingBalance: currentBalance,
        principal: principalThisPeriod,
        interest: interestThisPeriod,
        totalPayment: totalThisPeriod,
        closingBalance: closingBalance
      });

      sumPrincipal += principalThisPeriod;
      sumInterest += interestThisPeriod;
      currentBalance = closingBalance;
    }

    const firstMonthPayment = rows.length > 0 ? rows[0].totalPayment : 0;
    const lastMonthPayment = rows.length > 0 ? rows[rows.length - 1].totalPayment : 0;

    return {
      schedule: rows,
      totalPrincipal: sumPrincipal,
      totalInterest: sumInterest,
      totalPayment: sumPrincipal + sumInterest,
      firstMonthPayment,
      lastMonthPayment
    };
  }, [loanAmount, tenureMonths, annualRate, disbursementDate, selectedCycleId, repaymentDay]);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' VND';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#00529C] to-[#003B73] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Tín dụng & Vay vốn VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loanCalculator.title}
          </h2>
          <p className="text-sm sm:text-base text-blue-100 mt-1">
            {loanCalculator.subTitle}
          </p>
        </div>

        <button
          onClick={() => setShowDetailModal(true)}
          className="px-5 py-3 rounded-2xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
        >
          <Table className="w-4 h-4" />
          <span>Xem chi tiết lịch trả nợ</span>
        </button>
      </div>

      {/* Main Grid: Input Form vs Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left: 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Thông tin khoản vay (Nhập trực tiếp)
          </h3>

          {/* 1. Loan Amount (Input field NOT slider) */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-[#00529C]" />
                <span>Số tiền vay (Dạng nhập)</span>
              </span>
              <span className="text-2xs text-[#00529C] font-semibold">Đơn vị: VND</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={loanAmount > 0 ? new Intl.NumberFormat('vi-VN').format(loanAmount) : loanAmountStr}
                onChange={handleAmountInput}
                placeholder="Ví dụ: 500,000,000"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-[#00529C] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                VND
              </span>
            </div>

            {/* Quick shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[100000000, 300000000, 500000000, 1000000000, 2000000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmountStr(amt.toString())}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#00529C] text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {amt >= 1000000000 ? `${amt / 1000000000} Tỷ` : `${amt / 1000000} Tr`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Loan Tenure & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tenure months */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00529C]" />
                <span>Thời gian vay (Tháng)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-[#00529C]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  Tháng ({Math.round((tenureMonths / 12) * 10) / 10} năm)
                </span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#00529C]" />
                <span>Lãi suất (% / năm)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-[#00529C]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  %/năm
                </span>
              </div>
            </div>
          </div>

          {/* 3. Disbursement date & Repayment day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Ngày giải ngân</label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-[#00529C]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Ngày trả nợ định kỳ hằng tháng</label>
              <select
                value={repaymentDay}
                onChange={(e) => setRepaymentDay(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-[#00529C]"
              >
                {[5, 10, 15, 20, 25, 28].map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hằng tháng
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Repayment Cycle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Chu kỳ trả nợ</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {loanCalculator.cycles.map((cy) => (
                <button
                  key={cy.id}
                  type="button"
                  onClick={() => setSelectedCycleId(cy.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedCycleId === cy.id
                      ? 'border-[#00529C] bg-blue-50 text-[#00529C] shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cy.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Overview (Right: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-[#002D54] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-2xs uppercase tracking-widest font-extrabold text-blue-200 block">
                  KẾT QUẢ DỰ TÍNH
                </span>
                <h4 className="text-xl font-bold mt-1">Nghĩa vụ trả nợ</h4>
              </div>
              <span className="text-2xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full">
                Dư nợ giảm dần
              </span>
            </div>

            <div className="space-y-4">
              {/* Số tiền trả kỳ đầu */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-xs text-blue-200 font-semibold">Số tiền trả kỳ đầu tiên (Gốc + Lãi):</span>
                <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                  {formatVND(scheduleData.firstMonthPayment)}
                </div>
              </div>

              {/* Số tiền trả kỳ cuối */}
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-1">
                <span className="text-xs text-blue-200 font-semibold">Số tiền trả kỳ cuối cùng:</span>
                <div className="text-xl font-black text-emerald-400 font-mono tabular-nums">
                  {formatVND(scheduleData.lastMonthPayment)}
                </div>
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Tổng tiền vay gốc:</span>
                  <span className="font-bold text-white font-mono">{formatVND(scheduleData.totalPrincipal)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tổng lãi phải trả:</span>
                  <span className="font-bold text-amber-300 font-mono">{formatVND(scheduleData.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                  <span className="font-bold text-white">Tổng gốc + Lãi:</span>
                  <span className="font-extrabold text-emerald-400 font-mono text-base">{formatVND(scheduleData.totalPayment)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>Xem chi tiết {scheduleData.schedule.length} kỳ trả nợ</span>
            </button>
          </div>

          {/* Principle explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <TrendingDown className="w-4 h-4 text-[#00529C]" />
              <span>Đặc điểm phương thức trả nợ theo dư nợ giảm dần:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Số tiền trả ban đầu cao, sau đó giảm dần theo thời gian.</li>
              <li>Tổng lãi phải trả thường thấp hơn phương thức góp đều.</li>
              <li>Làm tròn đến 1.000 đồng, sai lệch được tự động điều chỉnh vào kỳ cuối cùng.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal: Full Schedule Table Detail */}
      {showDetailModal && (
        <div 
          onClick={() => setShowDetailModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#00529C]">
                  Bảng tính lịch trả nợ với dư nợ giảm dần
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Khoản vay: {formatVND(loanAmount)} · Thời hạn: {tenureMonths} tháng · Lãi suất: {annualRate}%/năm
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Table Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#00529C] text-white sticky top-0 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-3 rounded-l-lg">Kỳ</th>
                    <th className="py-3 px-3">Ngày trả nợ</th>
                    <th className="py-3 px-3 text-right">Dư nợ đầu kỳ</th>
                    <th className="py-3 px-3 text-right">Gốc trả</th>
                    <th className="py-3 px-3 text-right">Lãi trả</th>
                    <th className="py-3 px-3 text-right">Tổng gốc + Lãi</th>
                    <th className="py-3 px-3 text-right rounded-r-lg">Dư nợ còn lại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleData.schedule.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{row.period}</td>
                      <td className="py-3 px-3 text-slate-700 font-medium">{row.paymentDate}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        {new Intl.NumberFormat('vi-VN').format(row.openingBalance)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                        {new Intl.NumberFormat('vi-VN').format(row.principal)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-600 font-semibold">
                        {new Intl.NumberFormat('vi-VN').format(row.interest)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#00529C]">
                        {new Intl.NumberFormat('vi-VN').format(row.totalPayment)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500">
                        {new Intl.NumberFormat('vi-VN').format(row.closingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-slate-900 sticky bottom-0 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="py-3.5 px-3 uppercase">TỔNG CỘNG</td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#00529C]">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.totalPrincipal)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-amber-600">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.totalInterest)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#ED1C24]">
                      {new Intl.NumberFormat('vi-VN').format(scheduleData.totalPayment)}
                    </td>
                    <td className="py-3.5 px-3 text-right">0</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-2xs text-slate-500 font-medium">
                * Bảng tính mang tính chất tham khảo. Quý khách vui lòng liên hệ quầy giao dịch để nhận phê duyệt chính xác.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-[#00529C] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
