'use client';

import React, { useEffect, useRef } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  aboutSection: Page['aboutSection'];
  className?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutSection, className }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!aboutSection?.enabled) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.about-content',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      gsap.fromTo('.about-visual',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [aboutSection]);

  if (!aboutSection?.enabled) return null;

  const imageUrl = aboutSection.image
    ? getImageSrc(
      typeof aboutSection.image === 'object' && aboutSection.image !== null
        ? aboutSection.image.url
        : aboutSection.image
    )
    : null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full py-32 md:py-40 lg:py-48 bg-[#FAFBFC]',
        className
      )}
    >
      <div className="max-w-[1200px] mx-auto px-8 md:px-12">
        
        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left - Large Image */}
          <div className="lg:col-span-7 about-visual">
            <div className="relative aspect-[4/3] overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={aboutSection.title || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#E8EDF0]" />
              )}
            </div>
          </div>

          {/* Right - Content Overlapping */}
          <div className="lg:col-span-5 lg:-ml-20 lg:mt-20 relative z-10">
            <div className="about-content bg-white p-8 md:p-12 shadow-sm">
              
              {aboutSection.title && (
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#2D434D] leading-tight mb-6">
                  <TiptapRenderer content={aboutSection.title} as="inline" />
                </h2>
              )}

              {aboutSection.description && (
                <div className="text-sm text-[#5A7986] leading-relaxed mb-8">
                  <TiptapRenderer content={aboutSection.description} as="inline" />
                </div>
              )}

              {/* Features */}
              {aboutSection.features && aboutSection.features.length > 0 && (
                <div className="space-y-4 border-t border-[#E8EDF0] pt-6 mb-8">
                  {aboutSection.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-baseline gap-3">
                      <span className="text-xs font-medium text-[#A8BCC4]">0{index + 1}</span>
                      <span className="text-sm text-[#2D434D]">{feature.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button */}
              <a
                href="/about-us"
                className="inline-flex items-center gap-3 text-sm font-medium text-[#2D434D] hover:text-[#5A7986] transition-colors group"
              >
                <span>Learn more</span>
                <div className="w-8 h-8 rounded-full border border-[#2D434D] flex items-center justify-center group-hover:bg-[#2D434D] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;