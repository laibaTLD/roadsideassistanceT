'use client';

import React, { useEffect, useRef, useMemo, memo } from 'react';
import gsap from 'gsap';
import { Page } from '@/app/lib/types';
import { getImageSrc, cn } from '@/app/lib/utils';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  hero: Page['hero'];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = memo(({ hero, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const animationStartedRef = useRef(false);

  // Memoize image URL
  const mainImage = useMemo(() => 
    hero?.mediaItems?.[0] || hero?.media,
  [hero?.mediaItems, hero?.media]);

  // Simplified entrance animation - runs once
  useEffect(() => {
    if (!hero?.enabled || animationStartedRef.current) return;
    animationStartedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      tl.fromTo('.hero-the', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.3)
        .fromTo('.hero-future', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.5)
        .fromTo('.hero-modernism', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7)
        .fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9)
        .fromTo('.hero-cta', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1);
    }, sectionRef);

    return () => ctx.revert();
  }, [hero?.enabled]);

  if (!hero?.enabled) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full h-screen min-h-[700px] overflow-hidden',
        className
      )}
    >
      {/* FULL WIDTH IMAGE BACKGROUND */}
      {mainImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={getImageSrc(mainImage.url)}
            alt={mainImage.altText || ''}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* CONTENT OVERLAY - Left side */}
      <div className="relative z-10 w-[45%] h-full flex flex-col justify-center px-16 py-12">
        {/* Decorative Script "The" - very light */}
        <span className="hero-the font-serif italic text-2xl md:text-3xl text-[#A8BCC4] mb-1 font-extralight">
          The
        </span>
        
        {/* "Future of" in script */}
        <h2 className="hero-future font-serif italic text-4xl md:text-5xl text-[#5A7986] mb-0 leading-tight">
          Future <span className="text-xl md:text-2xl">of</span>
        </h2>
        
        {/* Main Title from database - bold serif */}
        {hero.title && (
          <h1 className="hero-modernism font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D434D] tracking-tight leading-none mb-8">
            <TiptapRenderer content={hero.title} as="inline" />
          </h1>
        )}
        
        {/* Subtitle from database */}
        {(hero.subtitle || hero.description) && (
          <p className="hero-subtitle text-xs text-[#7A94A0] tracking-wide max-w-[280px] mb-8 leading-relaxed">
            <TiptapRenderer content={hero.subtitle || hero.description} as="inline" />
          </p>
        )}

        {/* CTA Button from database */}
        {hero.primaryCta && (
          <a 
            href={hero.primaryCta.href || '#'} 
            className="hero-cta inline-flex items-center gap-3 text-sm text-[#2D434D] hover:text-[#5A7986] transition-colors group"
          >
            <span className="font-medium">{hero.primaryCta.label}</span>
            <div className="w-8 h-8 rounded-full border border-[#2D434D] flex items-center justify-center group-hover:bg-[#2D434D] group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>
        )}
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
