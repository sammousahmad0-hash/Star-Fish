import { useRestaurant } from '../context/RestaurantContext.js';
import { Waves, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, settings } = useRestaurant();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'hero', label: t.navHome },
    { id: 'menu', label: t.navMenu },
    { id: 'about', label: t.navAbout },
    { id: 'gallery', label: t.navGallery },
    { id: 'reservation', label: t.navReservation },
    { id: 'contact', label: t.navContact },
  ];

  return (
    <footer className="bg-[#03060C] text-[#E2E8F0] border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14 text-left rtl:text-right">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2B774] to-[#8C6321] p-[1px] shadow-lg">
                <div className="w-full h-full bg-[#081220] rounded-xl flex items-center justify-center">
                  <Waves className="w-5 h-5 text-[#E2B774]" />
                </div>
              </div>
              <div>
                <span className="font-display tracking-[0.2em] text-lg uppercase text-white font-bold block leading-none">
                  {settings?.name || 'STAR FISH'}
                </span>
                <span className="text-[10px] tracking-widest text-[#C59A53] uppercase font-light">
                  Haute Cuisine
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
              {settings?.description || t.heroDescription}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              <a
                href={settings?.socials.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#081220] border border-slate-800 text-slate-400 hover:text-[#E2B774] hover:border-[#E2B774]/50 flex items-center justify-center text-xs transition-colors"
                title="Instagram"
              >
                IG
              </a>
              <a
                href={settings?.socials.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#081220] border border-slate-800 text-slate-400 hover:text-[#E2B774] hover:border-[#E2B774]/50 flex items-center justify-center text-xs transition-colors"
                title="Facebook"
              >
                FB
              </a>
              <a
                href={settings?.socials.tripadvisor || 'https://tripadvisor.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#081220] border border-slate-800 text-slate-400 hover:text-[#E2B774] hover:border-[#E2B774]/50 flex items-center justify-center text-xs transition-colors"
                title="Tripadvisor"
              >
                TA
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59A53] mb-4 font-semibold">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map(link => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="text-slate-400 hover:text-[#E2B774] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59A53] mb-4 font-semibold">
              {t.contactInfo}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="leading-relaxed">
                {settings?.address}
              </p>
              <p>
                <a href={`tel:${settings?.phone}`} className="hover:text-white transition-colors">
                  {settings?.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors">
                  {settings?.email}
                </a>
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59A53] mb-4 font-semibold">
              {t.hoursLabel}
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <span className="text-white block font-medium">{t.hoursLunch}</span>
                <span>{settings?.openingHours.lunch}</span>
              </div>
              <div className="pt-1">
                <span className="text-white block font-medium">{t.hoursDinner}</span>
                <span>{settings?.openingHours.dinner}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                {settings?.openingHours.days}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings?.name || 'Star Fish'}. {t.footerRights}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-[#E2B774] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
