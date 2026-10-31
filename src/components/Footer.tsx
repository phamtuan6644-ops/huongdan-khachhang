import React from 'react';
import { Phone, Globe, Shield, MapPin } from 'lucide-react';
import contentData from '../data/contentData.json';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-extrabold text-xs">
              CTG
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">Ngân hàng TMCP Công Thương Việt Nam</span>
              <p className="text-2xs text-slate-500">VietinBank - Nâng giá trị cuộc sống</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <a 
              href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#00529C] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>Hotline 24/7: {contentData.brand.hotline}</span>
            </a>
            <span className="text-slate-300">·</span>
            <a 
              href={contentData.brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#00529C] transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>vietinbank.vn</span>
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-2xs text-slate-400">
          <p>© 2026 Ngân hàng TMCP Công Thương Việt Nam (VietinBank). Kiosk giao dịch khách hàng.</p>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>Mọi quyền được bảo lưu. Ứng dụng an toàn & bảo mật.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
