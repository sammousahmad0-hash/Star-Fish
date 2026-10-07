import { useRestaurant } from '../context/RestaurantContext.js';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CalendarDays,
  ArrowRight
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReservation: () => void;
}

export function CartDrawer({ isOpen, onClose, onGoToReservation }: CartDrawerProps) {
  const {
    t,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    language,
    isRtl
  } = useRestaurant();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    onGoToReservation();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#081220] border-l rtl:border-l-0 rtl:border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E2B774]" />
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              {t.cartTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-light">{t.cartEmpty}</p>
            </div>
          ) : (
            cart.map(item => {
              const name = language === 'fr' && item.product.nameFr ? item.product.nameFr : language === 'ar' && item.product.nameAr ? item.product.nameAr : item.product.name;

              return (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#040810] border border-slate-800/80"
                >
                  <img
                    src={item.product.image}
                    alt={name}
                    className="w-16 h-16 rounded-lg object-cover object-center shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-left rtl:text-right">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {name}
                    </h4>
                    <span className="text-xs font-mono text-[#E2B774] block mt-0.5">
                      {formatPrice(item.product.price)}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded-lg bg-[#0A1626] border border-slate-700/80 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left shrink-0">
                    <span className="font-mono text-sm font-bold text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{t.cartTotal}</span>
              <span className="font-display text-2xl font-bold text-[#E2B774]">
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              {t.cartNote}
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C59A53] via-[#E2B774] to-[#B3873F] text-[#050C17] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-xl shadow-[#C59A53]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              <span>{t.cartCheckout}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
