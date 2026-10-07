import { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { Language } from '../types.js';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const { language, setLanguage } = useRestaurant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; sub: string }[] = [
    { code: 'en', label: 'English', sub: 'EN' },
    { code: 'fr', label: 'Français', sub: 'FR' },
    { code: 'ar', label: 'العربية', sub: 'AR' },
  ];

  const current = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium cursor-pointer ${
          variant === 'minimal'
            ? 'bg-transparent border-slate-700/60 text-slate-300 hover:text-white hover:border-[#C59A53]/50'
            : 'bg-[#0B1524]/80 border-slate-700/80 text-slate-200 hover:border-[#C59A53] hover:text-[#E2B774]'
        }`}
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-[#C59A53]" />
        <span>{current.sub}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 rounded-xl bg-[#09121F] border border-slate-700/80 shadow-2xl py-1 z-50 backdrop-blur-xl">
          {languages.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                language === l.code
                  ? 'bg-[#C59A53]/15 text-[#E2B774] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>{l.label}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">{l.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
