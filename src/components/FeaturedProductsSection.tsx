import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  PhoneCall, 
  Eye, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const FeaturedProductsSection: React.FC = () => {
  const { featuredProducts } = contentData;
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [interestModalItem, setInterestModalItem] = useState<any | null>(null);
  const [zoomedPoster, setZoomedPoster] = useState<string | null>(null);

  // Filter items
  const filteredItems = activeCategory === 'Tất cả'
    ? featuredProducts.items
    : featuredProducts.items.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#00529C] via-[#003B73] to-[#002D54] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Nổi bật tại Chi nhánh</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {featuredProducts.title}
          </h2>
          <p className="text-base text-blue-100 font-medium">
            {featuredProducts.description}
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Danh mục:</span>
        </span>
        {featuredProducts.categories.map((category) => {
          const isSelected = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#00529C] text-white shadow-xs scale-102'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Products Showcase Grid / Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-400 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Poster Image Container */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.img-fallback')) {
                      const fb = document.createElement('div');
                      fb.className = 'img-fallback p-6 text-center text-slate-400 flex flex-col items-center justify-center';
                      fb.innerHTML = `<div class="w-12 h-12 rounded-full bg-blue-100 text-[#00529C] flex items-center justify-center mb-2 font-bold">${item.name.charAt(0)}</div><p class="text-xs font-semibold text-slate-600">${item.name}</p>`;
                      parent.appendChild(fb);
                    }
                  }}
                />

                {/* Badge Category */}
                <div className="absolute top-3 left-3 bg-[#00529C]/90 backdrop-blur-xs text-white text-2xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                  {item.category}
                </div>

                {/* Quick Zoom Action */}
                <button
                  onClick={() => setZoomedPoster(item.image)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#00529C] shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Xem phóng to poster"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Item Info */}
              <div className="p-5 sm:p-6 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00529C] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.highlight}
                </p>
              </div>
            </div>

            {/* CTA Button: "Tôi quan tâm" */}
            <div className="p-5 sm:p-6 pt-0">
              <button
                onClick={() => setInterestModalItem(item)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00529C] to-[#003B73] hover:from-[#003B73] hover:to-[#002D54] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Tôi quan tâm</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Consultant Support Footer Box */}
      <div className="bg-red-50/60 border border-red-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ED1C24] text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Liên hệ tư vấn viên chuyên trách Chi nhánh
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Chuyên viên {featuredProducts.consultant.name} – SĐT: <strong>{featuredProducts.consultant.phone}</strong>
            </p>
          </div>
        </div>
        <a
          href={`tel:${featuredProducts.consultant.phone}`}
          className="px-6 py-3 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs flex items-center gap-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Gọi ngay {featuredProducts.consultant.phone}</span>
        </a>
      </div>

      {/* Modal: "Tôi quan tâm" Customer Contact Dialog */}
      {interestModalItem && (
        <div 
          onClick={() => setInterestModalItem(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5 animate-in zoom-in-95 duration-150"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#00529C] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-slate-400">
                {interestModalItem.category}
              </span>
              <h3 className="text-xl font-black text-slate-900">
                {interestModalItem.name}
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed text-left whitespace-pre-line">
                {featuredProducts.modalMessage}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`tel:${featuredProducts.consultant.phone}`}
                className="w-full py-3.5 px-4 bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Chuyên viên Lê Hoàng Hiệp ({featuredProducts.consultant.phone})</span>
              </a>

              <button
                onClick={() => setInterestModalItem(null)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Poster Zoom Modal */}
      {zoomedPoster && (
        <div 
          onClick={() => setZoomedPoster(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedPoster(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedPoster}
              alt="Poster phóng to"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
