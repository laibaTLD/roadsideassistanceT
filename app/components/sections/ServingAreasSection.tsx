'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServingAreasSectionProps {
  enabled?: boolean;
  title?: string;
  description?: string;
  className?: string;
  serviceSlug?: string;
}

export const ServingAreasSection: React.FC<ServingAreasSectionProps> = ({
  enabled = true,
  title,
  description,
  className,
  serviceSlug = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const themeColors = useThemeColors();
  const { site, services } = useWebBuilder();

  const areas = useMemo(() => {
    // First try to get from site.serviceAreas
    if (site?.serviceAreas && Array.isArray(site.serviceAreas) && site.serviceAreas.length > 0) {
      return site.serviceAreas.filter(Boolean);
    }
    // Fallback: extract unique cities from services
    if (services && Array.isArray(services) && services.length > 0) {
      const serviceAreas = services
        .filter((s: any) => s.serviceAreas && Array.isArray(s.serviceAreas))
        .flatMap((s: any) => s.serviceAreas)
        .map((a: any) => typeof a === 'string' ? a : a.city)
        .filter(Boolean);
      return [...new Set(serviceAreas)];
    }
    return [];
  }, [site?.serviceAreas, services]);

  useEffect(() => {
    if (!enabled || areas.length === 0) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo('.serving-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      // Area cards staggered animation
      gsap.fromTo('.area-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.areas-grid', start: 'top 75%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [enabled, areas.length]);

  if (!enabled) return null;

  // Theme colors
  const bgColor = themeColors.pageBackground;
  const primaryColor = themeColors.primaryButton;
  const mainText = themeColors.mainText;
  const secondaryText = themeColors.secondaryText;

  const resolvedTitle = title || 'Service Areas';
  const resolvedDescription = description || 'Discover the locations where we offer our professional services.';

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="serving-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {resolvedTitle && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: mainText }}>
                {resolvedTitle}
              </h2>
            )}
          </div>

          {resolvedDescription && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: secondaryText }}>
              {resolvedDescription}
            </p>
          )}
        </div>

        {/* Areas Grid */}
        {areas.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: mainText }}>
              No service areas configured yet.
            </p>
          </div>
        ) : (
          <div className="areas-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {areas.map((area, idx) => {
              const areaName = typeof area === 'string' ? area : area;
              const areaSlug = areaName.toLowerCase().replace(/[,\s]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              const linkPath = serviceSlug ? `/service/${serviceSlug}/service-area/${areaSlug}` : `/service-area/${areaSlug}`;

              return (
                <Link
                  key={`${areaName}-${idx}`}
                  href={linkPath}
                  className="area-card group relative p-8 rounded-2xl transition-all duration-500 hover:shadow-lg"
                  style={{ backgroundColor: `${primaryColor}08` }}
                >
                  <div className="relative">
                    <h3 
                      className="text-xl md:text-2xl font-serif font-semibold mb-4 group-hover:translate-x-2 transition-transform"
                      style={{ color: mainText }}
                    >
                      {areaName}
                    </h3>

                    {/* Arrow Link */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: secondaryText }}>
                        View Area
                      </span>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ArrowRight className="w-4 h-4" style={{ color: 'white' }} />
                      </div>
                    </div>
                  </div>

                  {/* Hover Accent */}
                  <div 
                    className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                    style={{ backgroundColor: primaryColor }}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServingAreasSection;