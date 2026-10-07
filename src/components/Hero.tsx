import { useRestaurant } from '../context/RestaurantContext.js';
import { Sparkles, Utensils, CalendarDays, Phone, Anchor, Award, Wine, ArrowDown } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { t, settings } = useRestaurant();

  const heroImage = settings?.heroImage || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80';

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image with Deep Marine Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Star Fish Haute Cuisine Seafood Platter"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse motion-safe:duration-[10000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050C17] via-[#050C17]/85 to-[#050C17]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_10%,#050C17_90%)]" />
      </div>

      {/* Decorative Sea Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[42rem] h-[26rem] bg-[#004A75]/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Prestige Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C1A2C]/90 border border-[#E2B774]/40 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-6 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E2B774]" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-xl max-w-4xl">
          {t.heroTitle}
        </h1>

        {/* Tagline / Subtitle */}
        <p className="font-serif-luxury italic text-xl sm:text-2xl md:text-3xl text-[#C59A53] mb-6 max-w-2xl">
          « {settings?.tagline || t.tagline} »
        </p>

        {/* Narrative Description */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mb-10 font-light leading-relaxed drop-shadow-md">
          {settings?.description || t.heroDescription}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 mb-16">
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#C59A53] via-[#E2B774] to-[#B3873F] text-[#050C17] font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-[#C59A53]/20 hover:shadow-[#C59A53]/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>{t.heroExploreMenu}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reservation')}
            className="px-7 py-3.5 rounded-xl bg-[#091526]/90 hover:bg-[#0E2038] border border-[#E2B774]/50 hover:border-[#E2B774] text-white font-semibold text-xs uppercase tracking-widest shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-[#E2B774]" />
            <span>{t.heroMakeReservation}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/80 text-slate-300 hover:text-white font-medium text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{t.heroContactUs}</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-xl bg-[#081220]/60 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774]">
              <Anchor className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                {t.statFreshCatch}
              </span>
              <span className="block text-[11px] text-slate-400 font-light">
                {t.statFreshCatchDesc}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-xl bg-[#081220]/60 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774]">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                {t.statAward}
              </span>
              <span className="block text-[11px] text-slate-400 font-light">
                {t.statAwardDesc}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-xl bg-[#081220]/60 border border-slate-800/60 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774]">
              <Wine className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                {t.statCellar}
              </span>
              <span className="block text-[11px] text-slate-400 font-light">
                {t.statCellarDesc}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 text-slate-500 hover:text-[#E2B774] transition-colors cursor-pointer animate-bounce" onClick={() => onNavigate('menu')}>
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}
