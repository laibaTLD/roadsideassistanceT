'use client';

import React, { useEffect, useRef } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Check } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface WhyChooseUsSectionProps {
  whyChooseUsSection: Page['whyChooseUsSection'];
  className?: string;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ whyChooseUsSection, className }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!whyChooseUsSection?.enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.why-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      gsap.fromTo('.why-item',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.why-grid', start: 'top 85%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [whyChooseUsSection]);

  if (!whyChooseUsSection?.enabled) return null;

  const items = whyChooseUsSection.items || [];

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full py-24 md:py-32 lg:py-40 bg-[#EBF0F3] overflow-hidden', className)}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="why-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {whyChooseUsSection.title && (
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2D434D] leading-tight">
                <TiptapRenderer content={whyChooseUsSection.title} as="inline" />
              </h2>
            )}
          </div>

          {whyChooseUsSection.description && (
            <p className="text-sm text-[#5A7986] max-w-md leading-relaxed lg:text-right">
              <TiptapRenderer content={whyChooseUsSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Items Grid */}
        <div className="why-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="why-item group relative bg-white p-6 lg:p-8 transition-all duration-300 hover:shadow-lg"
            >
        
              {/* Icon */}
              <div className="relative w-12 h-12 rounded-full bg-[#2D434D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Check className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                {item.title && (
                  <h3 className="text-lg font-medium text-[#2D434D] mb-3 leading-snug">
                    <TiptapRenderer content={item.title} as="inline" />
                  </h3>
                )}

                {item.description && (
                  <p className="text-xs text-[#5A7986] leading-relaxed">
                    <TiptapRenderer content={item.description} as="inline" />
                  </p>
                )}
              </div>

              {/* Hover Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#2D434D] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;