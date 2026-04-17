'use client';

import React, { useEffect, useRef, useMemo, memo } from 'react';
import Link from 'next/link';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { ArrowRight } from 'lucide-react';

export const CTA: React.FC<{ cta: any; className?: string }> = memo(({ cta, className }) => {
  const safeCta = cta ?? { enabled: false };
  const sectionRef = useRef<HTMLElement>(null);
  const isVisibleRef = useRef(false);
  const themeColors = useThemeColors();

  // Memoize theme colors to prevent recalculation
  const colors = useMemo(() => ({
    bg: themeColors.pageBackground,
    primary: themeColors.primaryButton,
    mainText: themeColors.mainText,
    secondaryText: themeColors.secondaryText
  }), [themeColors]);

  // Intersection Observer for scroll animations (lighter than GSAP)
  useEffect(() => {
    if (!safeCta?.enabled || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisibleRef.current) {
            isVisibleRef.current = true;
            entry.target.querySelector('.cta-content')?.classList.add('animate-in');
            entry.target.querySelector('.cta-image')?.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [safeCta?.enabled]);

  if (!safeCta?.enabled) return null;

  // Memoize image URL - remove random timestamp to prevent constant re-renders
  const backgroundImageUrl = useMemo(() => {
    const img = safeCta.backgroundImage || safeCta.image || (safeCta.mediaItems?.[0]);
    if (!img) return null;
    
    const imagePath = typeof img === 'object' && img !== null
      ? img.url || img.src
      : img;
    if (!imagePath) return null;
    
    return getImageSrc(imagePath);
  }, [safeCta.backgroundImage, safeCta.image, safeCta.mediaItems]);

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <style>{`
        .cta-content, .cta-image {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .cta-image {
          transform: translateX(60px);
          transition-delay: 0.15s;
        }
        .cta-content.animate-in, .cta-image.animate-in {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
        {/* Left Content */}
        <div className="cta-content flex flex-col justify-center px-8 md:px-12 lg:px-20 py-16 lg:py-24">
          
          {safeCta.title && (
            <h2
              className="font-bold leading-tight mb-4 uppercase tracking-tight"
              style={{ color: colors.mainText }}
            >
              <TiptapRenderer content={safeCta.title} as="inline" />
            </h2>
          )}

          {safeCta.description && (
            <div 
              className="text-sm md:text-base max-w-md mb-8"
              style={{ color: colors.secondaryText }}
            >
              <TiptapRenderer content={safeCta.description} as="inline" />
            </div>
          )}

          {/* Primary Button */}
          {(safeCta.ctaButton || safeCta.primaryButton) && (
            <Link
              href={safeCta.ctaButton?.url || safeCta.primaryButton?.href || '/'}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded transition-opacity hover:opacity-80 w-fit"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <span>{safeCta.ctaButton?.text || safeCta.primaryButton?.label || 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Right Image with Arrow Shape */}
        <div className="cta-image relative hidden lg:block overflow-hidden">
          {backgroundImageUrl ? (
            <>
              <img
                src={backgroundImageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
              />
              {/* Subtle overlay for depth */}
              <div 
                className="absolute inset-0 bg-gradient-to-t to-transparent pointer-events-none"
                style={{ 
                  clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
                  background: `linear-gradient(to top, ${colors.primary}30, transparent)`
                }}
              />
            </>
          ) : (
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondaryText})`,
                clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
              }}
            />
          )}
        </div>

        {/* Mobile Image */}
        {backgroundImageUrl && (
          <div className="lg:hidden relative h-64">
            <img
              src={backgroundImageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';

export default CTA;