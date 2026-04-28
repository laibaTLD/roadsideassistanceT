'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';
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
import { ContactSection } from './components/sections/ContactSection';
import { GallerySection } from '@/app/components/sections/GallerySection';
import { BlogSection } from '@/app/components/sections/BlogSection';

export default function HomeClient() {
  const { site, pages, testimonials, loading, error } = useWebBuilder();

  // Get theme colors from site using the new dynamic CSS variable system
  const themeColors = {
    primary: 'var(--wb-primary)',
    secondary: 'var(--wb-primary)', // Using primary as default for secondary if not split
    accent: 'var(--wb-primary)',
    mainText: 'var(--wb-text-main)',
    secondaryText: 'var(--wb-text-secondary)',
    pageBackground: 'var(--wb-page-bg)',
    sectionBackground: 'var(--wb-section-bg-light)',
    cardBackground: 'var(--wb-card-bg-light)',
    primaryButton: 'var(--wb-primary)',
    hoverActive: 'var(--wb-primary-hover)',
    inactive: 'var(--color-gray-400)',
  };

  // Get theme fonts from site
  const themeFonts = {
    heading: site?.theme?.headingFont,
    body: site?.theme?.bodyFont,
  };

  if (loading && !site) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: themeColors.pageBackground }}
      >
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ 
            borderTopColor: themeColors.primaryButton,
            borderBottomColor: themeColors.primaryButton
          }}
        ></div>
      </div>
    );
  }

  if (error && !site) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: themeColors.pageBackground }}
      >
        <div 
          className="p-6 rounded-lg max-w-lg text-center"
          style={{ 
            backgroundColor: '#FEE2E2',
            borderColor: themeColors.secondary,
            borderWidth: '1px'
          }}
        >
          <h2 
            className="text-xl font-bold mb-2"
            style={{ 
              color: themeColors.secondary,
              fontFamily: themeFonts.heading
            }}
          >
            Error
          </h2>
          <p 
            style={{ 
              color: themeColors.secondary,
              fontFamily: themeFonts.body
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  const homePage = pages.find((p: Page) => p.pageType === 'home');
  const displayPage = homePage;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[home] site from WebBuilderProvider:', site);
    console.log('[home] homePage:', homePage);
  }

  if (!displayPage) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ backgroundColor: themeColors.pageBackground }}
      >
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ 
            color: themeColors.mainText,
            fontFamily: themeFonts.heading
          }}
        >
          No Home Page Found
        </h2>
        <p 
          style={{ 
            color: themeColors.secondaryText,
            fontFamily: themeFonts.body
          }}
        >
          Please create a page with type "home" in the site builder.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen selection:bg-blue-100 selection:text-blue-900"
      style={{ 
        backgroundColor: themeColors.pageBackground,
        fontFamily: themeFonts.body
      }}
    >
      <Header />

      <main>
        {displayPage.hero?.enabled && <HeroSection hero={displayPage.hero} />}

        {displayPage.aboutSection?.enabled && <AboutSection aboutSection={displayPage.aboutSection} />}
        {displayPage.servicesSection?.enabled && <ServicesSection servicesSection={displayPage.servicesSection} />}
        {displayPage.ctaSection?.enabled && <CTASection ctaSection={displayPage.ctaSection} />}

        {displayPage.whyChooseUsSection?.enabled && <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />}
        {displayPage.cta3Section?.enabled && <CTA3Section cta3Section={displayPage.cta3Section} />}
        {displayPage.companyDetailSection?.enabled && <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />}
        {displayPage.projectsSection?.enabled && <ProjectsSection projectsSection={displayPage.projectsSection} />}
        {displayPage.gallerySection?.enabled && <GallerySection gallerySection={displayPage.gallerySection} />}
        {displayPage.blogSection?.enabled && <BlogSection blogSection={displayPage.blogSection} />}
        {displayPage.cta2Section?.enabled && <CTA2Section cta2Section={displayPage.cta2Section} />}

        {displayPage.testimonialsSection?.enabled && <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />}
        {displayPage.faqSection?.enabled && <FAQSection faqSection={displayPage.faqSection} />}
        {displayPage.contactSection?.enabled && <ContactSection contactSection={displayPage.contactSection} />}
      </main>
      
      <Footer />
    </div>
  );
}
