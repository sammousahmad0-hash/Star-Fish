import { useRestaurant } from '../context/RestaurantContext.js';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function Toasts() {
  const { toasts } = useRestaurant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#0E201B]/95 border-emerald-500/30 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-[#2A1116]/95 border-rose-500/30 text-rose-200'
              : 'bg-[#0F172A]/95 border-slate-700/60 text-slate-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#C59A53] shrink-0" />}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
