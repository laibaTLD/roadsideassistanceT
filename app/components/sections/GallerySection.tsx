'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { Maximize2, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GallerySectionProps {
  gallerySection: Page['gallerySection'];
  className?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallerySection, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!gallerySection?.enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      gsap.fromTo('.gallery-item',
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.gallery-grid', start: 'top 75%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [gallerySection]);

  if (!gallerySection?.enabled || !gallerySection.images || gallerySection.images.length === 0) return null;

  const images = useMemo(() => {
    return (gallerySection.images || []).map((image: any, index: number) => {
      const imageUrl = typeof image === 'string' ? image : image?.url;
      const altText = typeof image === 'object' ? image?.altText : '';
      const caption = typeof image === 'object' ? image?.caption : '';
      return {
        key: `${imageUrl}-${index}`,
        imageUrl,
        altText,
        caption,
      };
    }).filter(img => img.imageUrl);
  }, [gallerySection.images]);

  if (images.length === 0) return null;

  const bgColor = themeColors.pageBackground;
  const primaryColor = themeColors.primaryButton;
  const mainText = themeColors.mainText;
  const secondaryText = themeColors.secondaryText;

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={cn('relative w-full py-24 md:py-32 lg:py-40 overflow-hidden', className)}
        style={{ backgroundColor: bgColor }}
      >
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
          {/* Header */}
          <div className="gallery-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
            <div className="max-w-2xl">
              {gallerySection.title && (
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] mb-4"
                  style={{ fontFamily: themeFonts.heading, color: mainText }}
                >
                  <TiptapRenderer content={gallerySection.title} as="inline" />
                </h2>
              )}
              {gallerySection.description && (
                <p
                  className="text-sm md:text-base leading-relaxed max-w-lg"
                  style={{ fontFamily: themeFonts.body, color: secondaryText }}
                >
                  <TiptapRenderer content={gallerySection.description} as="inline" />
                </p>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <div className="w-24 h-[1px]" style={{ backgroundColor: `${primaryColor}40` }} />
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-medium"
                style={{ fontFamily: themeFonts.body, color: secondaryText }}
              >
                Gallery
              </span>
            </div>
          </div>

          {/* Masonry-style Grid */}
          <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {images.map((img, idx) => {
              const isLarge = idx === 0 || (idx > 0 && idx % 5 === 0);
              const isWide = idx === 2 || (idx > 0 && idx % 7 === 0);

              let spanClass = 'col-span-1 row-span-1';
              if (isLarge && idx === 0) {
                spanClass = 'col-span-2 md:col-span-2 lg:col-span-2 row-span-2';
              } else if (isWide) {
                spanClass = 'col-span-2 md:col-span-2 row-span-1';
              }

              return (
                <div
                  key={img.key}
                  className={cn(
                    'gallery-item relative overflow-hidden rounded-xl md:rounded-2xl group cursor-pointer',
                    spanClass
                  )}
                  onClick={() => openLightbox(img.imageUrl)}
                >
                  <div className={cn(
                    'relative w-full h-full',
                    isLarge && idx === 0 ? 'aspect-square md:aspect-auto md:min-h-[500px] lg:min-h-[600px]' :
                    isWide ? 'aspect-[16/9]' : 'aspect-square'
                  )}>
                    <img
                      src={getImageSrc(img.imageUrl)}
                      alt={img.altText || ''}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                    />

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to top, ${primaryColor}80 0%, transparent 60%)`
                      }}
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {img.caption && (
                        <p
                          className="text-sm md:text-base font-light mb-2"
                          style={{ fontFamily: themeFonts.body, color: 'white' }}
                        >
                          {img.caption}
                        </p>
                      )}
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{ backgroundColor: `${primaryColor}30` }}
                      >
                        <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 border-2 border-transparent group-hover:opacity-100 transition-all duration-500 rounded-xl md:rounded-2xl"
                      style={{ borderColor: `${primaryColor}40` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ backgroundColor: `${bgColor}F0` }}
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            style={{ backgroundColor: primaryColor }}
            onClick={closeLightbox}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageSrc(lightboxImage)}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GallerySection;
