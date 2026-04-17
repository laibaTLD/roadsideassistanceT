'use client';

import React, { useEffect, useRef } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceHighlightsSectionProps {
  serviceHighlightsSection: Page['serviceHighlightsSection'];
  className?: string;
}

export const ServiceHighlightsSection: React.FC<ServiceHighlightsSectionProps> = ({
  serviceHighlightsSection,
  className
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isEnabled = serviceHighlightsSection?.enabled === true || serviceHighlightsSection != null;
    if (!isEnabled) return;

    const ctx = gsap.context(() => {
      // Text entrance animations
      gsap.fromTo('.highlights-title', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );
      
      gsap.fromTo('.highlights-description', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      // Staggered reveal for highlight cards
      gsap.fromTo('.highlight-card',
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          stagger: 0.15, 
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, [serviceHighlightsSection]);

  const isEnabled = serviceHighlightsSection?.enabled === true || serviceHighlightsSection != null;
  if (!isEnabled) return null;

  const highlights = [...(serviceHighlightsSection.highlights || [])]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 4);

  // Use database background color or fallback
  const bgColor = serviceHighlightsSection?.backgroundColor || '#EBF0F3';

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full py-24 md:py-32 lg:py-40 overflow-hidden',
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        
        {/* Header Area - Database Title and Description */}
        <div className="mb-16 lg:mb-24">
          {serviceHighlightsSection?.title && (
            <h2 className="highlights-title font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D434D] tracking-tight leading-none">
              <TiptapRenderer content={serviceHighlightsSection.title} as="inline" />
            </h2>
          )}
          
          {serviceHighlightsSection?.description && (
            <p className="highlights-description text-sm text-[#5A7986] tracking-wide max-w-[500px] mt-6 leading-relaxed">
              <TiptapRenderer content={serviceHighlightsSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Highlights Grid - Database Data Only */}
        <div ref={contentRef} className="flex" style={{ gap: '120px' }}>
          {highlights.map((highlight, index) => {
            // Use price from database or fallback to index
            const displayNumber = highlight.price || `0${index + 1}`;
            
            return (
              <div 
                key={index} 
                className="highlight-card group relative"
              >
                {/* Number from database */}
                <span className="text-7xl md:text-8xl font-serif font-light text-[#D1DCE2] leading-none mb-4 block">
                  {displayNumber}
                </span>
                
                {/* Divider */}
                <div className="w-12 h-[1px] bg-[#A8BCC4] mb-6 group-hover:w-full transition-all duration-500" />

                {/* Title from database */}
                {highlight.title && (
                  <h4 className="text-sm md:text-base font-medium text-[#2D434D] tracking-wide">
                    <TiptapRenderer content={highlight.title} as="inline" />
                  </h4>
                )}
                
                {/* Description from database */}
                {highlight.description && (
                  <p className="text-xs text-[#7A94A0] leading-relaxed max-w-[200px]">
                    <TiptapRenderer content={highlight.description} as="inline" />
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlightsSection;