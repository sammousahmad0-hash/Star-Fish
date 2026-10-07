import { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { Product } from '../types.js';
import { ProductDetailModal } from './ProductDetailModal.js';
import {
  Sparkles,
  Search,
  ShoppingBag,
  Eye,
  Filter
} from 'lucide-react';

export function MenuSection() {
  const {
    t,
    products,
    categories,
    formatPrice,
    addToCart,
    language
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active enabled categories sorted
  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter(c => c.enabled !== false)
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Featured filter
      if (onlyFeatured && !p.featured) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query) ||
          (p.nameFr && p.nameFr.toLowerCase().includes(query)) ||
          (p.nameAr && p.nameAr.toLowerCase().includes(query));
        const matchDesc = p.description.toLowerCase().includes(query) ||
          (p.descFr && p.descFr.toLowerCase().includes(query)) ||
          (p.descAr && p.descAr.toLowerCase().includes(query));
        return matchName || matchDesc;
      }
      return true;
    });
  }, [products, selectedCategory, onlyFeatured, searchQuery]);

  return (
    <section id="menu" className="py-24 bg-[#050C17] text-[#E2E8F0] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#004A75]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C59A53]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1A2C] border border-[#E2B774]/30 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LA CARTE GASTRONOMIQUE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t.menuTitle}
          </h2>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-[#C59A53] max-w-2xl mx-auto">
            {t.menuSubtitle}
          </p>
        </div>

        {/* Search & Featured Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute inset-y-0 left-3.5 rtl:left-auto rtl:right-3.5 my-auto text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 rounded-xl bg-[#081220] border border-slate-700/80 focus:border-[#E2B774] focus:ring-1 focus:ring-[#E2B774] text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Featured Filter Toggle */}
          <button
            type="button"
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              onlyFeatured
                ? 'bg-[#E2B774] text-[#050C17] border-[#E2B774] shadow-md shadow-[#E2B774]/20'
                : 'bg-[#081220] text-slate-300 border-slate-700/80 hover:border-slate-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.featuredBadge}</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#C59A53] to-[#E2B774] text-[#050C17] shadow-lg shadow-[#C59A53]/25 scale-105'
                : 'bg-[#081220] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {t.filterAll}
          </button>

          {sortedCategories.map(cat => {
            const catLabel = language === 'fr' ? cat.nameFr : language === 'ar' ? cat.nameAr : cat.name;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#C59A53] to-[#E2B774] text-[#050C17] shadow-lg shadow-[#C59A53]/25 scale-105'
                    : 'bg-[#081220] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#081220]/50 border border-slate-800/80 max-w-lg mx-auto">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">{t.noProductsFound}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map(product => {
              const name = language === 'fr' && product.nameFr ? product.nameFr : language === 'ar' && product.nameAr ? product.nameAr : product.name;
              const description = language === 'fr' && product.descFr ? product.descFr : language === 'ar' && product.descAr ? product.descAr : product.description;

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl bg-[#081220]/90 border border-slate-800/90 hover:border-[#E2B774]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#003B5C]/20 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  {/* Dish Thumbnail */}
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative h-56 sm:h-60 w-full overflow-hidden cursor-pointer bg-slate-950"
                  >
                    <img
                      src={product.image}
                      alt={name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081220] via-transparent to-transparent opacity-90" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10">
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2B774] text-[#050C17] text-[10px] font-bold uppercase tracking-wider shadow-md">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{t.featuredBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase backdrop-blur-md ${
                          product.available
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {product.available ? t.inStock : t.soldOut}
                      </span>
                    </div>

                    {/* Hover Quick View Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081220]/90 border border-[#E2B774]/70 text-[#E2B774] text-xs font-semibold shadow-xl">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t.viewDetails}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-left rtl:text-right">
                    <div>
                      {/* Category & Price */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C59A53]">
                          {product.category}
                        </span>
                        <span className="font-display text-xl font-bold text-[#E2B774]">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedProduct(product)}
                        className="font-display text-lg sm:text-xl font-semibold text-white mb-2 leading-snug group-hover:text-[#F3D7A4] transition-colors cursor-pointer"
                      >
                        {name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 font-light">
                        {description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C59A53]" />
                        <span>{t.viewDetails}</span>
                      </button>

                      {product.available ? (
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0F2238] hover:bg-[#E2B774] hover:text-[#050C17] border border-slate-700/80 hover:border-[#E2B774] text-[#E2B774] text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{t.addToOrder}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">
                          {t.soldOut}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
