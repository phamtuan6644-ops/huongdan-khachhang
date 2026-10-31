/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroKioskBanner } from './components/HeroKioskBanner';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GameCenterSection } from './components/GameCenterSection';
import { SavingsCalculatorSection } from './components/SavingsCalculatorSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { BranchesSection } from './components/BranchesSection';
import { Footer } from './components/Footer';

export default function App() {
  // Active feature tab: 'home' | 'faq' | 'download-app' | 'game' | 'savings' | 'loan' | 'products' | 'branches'
  const [activeTab, setActiveTab] = useState<string>('faq');
  const [showHero, setShowHero] = useState<boolean>(true);

  const handleSelectFeature = (featureId: string) => {
    setActiveTab(featureId);
    setShowHero(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setShowHero(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans selection:bg-[#00529C] selection:text-white">
      {/* Kiosk Top Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleNavClick} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Kiosk Welcome Banner (Collapsible / toggleable) */}
        {showHero ? (
          <HeroKioskBanner onSelectFeature={handleSelectFeature} />
        ) : (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setShowHero(true)}
              className="text-xs font-bold text-[#00529C] hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
            >
              <span>← Hiển thị lại màn hình Chào mừng Kiosk</span>
            </button>
            <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">
              VietinBank Kiosk Counter
            </span>
          </div>
        )}

        {/* Dynamic Feature Views */}
        <section className="transition-all duration-200">
          {activeTab === 'faq' && <FaqSection onNavigateHome={() => setShowHero(true)} />}
          {activeTab === 'download-app' && <AppDownloadSection />}
          {activeTab === 'game' && <GameCenterSection />}
          {activeTab === 'savings' && <SavingsCalculatorSection />}
          {activeTab === 'loan' && <LoanCalculatorSection />}
          {activeTab === 'products' && <FeaturedProductsSection />}
          {activeTab === 'branches' && <BranchesSection />}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
