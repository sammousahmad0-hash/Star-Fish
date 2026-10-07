import { useState, useRef, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { CurrencyCode } from '../types.js';
import { Coins, ChevronDown } from 'lucide-react';

export function CurrencySelector({
  allowChange = false,
  variant = 'default'
}: {
  allowChange?: boolean;
  variant?: 'default' | 'minimal' | 'badge';
}) {
  const { currency, settings, updateSettings, t } = useRestaurant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'USD', label: 'USD', symbol: '$' },
    { code: 'EUR', label: 'EUR', symbol: '€' },
    { code: 'MAD', label: 'MAD', symbol: 'د.م.' },
  ];

  const current = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (code: CurrencyCode) => {
    setIsOpen(false);
    if (allowChange) {
      await updateSettings({ currency: code });
    }
  };

  if (variant === 'badge' && !allowChange) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1A2C]/70 border border-slate-700/60 text-xs font-medium text-slate-300">
        <span className="text-[#C59A53] font-semibold">{current.symbol}</span>
        <span className="text-[11px] font-mono tracking-wide">{current.code}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={!allowChange}
        onClick={() => allowChange && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
          !allowChange
            ? 'bg-[#0B1524]/60 border-slate-800 text-slate-300 cursor-default'
            : variant === 'minimal'
            ? 'bg-transparent border-slate-700/60 text-slate-300 hover:text-white hover:border-[#C59A53]/50 cursor-pointer'
            : 'bg-[#0B1524]/80 border-slate-700/80 text-slate-200 hover:border-[#C59A53] hover:text-[#E2B774] cursor-pointer'
        }`}
        title={allowChange ? t.activeCurrency : `${t.activeCurrency}: ${current.code}`}
      >
        <Coins className="w-3.5 h-3.5 text-[#C59A53]" />
        <span className="font-semibold text-[#E2B774]">{current.symbol}</span>
        <span className="font-mono">{current.code}</span>
        {allowChange && (
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && allowChange && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 rounded-xl bg-[#09121F] border border-slate-700/80 shadow-2xl py-1 z-50 backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
            {t.activeCurrency}
          </div>
          {currencies.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleSelect(c.code)}
              className={`w-full text-left rtl:text-right px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                currency === c.code
                  ? 'bg-[#C59A53]/15 text-[#E2B774] font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[#C59A53] font-bold w-4 text-center">{c.symbol}</span>
                <span>{c.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {c.code === 'USD' ? '$1.00' : c.code === 'EUR' ? `€${settings?.currencyRates.EUR || 0.92}` : `${settings?.currencyRates.MAD || 10.0} د.م.`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
