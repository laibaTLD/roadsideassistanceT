'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TestimonialsSectionProps {
  testimonialsSection: Page['testimonialsSection'];
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonialsSection, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const themeColors = useThemeColors();

  const items = testimonialsSection?.testimonials || [];

  const scrollToIndex = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.querySelector<HTMLElement>(`[data-testimonial-index="${idx}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const scrollByCard = (direction: -1 | 1) => {
    const next = Math.max(0, Math.min(items.length - 1, activeIndex + direction));
    scrollToIndex(next);
  };

  useEffect(() => {
    if (!testimonialsSection?.enabled) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo('.testimonials-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      // Cards animation
      gsap.fromTo('.testimonial-card',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 75%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonialsSection]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const handler = () => {
      const children = Array.from(track.querySelectorAll<HTMLElement>('[data-testimonial-index]'));
      const trackRect = track.getBoundingClientRect();
      const trackCenterX = trackRect.left + trackRect.width / 2;

      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      children.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(elCenterX - trackCenterX);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = Number(el.dataset.testimonialIndex || 0);
        }
      });
      setActiveIndex(bestIdx);
    };

    track.addEventListener('scroll', handler, { passive: true });
    return () => track.removeEventListener('scroll', handler as any);
  }, [items.length]);

  if (!testimonialsSection?.enabled || items.length === 0) return null;

  // Theme colors
  const bgColor = themeColors.pageBackground;
  const primaryColor = themeColors.primaryButton;
  const mainText = themeColors.mainText;
  const secondaryText = themeColors.secondaryText;

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="testimonials-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {testimonialsSection.title && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: mainText }}>
                <TiptapRenderer content={testimonialsSection.title} as="inline" />
              </h2>
            )}
          </div>

          {testimonialsSection.description && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: secondaryText }}>
              <TiptapRenderer content={testimonialsSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-8 lg:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8"
            style={{ scrollbarWidth: 'none' }}
          >
            {items.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                data-testimonial-index={idx}
                className={cn(
                  "testimonial-card min-w-[85%] md:min-w-[60%] lg:min-w-[45%] snap-center transition-all duration-500",
                  activeIndex === idx ? "opacity-100 scale-100" : "opacity-50 scale-95"
                )}
              >
                <div 
                  className="relative p-8 lg:p-10 rounded-2xl h-full"
                  style={{ backgroundColor: `${primaryColor}08` }}
                >
                  {/* Quote Icon */}
                  <div
                    className="text-lg md:text-xl font-light leading-relaxed mb-8"
                    style={{ color: mainText }}
                  >
                    <TiptapRenderer content={t.text} />
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    
                    <div>
                      <span 
                        className="block text-sm font-semibold"
                        style={{ color: mainText }}
                      >
                        {t.name}
                      </span>
                      <span 
                        className="block text-xs"
                        style={{ color: secondaryText }}
                      >
                        {t.role}{t.company && ` • ${t.company}`}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-between">
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2 h-[2px] w-32" style={{ backgroundColor: `${primaryColor}30` }}>
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    backgroundColor: primaryColor,
                    width: `${((activeIndex + 1) / items.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: secondaryText }}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollByCard(-1)}
                disabled={activeIndex === 0}
                className="w-12 h-12 rounded-full border flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => scrollByCard(1)}
                disabled={activeIndex === items.length - 1}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-30"
                style={{ backgroundColor: primaryColor }}
              >
                <ArrowRight className="w-5 h-5" style={{ color: 'white' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
