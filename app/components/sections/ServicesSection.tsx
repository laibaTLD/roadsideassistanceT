'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServicesSectionProps {
  servicesSection: Page['servicesSection'];
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ servicesSection, className }) => {
  const { services } = useWebBuilder();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!servicesSection?.enabled) return;

    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo('.services-header',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      // Staggered card reveals
      gsap.fromTo('.service-card',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.services-grid', start: 'top 85%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [servicesSection]);

  if (!servicesSection?.enabled) return null;

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full py-24 md:py-32 lg:py-40 bg-[#EBF0F3] overflow-hidden', className)}
    >
      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="services-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-[#7A94A0] mb-4 block">
              Our Services
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D434D] leading-tight">
              <TiptapRenderer content={servicesSection.title} as="inline" />
            </h2>
          </div>
          
          {servicesSection.description && (
            <p className="text-sm text-[#5A7986] max-w-md leading-relaxed lg:text-right">
              <TiptapRenderer content={servicesSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Services Grid - Aligned Layout */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const imageUrl = getImageSrc(service.thumbnailImage?.url || service.thumbnailImage);

            return (
              <Link
                key={service._id}
                href={`/service/${service.slug}`}
                className="service-card group relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D434D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-xl font-serif font-bold text-white mb-2">
                      {service.name}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-xs text-white/80 line-clamp-2">
                        {typeof service.shortDescription === 'string'
                          ? service.shortDescription
                          : ''}
                      </p>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-4 h-4 text-[#2D434D]" />
                  </div>
                </div>

                {/* Card Info - Below Image */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-medium text-[#2D434D] group-hover:text-[#5A7986] transition-colors">
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#7A94A0]">View service</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A8BCC4] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-24 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#2D434D] text-white text-sm font-medium rounded-full hover:bg-[#3D535D] transition-colors group"
          >
            <span>View all services</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
