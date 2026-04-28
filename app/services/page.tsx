'use client';

import { useMemo } from 'react';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { ServicesSection } from '@/app/components/sections/ServicesSection';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';

export default function ServicesPage() {
  const { site, pages } = useWebBuilder();

  const serviceListPage = useMemo(() => pages.find((p: Page) => p.pageType === 'service-list') || null, [pages]);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[services] site from WebBuilderProvider:', site);
    console.log('[services] pages from WebBuilderProvider:', pages);
    console.log('[services] serviceListPage:', serviceListPage);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {serviceListPage?.hero?.enabled && <HeroSection hero={serviceListPage.hero} />}
        {serviceListPage?.servicesSection?.enabled && <ServicesSection servicesSection={serviceListPage.servicesSection} />}
      </main>

      <Footer />
    </div>
  );
}
