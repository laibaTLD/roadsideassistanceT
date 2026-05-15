'use client';

import { useMemo } from 'react';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { ContactSection } from '@/app/components/sections/ContactSection';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';

export default function ContactPage() {
  const { site, pages } = useWebBuilder();

  const contactPage = useMemo(() => pages.find((p: Page) => p.pageType === 'contact') || null, [pages]);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[contact-us] site from WebBuilderProvider:', site);
    console.log('[contact-us] pages from WebBuilderProvider:', pages);
    console.log('[contact-us] contactPage:', contactPage);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {contactPage?.hero?.enabled && <HeroSection hero={contactPage.hero} />}
        {contactPage?.contactSection?.enabled && <ContactSection contactSection={contactPage.contactSection} />}
      </main>

      <Footer />
    </div>
  );
}
