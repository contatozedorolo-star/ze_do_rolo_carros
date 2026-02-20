import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "./ui/button";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface BentoGalleryProps {
  images: Array<{
    id: string;
    image_url: string;
    image_type: string;
  }>;
  title: string;
}

const BentoGallery = ({ images, title }: BentoGalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se não houver imagens, não renderiza nada
  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Bento Grid Layout - Desktop: 1 Grande (Esq) + 4 Pequenas (Dir) / Mobile: Scroll Snap */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 md:h-[500px]">
          
          {/* Main Hero Image - Ocupa 2 colunas e 2 linhas (metade esquerda) */}
          <div 
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer h-[300px] md:h-full overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <img 
              src={getOptimizedImageUrl(images[0].image_url, { width: 800, height: 500 })} 
              alt={`${title} - Principal`} 
              width={800}
              height={500}
              loading="eager"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {...({ fetchpriority: "high" } as any)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" size={32} />
            </div>
          </div>

          {/* Grid de Imagens Menores (Direita) */}
          <div className="hidden md:grid md:col-span-2 md:row-span-2 grid-cols-2 grid-rows-2 gap-1 h-full">
            {images.slice(1, 5).map((img, idx) => (
              <div 
                key={img.id} 
                className="relative group cursor-pointer overflow-hidden h-full"
                onClick={() => openLightbox(idx + 1)}
              >
                <img 
                  src={getOptimizedImageUrl(img.image_url, { width: 400, height: 250 })} 
                  alt={`${title} - ${idx + 2}`} 
                  width={400}
                  height={250}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay na última imagem se houver mais fotos */}
                {idx === 3 && images.length > 5 && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-[2px]">
                      +{images.length - 5}
                   </div>
                )}
              </div>
            ))}
            
            {/* Fallback se tiver menos de 5 imagens - Preenche com placeholder ou repete padrão */}
            {images.length < 5 && Array.from({ length: 5 - images.length }).map((_, i) => (
               <div key={`placeholder-${i}`} className="bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-300 text-sm">Sem foto</span>
               </div>
            ))}
          </div>
          
          {/* Mobile Gallery (Scroll Horizontal) - Mostra se não for desktop */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-1 pb-2">
            {images.slice(1).map((img, idx) => (
              <div 
                key={img.id} 
                className="snap-center shrink-0 w-[85vw] h-[250px] relative rounded-lg overflow-hidden ml-1 first:ml-4 last:mr-4"
                onClick={() => openLightbox(idx + 1)}
              >
                  <img 
                    src={getOptimizedImageUrl(img.image_url, { width: 400, height: 250 })} 
                    alt={`${title} - ${idx + 2}`} 
                    width={400}
                    height={250}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-sm"
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50"
            >
              <X size={32} />
            </button>

            {/* Navigation Left */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 text-white/50 hover:text-white p-2 hidden md:block"
            >
              <ChevronLeft size={48} />
            </button>

            {/* Image Container */}
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-[90vw] max-h-[85vh] relative"
            >
              <img 
                src={getOptimizedImageUrl(images[currentIndex].image_url, { width: 1200, quality: 90 })} 
                alt={`${title} - Fullscreen`} 
                className="max-w-full max-h-[85vh] object-contain rounded-sm"
              />
              <p className="text-center text-white/60 mt-4 text-sm font-medium uppercase tracking-widest">
                {currentIndex + 1} / {images.length}
              </p>
            </motion.div>

            {/* Navigation Right */}
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 text-white/50 hover:text-white p-2 hidden md:block"
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BentoGallery;
