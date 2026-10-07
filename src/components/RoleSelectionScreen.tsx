import { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import { LanguageSelector } from './LanguageSelector.js';
import { CurrencySelector } from './CurrencySelector.js';
import { ManagerAuthModal } from './manager/ManagerAuthModal.js';
import { Waves, Sparkles, Utensils, ShieldCheck, ArrowRight, Compass } from 'lucide-react';

export function RoleSelectionScreen() {
  const {
    t,
    setCurrentView,
    isManagerAuthenticated,
    settings,
    isRtl
  } = useRestaurant();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleManagerClick = () => {
    if (isManagerAuthenticated) {
      setCurrentView('manager');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#040810] text-[#E2E8F0] relative overflow-hidden flex flex-col justify-between selection:bg-[#E2B774] selection:text-[#040810]">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#003B5C]/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-[#C59A53]/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#0B2545]/30 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#040810_85%)]" />
      </div>

      {/* Top Header Bar in Role Selection */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2B774] to-[#996D28] p-[1px] shadow-lg shadow-[#E2B774]/10">
            <div className="w-full h-full bg-[#07111E] rounded-xl flex items-center justify-center">
              <Waves className="w-5 h-5 text-[#E2B774]" />
            </div>
          </div>
          <div>
            <span className="font-display tracking-[0.25em] text-sm uppercase text-white font-bold block">
              {settings?.name || 'STAR FISH'}
            </span>
            <span className="text-[10px] tracking-widest text-[#C59A53] uppercase font-light">
              Haute Cuisine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CurrencySelector variant="badge" />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Emblem & Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1C2E]/80 border border-[#E2B774]/30 text-[#E2B774] text-xs font-medium mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-widest uppercase text-[11px]">
            {t.heroBadge}
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-tight">
          {settings?.name || 'STAR FISH'}
        </h1>

        <p className="font-serif-luxury italic text-xl sm:text-2xl text-[#C59A53] max-w-2xl mx-auto mb-3">
          « {settings?.tagline || t.tagline} »
        </p>

        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-12 font-light">
          {t.roleSubtitle}
        </p>

        {/* Two Large Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* CLIENT CARD */}
          <div
            onClick={() => setCurrentView('client')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentView('client')}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0B1728]/90 to-[#070F1B]/95 border border-slate-800 hover:border-[#E2B774]/70 p-8 sm:p-10 text-left rtl:text-right transition-all duration-300 hover:shadow-2xl hover:shadow-[#E2B774]/10 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity">
              <Compass className="w-24 h-24 text-[#E2B774]" />
            </div>

            <div>
              <div className="w-14 h-14 rounded-xl bg-[#0F2238] border border-slate-700/80 group-hover:border-[#E2B774] flex items-center justify-center text-[#E2B774] mb-6 transition-colors shadow-lg">
                <Utensils className="w-7 h-7" />
              </div>

              <span className="text-xs font-mono font-semibold tracking-[0.2em] text-[#C59A53] uppercase block mb-1">
                {t.clientCardTitle}
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3 group-hover:text-[#F3D7A4] transition-colors">
                {t.clientCardSubtitle}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                {t.clientCardDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[#E2B774] font-medium text-sm group-hover:text-white transition-colors">
              <span>{t.clientCardBtn}</span>
              <div className="w-8 h-8 rounded-full bg-[#13273F] flex items-center justify-center group-hover:bg-[#E2B774] group-hover:text-[#040810] transition-colors">
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </div>
            </div>
          </div>

          {/* MANAGER CARD */}
          <div
            onClick={handleManagerClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleManagerClick()}
            className="group relative cursor-pointer rounded-2xl bg-gradient-to-b from-[#0E1624]/90 to-[#070D18]/95 border border-slate-800 hover:border-[#4B88BD]/70 p-8 sm:p-10 text-left rtl:text-right transition-all duration-300 hover:shadow-2xl hover:shadow-[#4B88BD]/10 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-6 opacity-10 group-hover:opacity-25 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-[#60A5FA]" />
            </div>

            <div>
              <div className="w-14 h-14 rounded-xl bg-[#11243A] border border-slate-700/80 group-hover:border-[#60A5FA] flex items-center justify-center text-[#60A5FA] mb-6 transition-colors shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <span className="text-xs font-mono font-semibold tracking-[0.2em] text-[#60A5FA] uppercase block mb-1">
                {t.managerCardTitle}
              </span>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3 group-hover:text-[#93C5FD] transition-colors">
                {t.managerCardSubtitle}
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                {t.managerCardDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-[#60A5FA] font-medium text-sm group-hover:text-white transition-colors">
              <span>{t.managerCardBtn}</span>
              <div className="w-8 h-8 rounded-full bg-[#13273F] flex items-center justify-center group-hover:bg-[#60A5FA] group-hover:text-[#040810] transition-colors">
                <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Luxury Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 font-light">
        <p>
          © {new Date().getFullYear()} {settings?.name || 'Star Fish'}. {t.footerRights}
        </p>
      </footer>

      {/* Manager Authentication Modal */}
      {showAuthModal && (
        <ManagerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setCurrentView('manager');
          }}
        />
      )}
    </div>
  );
}
