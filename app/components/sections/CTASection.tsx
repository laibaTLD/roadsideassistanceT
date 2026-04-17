'use client';

import React, { useMemo, memo } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  ctaSection: Page['ctaSection'];
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = memo(({ ctaSection, className }) => {
  const themeColors = useThemeColors();

  if (!ctaSection?.enabled) return null;

  // Memoize image URL - removed random timestamp to prevent re-renders
  const backgroundImageUrl = useMemo(() => {
    if (!ctaSection.backgroundImage) return null;
    const img = ctaSection.backgroundImage as any;
    const imagePath = typeof img === 'object' && img !== null
      ? img.url || img.src
      : img;
    if (!imagePath) return null;
    return getImageSrc(imagePath);
  }, [ctaSection.backgroundImage]);

  // Theme colors - memoized
  const colors = useMemo(() => ({
    bg: themeColors.pageBackground,
    primary: themeColors.primaryButton,
    mainText: themeColors.mainText,
    secondaryText: themeColors.secondaryText
  }), [themeColors]);

  return (
    <section
      className={cn('relative w-full overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
        {/* Left Content */}
        <div className="cta-content flex flex-col justify-center px-8 md:px-12 lg:px-20 py-16 lg:py-24">
          
          {ctaSection.title && (
            <h2
              className="font-bold leading-tight mb-4 uppercase tracking-tight"
              style={{ color: colors.mainText }}
            >
              <TiptapRenderer content={ctaSection.title} as="inline" />
            </h2>
          )}

          {ctaSection.description && (
            <p 
              className="text-sm md:text-base max-w-md mb-8"
              style={{ color: colors.secondaryText }}
            >
              <TiptapRenderer content={ctaSection.description} as="inline" />
            </p>
          )}

          {/* Primary Button */}
          {ctaSection.primaryButton && (
            <Link
              href={ctaSection.primaryButton.href || '/'}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded transition-opacity hover:opacity-80 w-fit"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <span>{ctaSection.primaryButton.label}</span>
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

CTASection.displayName = 'CTASection';

export default CTASection;