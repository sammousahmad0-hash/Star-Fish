import { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext.js';
import type { GalleryItem } from '../types.js';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function GallerySection() {
  const { t, gallery, language } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['all', 'Cuisine', 'Ambience', 'Artistry'];

  const filteredGallery = gallery.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#050C17] text-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C1A2C] border border-[#E2B774]/30 text-[#E2B774] text-xs font-semibold tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L’ATMOSPHÈRE & LES CRÉATIONS</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t.galleryTitle}
          </h2>

          <p className="font-serif-luxury italic text-lg sm:text-xl text-[#C59A53] max-w-2xl mx-auto">
            {t.gallerySubtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#E2B774] text-[#050C17] shadow-lg shadow-[#E2B774]/20'
                  : 'bg-[#081220] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? t.all : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, index) => {
            const title = language === 'fr' && item.titleFr ? item.titleFr : language === 'ar' && item.titleAr ? item.titleAr : item.title;

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer bg-slate-950 border border-slate-800 hover:border-[#E2B774]/60 transition-all duration-300 shadow-xl"
              >
                <img
                  src={item.url}
                  alt={title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#040810]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-left rtl:text-right">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C59A53] block mb-1">
                      {item.category}
                    </span>
                    <h4 className="font-display text-base font-semibold text-white group-hover:text-[#F3D7A4] transition-colors leading-snug">
                      {title}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#081220]/80 border border-slate-700 flex items-center justify-center text-[#E2B774] group-hover:bg-[#E2B774] group-hover:text-[#040810] transition-colors shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 rtl:right-auto rtl:left-6 text-slate-400 hover:text-white p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors cursor-pointer z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredGallery[lightboxIndex].url}
              alt={filteredGallery[lightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-2xl object-contain"
            />
            <div className="mt-4 text-center">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C59A53] block">
                {filteredGallery[lightboxIndex].category}
              </span>
              <h3 className="font-display text-xl font-semibold text-white mt-1">
                {language === 'fr' && filteredGallery[lightboxIndex].titleFr
                  ? filteredGallery[lightboxIndex].titleFr
                  : language === 'ar' && filteredGallery[lightboxIndex].titleAr
                  ? filteredGallery[lightboxIndex].titleAr
                  : filteredGallery[lightboxIndex].title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
