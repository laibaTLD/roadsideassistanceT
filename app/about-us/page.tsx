'use client';

import { useMemo } from 'react';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';
import { CompanyDetailSection } from '@/app/components/sections/CompanyDetailSection';
import { CTA2Section } from '@/app/components/sections/CTA2Section';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';

export default function AboutPage() {
  const { site, pages } = useWebBuilder();

  const aboutPage = useMemo(() => pages.find((p: Page) => p.pageType === 'about') || null, [pages]);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[about-us] site from WebBuilderProvider:', site);
    console.log('[about-us] pages from WebBuilderProvider:', pages);
    console.log('[about-us] aboutPage:', aboutPage);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {aboutPage?.hero?.enabled && <HeroSection hero={aboutPage.hero} />}
        {aboutPage?.aboutSection?.enabled && <AboutSection aboutSection={aboutPage.aboutSection} />}
        {aboutPage?.whyChooseUsSection?.enabled && <WhyChooseUsSection whyChooseUsSection={aboutPage.whyChooseUsSection} />}
        {aboutPage?.companyDetailSection?.enabled && <CompanyDetailSection companyDetailSection={aboutPage.companyDetailSection} />}
        {aboutPage?.cta2Section?.enabled && <CTA2Section cta2Section={aboutPage.cta2Section} />}
      </main>

      <Footer />
    </div>
  );
}
