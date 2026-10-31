import React from 'react';
import { 
  Apple, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ExternalLink,
  QrCode
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const AppDownloadSection: React.FC = () => {
  const { appDownload } = contentData;

  // Reliable QR code generator URLs for iOS & Android
  const iosQr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appDownload.ios.url)}`;
  const androidQr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(appDownload.android.url)}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00529C] to-[#003B73] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ngân hàng số thông minh</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {appDownload.title}
          </h2>
          <p className="text-base sm:text-lg text-blue-100 font-medium">
            {appDownload.subTitle}
          </p>
          <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed pt-1">
            {appDownload.description}
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Download Options: 2 Columns for iOS & Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Apple App Store</h3>
                  <span className="text-xs text-slate-500">Dành cho iPhone, iPad</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Miễn phí tải
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200">
                <img 
                  src={iosQr} 
                  alt="QR Code tải VietinBank iPay cho iOS" 
                  className="w-40 h-40 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-3 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#00529C]" />
                <span>Quét mã camera iPhone để tải ngay</span>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href={appDownload.ios.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Mở trên App Store</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Google Play Store</h3>
                  <span className="text-xs text-slate-500">Samsung, Xiaomi, Oppo...</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Miễn phí tải
              </span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200">
                <img 
                  src={androidQr} 
                  alt="QR Code tải VietinBank iPay cho Android" 
                  className="w-40 h-40 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-3 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#00529C]" />
                <span>Quét mã camera Android để tải ngay</span>
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href={appDownload.android.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Mở trên Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Tại sao nên sử dụng VietinBank iPay?</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDownload.highlights.map((highlight, index) => (
            <div 
              key={index}
              className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#00529C] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                {highlight}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs sm:text-sm text-slate-600">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Khách hàng chưa có tài khoản VietinBank có thể mở tài khoản trực tuyến (eKYC) ngay trên ứng dụng iPay trong vòng 2 phút với CCCD gắn chip!
          </span>
        </div>
      </div>
    </div>
  );
};
