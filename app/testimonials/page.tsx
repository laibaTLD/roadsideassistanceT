'use client';

import { useMemo } from 'react';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';

export default function TestimonialsPage() {
  const { site, pages } = useWebBuilder();

  const testimonialsPage = useMemo(() => pages.find((p: Page) => p.pageType === 'testimonials') || null, [pages]);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[testimonials] site from WebBuilderProvider:', site);
    console.log('[testimonials] pages from WebBuilderProvider:', pages);
    console.log('[testimonials] testimonialsPage:', testimonialsPage);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {testimonialsPage?.hero?.enabled && <HeroSection hero={testimonialsPage.hero} />}
        {testimonialsPage?.testimonialsSection?.enabled && <TestimonialsSection testimonialsSection={testimonialsPage.testimonialsSection} />}
      </main>

      <Footer />
    </div>
  );
}
