import { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { Product } from '../types.js';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Wine,
  Flame,
  AlertTriangle,
  Leaf
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const {
    t,
    formatPrice,
    addToCart,
    language
  } = useRestaurant();

  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  // Multilingual display
  const name = language === 'fr' && product.nameFr ? product.nameFr : language === 'ar' && product.nameAr ? product.nameAr : product.name;
  const description = language === 'fr' && product.descFr ? product.descFr : language === 'ar' && product.descAr ? product.descAr : product.description;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#081220] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-sm"
          aria-label={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 relative bg-slate-950 overflow-hidden h-64 md:h-auto min-h-[260px]">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081220] via-transparent to-transparent md:hidden" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-col gap-2">
            {product.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B774] text-[#050C17] text-[11px] font-bold tracking-wider uppercase shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span>{t.featuredBadge}</span>
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase backdrop-blur-md shadow-md ${
                product.available
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
              }`}
            >
              {product.available ? t.inStock : t.soldOut}
            </span>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left rtl:text-right">
          <div>
            {/* Category & Price */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C59A53]">
                {product.category}
              </span>
              <span className="font-display text-2xl font-bold text-[#E2B774]">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
              {name}
            </h2>

            {/* Description */}
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
              {description}
            </p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <Leaf className="w-3.5 h-3.5 text-[#E2B774]" />
                  <span>{t.ingredients}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-[#0F1E33] border border-slate-700/60 text-slate-300 text-[11px]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.allergens}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.allergens.map((all, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-600/30 text-amber-200 text-[10px]"
                    >
                      {all}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Wine Pairing */}
            {product.winePairing && (
              <div className="mb-4 p-3 rounded-xl bg-[#0D1B2D]/70 border border-slate-800 flex items-start gap-2.5">
                <Wine className="w-4 h-4 text-[#C59A53] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] font-semibold text-[#E2B774] uppercase tracking-wider">
                    {t.sommelierPairing}
                  </span>
                  <span className="text-xs text-slate-300">{product.winePairing}</span>
                </div>
              </div>
            )}

            {/* Calories */}
            {product.calories && (
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.calories}: <strong className="text-slate-200">{product.calories} kcal</strong></span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-800 mt-4">
            {product.available ? (
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl bg-[#060D17] border border-slate-700 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Order Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C59A53] to-[#E2B774] hover:brightness-110 text-[#050C17] text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#C59A53]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.addToOrder} • {formatPrice(product.price * quantity)}</span>
                </button>
              </div>
            ) : (
              <div className="p-3 text-center rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                {t.dishUnavailable}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
