import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Award, 
  MapPin, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeroKioskBannerProps {
  onSelectFeature: (featureId: string) => void;
}

export const HeroKioskBanner: React.FC<HeroKioskBannerProps> = ({ onSelectFeature }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 'faq',
      title: 'Giải đáp thắc mắc',
      desc: 'Quên mật khẩu, đóng thẻ, CCCD gắn chip NFC, nộp thuế',
      icon: <HelpCircle className="w-5 h-5 text-[#00529C]" />,
      badge: 'Trực quan'
    },
    {
      id: 'game',
      title: 'Thử thách Game',
      desc: 'Flappy Bird & Snake nhận voucher xăng 2 lít liền tay',
      icon: <Gamepad2 className="w-5 h-5 text-[#ED1C24]" />,
      badge: 'Có quà'
    },
    {
      id: 'savings',
      title: 'Tính lãi tiền gửi',
      desc: 'Ước tính lợi nhuận tiết kiệm theo kỳ hạn linh hoạt',
      icon: <PiggyBank className="w-5 h-5 text-emerald-600" />,
      badge: 'Ưu đãi'
    },
    {
      id: 'loan',
      title: 'Lịch trả nợ khoản vay',
      desc: 'Bảng tính chi tiết trả gốc đều & dư nợ giảm dần',
      icon: <Calculator className="w-5 h-5 text-indigo-600" />,
      badge: 'Minh bạch'
    },
    {
      id: 'products',
      title: 'Sản phẩm nổi bật',
      desc: 'Tài khoản HKD, Chạm POS, Thu hộ KHDN, Bán đấu giá',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      badge: 'Hot'
    },
    {
      id: 'branches',
      title: 'Điểm giao dịch',
      desc: 'Chi nhánh Kiên Giang & 7 PGD, hotline và Google Maps',
      icon: <MapPin className="w-5 h-5 text-sky-600" />,
      badge: 'Mạng lưới'
    },
    {
      id: 'download-app',
      title: 'Tải App iPay',
      desc: 'Quét mã QR tải ngay trên iPhone và Android',
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      badge: 'Số 1'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-[#00529C] bg-blue-50 px-2.5 py-1 rounded-md">
              Kiosk Quầy Giao Dịch
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeStr || 'VietinBank'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Kính chào Quý khách đến với <span className="text-[#00529C]">VietinBank</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Trong thời gian chờ phục vụ tại quầy, Quý khách hãy thoải mái tra cứu hướng dẫn nghiệp vụ, tính toán tài chính hoặc tham gia trò chơi săn voucher xăng tiện ích!
          </p>
        </div>

        {/* Quick Kiosk Service Reassurance */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block">Bảo mật chuẩn</span>
              <span className="text-xs font-bold text-slate-800">Quyết định 2345/NHNN</span>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#00529C] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold block">Ngân hàng hàng đầu</span>
              <span className="text-xs font-bold text-slate-800">VietinBank Kiên Giang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {features.map((feat) => (
          <div
            key={feat.id}
            onClick={() => onSelectFeature(feat.id)}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#00529C]/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                  {feat.icon}
                </div>
                <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-[#00529C] transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {feat.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-2xs font-bold text-[#00529C]">
              <span>Khám phá ngay</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
