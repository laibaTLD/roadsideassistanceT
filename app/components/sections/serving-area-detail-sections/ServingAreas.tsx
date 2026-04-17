'use client';

import React, { useMemo, memo } from 'react';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ServiceServingAreasSectionProps {
  service: any;
  className?: string;
}

export const ServingAreas: React.FC<ServiceServingAreasSectionProps> = memo(({ service, className }) => {
  const themeColors = useThemeColors();
  const { site } = useWebBuilder();

  // Memoize areas calculation
  const areas = useMemo(() => {
    let siteAreas: any[] = [];
    let serviceAreas: any[] = [];
    
    if (Array.isArray(site?.serviceAreas)) {
      siteAreas = site.serviceAreas.filter(Boolean);
    }
    
    if (service?.serviceAreas && Array.isArray(service.serviceAreas)) {
      serviceAreas = service.serviceAreas;
    } else if (service?.areas && Array.isArray(service.areas)) {
      serviceAreas = service.areas;
    } else if (Array.isArray(service)) {
      serviceAreas = service;
    }
    
    const finalAreas = serviceAreas.length > 0 ? serviceAreas : siteAreas;
    
    return finalAreas.map(area => {
      if (typeof area === 'string') {
        return area.trim();
      }
      return area;
    });
  }, [service, site?.serviceAreas]);

  // Memoize computed values
  const { serviceSlug, resolvedTitle, resolvedDescription, colors } = useMemo(() => {
    const slug = service?.name ? 
      String(service.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') : 
      'service';
    
    const title = service?.name ? `Serving ${service.name} Areas` : 'Serving Areas';
    const desc = service?.name ? 
      `We provide ${service.name} services in the following areas.` : 
      'We provide services in the following areas.';
    
    return {
      serviceSlug: slug,
      resolvedTitle: title,
      resolvedDescription: desc,
      colors: {
        bg: themeColors.pageBackground,
        primary: themeColors.primaryButton,
        mainText: themeColors.mainText,
        secondaryText: themeColors.secondaryText
      }
    };
  }, [service, themeColors]);

  if (areas.length === 0) {
    return (
      <div className="py-16 text-center" style={{ color: themeColors.lightPrimaryText }}>
        No service areas available
      </div>
    );
  }

  return (
    <section
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="serving-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.mainText }}>
              {resolvedTitle}
            </h2>
          </div>

          <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: colors.secondaryText }}>
            {resolvedDescription}
          </p>
        </div>

        {/* Areas Grid */}
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
                style={{ backgroundColor: `${colors.primary}08` }}
              >
                <div className="relative">
                  <h3 
                    className="text-xl md:text-2xl font-serif font-semibold mb-4 group-hover:translate-x-2 transition-transform duration-300"
                    style={{ color: colors.mainText }}
                  >
                    {areaName}
                  </h3>

                  {/* Arrow Link */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.secondaryText }}>
                      View Area
                    </span>
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: 'white' }} />
                    </div>
                  </div>
                </div>

                {/* Hover Accent */}
                <div 
                  className="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-500 rounded-b-2xl"
                  style={{ backgroundColor: colors.primary }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ServingAreas.displayName = 'ServingAreas';

export default ServingAreas;
