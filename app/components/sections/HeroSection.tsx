'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Page } from '@/app/lib/types';
import { getImageSrc, cn } from '@/app/lib/utils';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  hero: Page['hero'];
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, className }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!hero?.enabled) return;

    const ctx = gsap.context(() => {
      // Text entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
      
      tl.fromTo('.hero-the', { y: 30, opacity: 0 }, { y: 0, opacity: 1 })
        .fromTo('.hero-future', { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.9")
        .fromTo('.hero-modernism', { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.9")
        .fromTo('.hero-subtitle', { opacity: 0 }, { opacity: 1 }, "-=0.7")
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.6");

      // Floating animation for the image - subtle up and down
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      // Subtle scale breathing effect
      gsap.to(imageRef.current, {
        scale: 1.03,
        duration: 5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1
      });

      // Parallax on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to(imageRef.current, {
          x: xPos,
          y: `+=${yPos * 0.1}`,
          rotationY: xPos * 0.3,
          rotationX: -yPos * 0.3,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, sectionRef);

    return () => ctx.revert();
  }, [hero]);

  if (!hero?.enabled) return null;
  
  const mainImage = hero.mediaItems && hero.mediaItems.length > 0 ? hero.mediaItems[0] : hero.media;

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full h-screen min-h-[800px] overflow-hidden',
        className
      )}
    >
      {/* FULL WIDTH IMAGE BACKGROUND */}
      {mainImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            ref={imageRef}
            src={getImageSrc(mainImage.url)}
            alt={mainImage.altText || ''}
            className="w-full h-full object-cover scale-105"
            style={{ perspective: '1000px' }}
          />
        </div>
      )}

      {/* CONTENT OVERLAY - Left side */}
      <div className="relative z-10 w-[45%] h-full flex flex-col justify-center px-16 py-12">
        
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
};