import { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import { LanguageSelector } from './LanguageSelector.js';
import { CurrencySelector } from './CurrencySelector.js';
import { ManagerAuthModal } from './manager/ManagerAuthModal.js';
import {
  Waves,
  ShoppingBag,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Header({ onOpenCart, activeSection, onNavigate }: HeaderProps) {
  const {
    t,
    settings,
    cartCount,
    isManagerAuthenticated,
    managerUsername,
    setCurrentView,
    isRtl
  } = useRestaurant();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: t.navHome },
    { id: 'menu', label: t.navMenu },
    { id: 'about', label: t.navAbout },
    { id: 'gallery', label: t.navGallery },
    { id: 'reservation', label: t.navReservation },
    { id: 'contact', label: t.navContact },
  ];

  const handleManagerPortalClick = () => {
    if (isManagerAuthenticated) {
      setCurrentView('manager');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      {/* Top Session Banner for Authenticated Manager browsing Client section */}
      {isManagerAuthenticated && (
        <div className="bg-gradient-to-r from-[#0F2238] via-[#152E4D] to-[#0F2238] border-b border-[#60A5FA]/30 py-1.5 px-4 text-xs text-[#93C5FD] flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {t.loggedAs} <strong className="text-white">{managerUsername || 'Manager'}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('manager')}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-medium text-[11px] transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.switchToManager}</span>
            <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

      {/* Main Glass Header */}
      <header
        className={`sticky ${isManagerAuthenticated ? 'top-[33px]' : 'top-0'} z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050C17]/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3.5'
            : 'bg-[#050C17]/60 backdrop-blur-sm border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E2B774] to-[#8C6321] p-[1px] shadow-lg shadow-[#E2B774]/10 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#081220] rounded-xl flex items-center justify-center">
                <Waves className="w-5 h-5 text-[#E2B774]" />
              </div>
            </div>
            <div>
              <span className="font-display tracking-[0.22em] text-base sm:text-lg uppercase text-white font-bold block leading-none">
                {settings?.name || 'STAR FISH'}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#C59A53] uppercase font-light">
                Haute Cuisine de la Mer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer relative py-1 ${
                  activeSection === item.id
                    ? 'text-[#E2B774]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E2B774] rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Badge */}
            <CurrencySelector variant="badge" />

            {/* Language Switcher */}
            <LanguageSelector variant="minimal" />

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-[#0B1626]/80 border border-slate-700/80 text-slate-200 hover:text-[#E2B774] hover:border-[#E2B774]/60 transition-all cursor-pointer"
              title={t.cart}
              aria-label={t.cart}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 rtl:right-auto rtl:-left-1.5 w-5 h-5 rounded-full bg-[#E2B774] text-[#050C17] text-[10px] font-bold flex items-center justify-center shadow-md animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Manager Switcher Button */}
            <button
              type="button"
              onClick={handleManagerPortalClick}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#172554] to-[#1E3A8A] hover:from-[#1E3A8A] hover:to-[#2563EB] border border-blue-500/30 text-blue-100 text-xs font-semibold tracking-wide shadow-md transition-all cursor-pointer hover:shadow-blue-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>{t.switchToManager}</span>
            </button>

            {/* Role Screen Return Button */}
            <button
              type="button"
              onClick={() => setCurrentView('role-selection')}
              className="hidden md:inline-flex items-center p-2 rounded-xl bg-[#0B1626]/60 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Role Selection"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0B1626] border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#07111E]/95 border-b border-slate-800 px-6 py-6 space-y-4 backdrop-blur-xl animate-fade-in">
            <div className="flex flex-col gap-3">
              {navItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left rtl:text-right py-2 text-sm tracking-widest uppercase font-medium border-b border-slate-800/60 ${
                    activeSection === item.id ? 'text-[#E2B774]' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleManagerPortalClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.switchToManager}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('role-selection');
                }}
                className="w-full py-2 px-4 rounded-xl bg-slate-800/60 text-slate-300 text-xs font-medium flex items-center justify-center gap-2"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Switch Role</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal Triggered from Header */}
      {authModalOpen && (
        <ManagerAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setAuthModalOpen(false);
            setCurrentView('manager');
          }}
        />
      )}
    </>
  );
}
