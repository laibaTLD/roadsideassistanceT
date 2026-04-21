'use client';

import { useThemeColors } from '@/app/hooks/useTheme';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { ServicesSection } from '@/app/components/sections/ServicesSection';
import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';
import { FAQSection } from '@/app/components/sections/FAQSection';
import { CTASection } from '@/app/components/sections/CTASection';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';
import { CompanyDetailSection } from '@/app/components/sections/CompanyDetailSection';
import { ProjectsSection } from '@/app/components/sections/ProjectsSection';
import { CTA2Section } from '@/app/components/sections/CTA2Section';
import { CTA3Section } from '@/app/components/sections/CTA3Section';
import { ServingAreasSection } from '@/app/components/sections/ServingAreasSection';
import { GallerySection } from '@/app/components/sections/GallerySection';
import { Page } from '@/app/lib/types';

interface PageSlugClientProps {
  pageSlug: string;
  page: Page | null;
  serviceArea: any | null;
}

export default function PageSlugClient({ page, serviceArea }: PageSlugClientProps) {
  const themeColors = useThemeColors();

  const displayPage = page || serviceArea;

  if (!displayPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: themeColors.pageBackground }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.lightPrimaryText }}>Page Not Found</h2>
        <p style={{ color: themeColors.lightSecondaryText }}>The page could not be found.</p>
        <a href="/" className="mt-8 hover:underline" style={{ color: themeColors.primaryButton }}>Return Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
      <Header />

      <main>
        <HeroSection hero={displayPage.hero} />

        <AboutSection aboutSection={displayPage.aboutSection} />

        <CTASection ctaSection={displayPage.ctaSection} />

        <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />

        <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />

        <ProjectsSection projectsSection={displayPage.projectsSection} />

       

        <CTA2Section cta2Section={displayPage.cta2Section} />

        <CTA3Section cta3Section={displayPage.cta3Section} />

        <ServicesSection servicesSection={displayPage.servicesSection} />

        <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />
         <GallerySection gallerySection={displayPage.gallerySection} />
        <ServingAreasSection />

        <FAQSection faqSection={displayPage.faqSection} />
      </main>

      <Footer />
    </div>
  );
}
