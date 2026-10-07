import { useRestaurant } from '../context/RestaurantContext.js';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';

export function ContactSection() {
  const { t, settings } = useRestaurant();

  const phone = settings?.phone || '+1 (555) 382-7474';
  const email = settings?.email || 'reservations@starfish-restaurant.com';
  const address = settings?.address || '74 Marina Boulevard, Waterfront Promenade, Coastal Bay';
  const hours = settings?.openingHours || {
    lunch: '12:00 PM – 3:30 PM',
    dinner: '7:00 PM – 11:30 PM',
    days: 'Tuesday – Sunday (Closed Mondays)'
  };

  return (
    <section id="contact" className="py-24 bg-[#050C17] text-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1A2C] border border-[#E2B774]/30 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HAVEN ON THE WATERFRONT</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t.contactTitle}
          </h2>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-[#C59A53] max-w-2xl mx-auto">
            {t.contactSubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Contact Details Column */}
          <div className="space-y-6 flex flex-col justify-between text-left rtl:text-right">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#081220]/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C59A53] block mb-1">
                    {t.addressLabel}
                  </span>
                  <p className="text-white text-base font-medium mb-1">
                    {address}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.valetService}
                  </p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-[#081220]/90 border border-slate-800 hover:border-slate-700 transition-colors shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774] shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C59A53] block mb-1">
                    {t.hoursLabel}
                  </span>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>{t.hoursLunch}:</span>
                      <strong className="text-white font-mono">{hours.lunch}</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t.hoursDinner}:</span>
                      <strong className="text-white font-mono">{hours.dinner}</strong>
                    </div>
                    <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                      {hours.days}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#081220]/90 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C59A53] block">
                    {t.phoneLabel}
                  </span>
                  <a href={`tel:${phone}`} className="text-xs text-white hover:text-[#E2B774] font-medium transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#081220]/90 border border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0F2238] border border-slate-700 flex items-center justify-center text-[#E2B774] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C59A53] block">
                    {t.emailLabel}
                  </span>
                  <a href={`mailto:${email}`} className="text-xs text-white hover:text-[#E2B774] font-medium transition-colors truncate block max-w-[140px]">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Dress code advisory */}
            <div className="p-4 rounded-xl bg-[#0D1C2E]/60 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E2B774] shrink-0" />
              <span>{t.dressCode}</span>
            </div>
          </div>

          {/* Stylized Marine Map Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 bg-[#070F1B] shadow-2xl min-h-[380px] flex flex-col justify-between p-8">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#004A75]/30 rounded-full blur-3xl pointer-events-none" />

            {/* Stylized Map Coordinates Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#040810]/80 border border-slate-800 text-xs font-mono text-[#E2B774]">
                <Compass className="w-3.5 h-3.5" />
                <span>34.0259° N, 118.7798° W</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Port Marina Dock 04
              </span>
            </div>

            {/* Stylized Center Pin */}
            <div className="relative z-10 my-auto text-center flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-16 h-16 rounded-full bg-[#E2B774]/20 animate-ping" />
                <div className="w-14 h-14 rounded-2xl bg-[#0C1A2C] border-2 border-[#E2B774] text-[#E2B774] flex items-center justify-center shadow-2xl relative z-10">
                  <MapPin className="w-7 h-7 text-[#E2B774]" />
                </div>
              </div>
              <span className="font-display text-xl font-bold text-white mt-4 block">
                {settings?.name || 'STAR FISH'}
              </span>
              <span className="text-xs text-[#C59A53] font-light">
                Waterfront Promenade & Private Moorings
              </span>
            </div>

            {/* Bottom Map Note */}
            <div className="relative z-10 p-4 rounded-xl bg-[#040810]/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Private yachts mooring available at Pier B.</span>
              <span className="text-[#E2B774] font-medium">Concierge Channel VHF 68</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
