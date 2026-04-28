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
import { BlogSection } from '@/app/components/sections/BlogSection';
import { ContactSection } from '@/app/components/sections/ContactSection';
import { Page } from '@/app/lib/types';

// Section whitelist per pageType per PAGE_SECTIONS_DOCUMENTATION
const SECTION_ORDER = [
  'hero', 'about', 'services', 'gallery', 'testimonials', 'faq',
  'contact', 'blog', 'cta', 'whyChooseUs', 'companyDetail', 'projects',
  'cta2', 'cta3', 'servingAreas',
] as const;

type SectionKey = typeof SECTION_ORDER[number];

const PAGE_TYPE_SECTIONS: Record<string, SectionKey[]> = {
  home:           ['hero', 'about', 'services', 'gallery', 'testimonials', 'faq', 'contact', 'blog', 'cta', 'whyChooseUs', 'companyDetail', 'projects', 'cta2', 'cta3'],
  about:          ['hero', 'about', 'whyChooseUs', 'companyDetail', 'cta2'],
  contact:        ['hero', 'contact'],
  'service-list': ['hero', 'services'],
  'blog-list':    ['hero', 'blog'],
  'project-detail': ['hero'],
  testimonials:   ['hero', 'testimonials'],
};

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

  // Determine allowed sections based on pageType; fall back to all for service areas / unknown types
  const pageType = (displayPage as any).pageType as string | undefined;
  const allowedSections: Set<SectionKey> = pageType && PAGE_TYPE_SECTIONS[pageType]
    ? new Set(PAGE_TYPE_SECTIONS[pageType])
    : new Set(SECTION_ORDER);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[pageSlug] pageType:', pageType);
    console.log('[pageSlug] allowedSections:', [...allowedSections]);
    console.log('[pageSlug] page data:', displayPage);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
      <Header />

      <main>
        {allowedSections.has('hero') && displayPage.hero?.enabled && <HeroSection hero={displayPage.hero} />}
        {allowedSections.has('about') && displayPage.aboutSection?.enabled && <AboutSection aboutSection={displayPage.aboutSection} />}
        {allowedSections.has('services') && displayPage.servicesSection?.enabled && <ServicesSection servicesSection={displayPage.servicesSection} />}
        {allowedSections.has('gallery') && displayPage.gallerySection?.enabled && <GallerySection gallerySection={displayPage.gallerySection} />}
        {allowedSections.has('testimonials') && displayPage.testimonialsSection?.enabled && <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />}
        {allowedSections.has('faq') && displayPage.faqSection?.enabled && <FAQSection faqSection={displayPage.faqSection} />}
        {allowedSections.has('contact') && displayPage.contactSection?.enabled && <ContactSection contactSection={displayPage.contactSection} />}
        {allowedSections.has('blog') && displayPage.blogSection?.enabled && <BlogSection blogSection={displayPage.blogSection} />}
        {allowedSections.has('cta') && displayPage.ctaSection?.enabled && <CTASection ctaSection={displayPage.ctaSection} />}
        {allowedSections.has('whyChooseUs') && displayPage.whyChooseUsSection?.enabled && <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />}
        {allowedSections.has('companyDetail') && displayPage.companyDetailSection?.enabled && <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />}
        {allowedSections.has('projects') && displayPage.projectsSection?.enabled && <ProjectsSection projectsSection={displayPage.projectsSection} />}
        {allowedSections.has('cta2') && displayPage.cta2Section?.enabled && <CTA2Section cta2Section={displayPage.cta2Section} />}
        {allowedSections.has('cta3') && displayPage.cta3Section?.enabled && <CTA3Section cta3Section={displayPage.cta3Section} />}
        {allowedSections.has('servingAreas') && <ServingAreasSection />}
      </main>

      <Footer />
    </div>
  );
}
