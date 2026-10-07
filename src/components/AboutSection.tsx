import { useRestaurant } from '../context/RestaurantContext.js';
import { Sparkles, Anchor, Flame, Compass, Wine } from 'lucide-react';

export function AboutSection() {
  const { t, settings } = useRestaurant();

  const features = [
    {
      icon: Anchor,
      title: t.why1Title,
      desc: t.why1Desc
    },
    {
      icon: Flame,
      title: t.why2Title,
      desc: t.why2Desc
    },
    {
      icon: Compass,
      title: t.why3Title,
      desc: t.why3Desc
    },
    {
      icon: Wine,
      title: t.why4Title,
      desc: t.why4Desc
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#040810] text-[#E2E8F0] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#C59A53]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Text Column */}
          <div className="text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1A2C] border border-[#E2B774]/30 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.aboutBadge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t.aboutTitle}
            </h2>

            <p className="text-slate-300 text-base leading-relaxed mb-6 font-light">
              {settings?.aboutStory || t.aboutParagraph1}
            </p>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
              {t.aboutParagraph2}
            </p>

            {/* Chef signature quote */}
            <div className="p-6 rounded-2xl bg-[#081220] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#E2B774] shadow-xl">
              <p className="font-serif-luxury italic text-lg text-[#F3D7A4] mb-3">
                « Respect the ocean first. The salt, the cold, the ember — nothing should conceal the honest truth of the wild catch. »
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F2238] border border-slate-700 flex items-center justify-center font-display text-sm font-bold text-[#E2B774]">
                  AL
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white uppercase tracking-wider">
                    Chef Adrian Laurent
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    Chef Patron & Culinary Director
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Imagery Collage */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                alt="Star Fish Oceanfront Dining Ambiance"
                className="w-full h-[440px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlapping Card */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 rtl:-left-auto rtl:-right-8 w-64 p-5 rounded-2xl bg-[#081220]/95 border border-[#E2B774]/40 shadow-2xl backdrop-blur-xl">
              <span className="block font-display text-3xl font-bold text-[#E2B774] mb-1">
                25+ Years
              </span>
              <span className="block text-xs uppercase tracking-wider text-white font-medium mb-1">
                Artisanal Harbor Legacy
              </span>
              <p className="text-[11px] text-slate-400 font-light">
                Wild line-caught harvests directly sourced from certified sustainable coastal fisheries.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="pt-8 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="font-display text-2xl sm:text-4xl font-bold text-white mb-3">
              {t.whyChooseTitle}
            </h3>
            <p className="font-serif-luxury italic text-base text-[#C59A53]">
              Pure craftsmanship in every detail of the gastronomic journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#081220]/80 border border-slate-800/90 hover:border-[#E2B774]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left rtl:text-right"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0F2238] border border-slate-700/80 flex items-center justify-center text-[#E2B774] mb-5 shadow-inner">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-base font-semibold text-white mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
