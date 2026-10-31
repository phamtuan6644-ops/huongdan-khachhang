import React from 'react';
import { 
  Phone, 
  HelpCircle, 
  Smartphone, 
  Gamepad2, 
  PiggyBank, 
  Calculator, 
  Sparkles, 
  MapPin,
  Menu,
  X
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HelpCircle': return <HelpCircle className="w-4 h-4" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      case 'PiggyBank': return <PiggyBank className="w-4 h-4" />;
      case 'Calculator': return <Calculator className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'MapPin': return <MapPin className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Brand Logo Zone */}
          <div 
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            {!imageFailed ? (
              <img 
                src={contentData.brand.logo} 
                alt="VietinBank Logo" 
                onError={() => setImageFailed(true)}
                className="h-10 sm:h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-bold text-xl">
                  CTG
                </div>
                <div className="flex flex-col">
                  <span className="text-[#00529C] font-extrabold text-xl tracking-tight leading-none">VietinBank</span>
                  <span className="text-xs text-slate-500 font-medium">Nâng giá trị cuộc sống</span>
                </div>
              </div>
            )}
            <div className="hidden xl:block h-6 w-px bg-slate-200 mx-1" />
            <span className="hidden xl:inline-block text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Kiosk Tương Tác Quầy
            </span>
          </div>

          {/* Nav Links Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 overflow-x-auto py-1">
            {contentData.navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#00529C] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#00529C] hover:bg-slate-100'
                  }`}
                >
                  {getIcon(item.icon)}
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Zone: Hotline & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <a 
              href={`tel:${contentData.brand.hotline.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-red-50 text-[#ED1C24] hover:bg-red-100 border border-red-200/60 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
              title="Tổng đài chăm sóc khách hàng VietinBank"
            >
              <Phone className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span className="hidden sm:inline">Hotline:</span>
              <span>{contentData.brand.hotline}</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 pb-4 space-y-1 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {contentData.navigation.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#00529C] text-white'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {getIcon(item.icon)}
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
