'use client';

import React, { useMemo, memo } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';

interface CompanyDetailSectionProps {
  companyDetailSection: Page['companyDetailSection'];
  className?: string;
}

export const CompanyDetailSection: React.FC<CompanyDetailSectionProps> = memo(({ companyDetailSection, className }) => {
  const themeColors = useThemeColors();

  if (!companyDetailSection?.enabled) return null;

  const details = companyDetailSection.details || [];

  // Theme colors - memoized
  const colors = useMemo(() => ({
    bg: themeColors.pageBackground,
    primary: themeColors.primaryButton,
    mainText: themeColors.mainText,
    secondaryText: themeColors.secondaryText
  }), [themeColors]);

  // Memoize getImageUrl function - removed Date.now() to prevent constant re-renders
  const getImageUrl = useMemo(() => (image: any) => {
    if (!image) return null;
    const img = image as any;
    const imagePath = typeof img === 'object' && img !== null
      ? img.url || img.src
      : img;
    if (!imagePath) return null;
    return getImageSrc(imagePath);
  }, []);

  return (
    <section
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="company-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {companyDetailSection.title && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.mainText }}>
                <TiptapRenderer content={companyDetailSection.title} as="inline" />
              </h2>
            )}
          </div>

          {companyDetailSection.description && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: colors.secondaryText }}>
              <TiptapRenderer content={companyDetailSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Company Details Grid */}
        <div className="company-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {details.map((detail, idx) => {
            const imageUrl = getImageUrl(detail.image);
            const title = detail.title || detail.label;
            const description = detail.description || detail.value;

            return (
              <div
                key={`detail-${idx}-${String(detail.title || '').slice(0, 10)}`}
                className="company-card group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={detail.image?.altText || title || ''}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" style={{ '--tw-gradient-from': `${colors.primary}50` } as React.CSSProperties} />
                  </div>
                )}

                {/* Content */}
                <div className="relative p-6 lg:p-8">
                  {/* Label */}
                  {detail.label && (
                    <span className="text-xs font-medium tracking-[0.2em] uppercase mb-3 block" style={{ color: colors.secondaryText }}>
                      {detail.label}
                    </span>
                  )}

                  {/* Title */}
                  {title && (
                    <h3 className="text-xl md:text-2xl font-serif font-semibold leading-tight mb-4" style={{ color: colors.mainText }}>
                      <TiptapRenderer content={title} as="inline" />
                    </h3>
                  )}

                  {/* Description */}
                  {description && (
                    <div className="text-sm leading-relaxed" style={{ color: colors.secondaryText }}>
                      <TiptapRenderer content={description} />
                    </div>
                  )}
                </div>

                {/* Hover Accent Line */}
                <div 
                  className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-500"
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

CompanyDetailSection.displayName = 'CompanyDetailSection';

export default CompanyDetailSection;