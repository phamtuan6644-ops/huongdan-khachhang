import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink, 
  Search, 
  Building2, 
  Navigation,
  Eye,
  X
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const BranchesSection: React.FC = () => {
  const { branchOffices } = contentData;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Search filter
  const filteredBranches = branchOffices.items.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      b.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.phone.includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#00529C] to-[#003B73] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Mạng lưới VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {branchOffices.title}
          </h2>
          <p className="text-base text-blue-100 mt-1">
            {branchOffices.subTitle}
          </p>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200 mt-3 font-semibold">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>{branchOffices.workingHours}</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/95 text-slate-900 placeholder-slate-400 font-semibold text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-300 shadow-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Branches List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredBranches.map((branch) => (
          <div
            key={branch.stt}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Branch Photo */}
              <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden group">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.img-fallback')) {
                      const fb = document.createElement('div');
                      fb.className = 'img-fallback w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400';
                      fb.innerHTML = `<div class="w-12 h-12 rounded-2xl bg-blue-100 text-[#00529C] flex items-center justify-center mb-2 font-black">${branch.name.slice(0, 3)}</div><p class="text-xs font-bold text-slate-600">${branch.name}</p>`;
                      parent.appendChild(fb);
                    }
                  }}
                />

                <div className="absolute top-3 left-3 bg-[#00529C]/90 backdrop-blur-xs text-white text-2xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                  {branch.type}
                </div>

                <button
                  onClick={() => setZoomedImage(branch.image)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#00529C] shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Xem phóng to hình ảnh phòng giao dịch"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Branch Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {branch.stt}. {branch.name}
                  </h3>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{branch.address}</span>
                </div>

                {/* Working hours */}
                <div className="flex items-center gap-2.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{branch.hours} (Thứ 2 - Thứ 6)</span>
                </div>
              </div>
            </div>

            {/* Actions: Direct Phone Call & Google Maps Navigation */}
            <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 mt-2">
              <a
                href={`tel:${branch.phone.replace(/[^0-9]/g, '')}`}
                className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-[#ED1C24] font-bold text-xs flex items-center justify-center gap-2 border border-red-200/60 transition-colors"
                title="Bấm gọi hotline phòng giao dịch ngay lập tức"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi: {branch.phone}</span>
              </a>

              <a
                href={branch.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#00529C] hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                title="Mở vị trí trên Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
          <p className="font-semibold text-base">Không tìm thấy điểm giao dịch phù hợp với từ khóa "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs font-bold text-[#00529C] hover:underline"
          >
            Hiển thị lại toàn bộ điểm giao dịch
          </button>
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {zoomedImage && (
        <div 
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Ảnh phóng to chi nhánh"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
