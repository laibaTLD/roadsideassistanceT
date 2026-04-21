import { AboutSection } from '@/app/components/sections/AboutSection';
import { ServiceHighlightsSection } from '@/app/components/sections/ServiceHighlightsSection';
import { CTASection } from '@/app/components/sections/CTASection';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

interface Page {
  _id: string;
  name: string;
  slug: string;
  pageType: string;
  aboutSection?: {
    enabled: boolean;
    title?: { type: string; content: any[] };
    description?: { type: string; content: any[] };
    image?: { url: string; altText?: string };
    features?: Array<{ icon: string; label: string; description: string }>;
  };
  serviceHighlightsSection?: {
    enabled: boolean;
    title?: { type: string; content: any[] };
    description?: { type: string; content: any[] };
    highlights?: Array<{ title: any; description: any }>;
    layout?: string;
  };
  ctaSection?: {
    enabled: boolean;
    title?: { type: string; content: any[] };
    description?: { type: string; content: any[] };
    primaryButton?: { label: string; href: string };
    backgroundImage?: string;
    backgroundColor?: string;
  };
}

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getHomePageData(): Promise<{ site: any; homePage: Page | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    
    // Fetch site
    const siteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { site: null, homePage: null };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, homePage: null };
    
    const site = siteData.data;
    
    // Fetch pages
    const pagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/sites/${site.slug}/pages`, {
      next: { revalidate: 3600 }
    });
    
    if (!pagesResponse.ok) return { site, homePage: null };
    
    const pagesData = await pagesResponse.json();
    if (!pagesData.success || !pagesData.data) return { site, homePage: null };
    
    const pages: Page[] = pagesData.data;
    const homePage = pages.find(p => p.pageType === 'home');
    
    if (homePage?._id) {
      // Fetch full home page data
      const pageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/sites/${site.slug}/pages/${homePage._id}`, {
        next: { revalidate: 3600 }
      });
      
      if (!pageResponse.ok) return { site, homePage: null };
      
      const pageData = await pageResponse.json();
      if (pageData.success && pageData.data?.page) {
        return { site, homePage: pageData.data.page };
      }
    }
    
    return { site, homePage: homePage || null };
  } catch (error) {
    console.error('Error fetching home page:', error);
    return { site: null, homePage: null };
  }
}

export default async function AboutPage() {
  const { site, homePage } = await getHomePageData();

  // Default configurations for about page sections (fallback)
  const defaultAboutSection = {
    enabled: true,
    title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'About Us' }] }] },
    description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'We are dedicated to delivering exceptional service and creating lasting value for our clients.' }] }] },
    features: [
      { icon: 'check', label: 'Quality Service', description: 'We deliver top-notch solutions tailored to your needs.' },
      { icon: 'users', label: 'Expert Team', description: 'Our experienced professionals are here to help.' },
      { icon: 'clock', label: 'Timely Delivery', description: 'We respect your time and deliver on schedule.' },
    ],
  };

  const defaultServiceHighlightsSection = {
    enabled: true,
    title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Our Impact' }] }] },
    description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Numbers that speak for themselves' }] }] },
    layout: 'grid' as const,
    highlights: [
      { title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '500+' }] }] }, description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Projects Completed' }] }] } },
      { title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '98%' }] }] }, description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Client Satisfaction' }] }] } },
      { title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '10+' }] }] }, description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Years Experience' }] }] } },
      { title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '50+' }] }] }, description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Team Members' }] }] } },
    ],
  };

  const defaultCtaSection = {
    enabled: true,
    title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ready to Get Started?' }] }] },
    description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contact us today to discuss your project and see how we can help.' }] }] },
    primaryButton: {
      label: 'Contact Us',
      href: '/contact-us',
    },
  };

  // Use home page data if available, otherwise use defaults
  const aboutSection = homePage?.aboutSection?.enabled
    ? { ...homePage.aboutSection, features: homePage.aboutSection.features || [] }
    : defaultAboutSection;
  const serviceHighlightsSection = homePage?.serviceHighlightsSection?.enabled
    ? { 
        ...homePage.serviceHighlightsSection, 
        highlights: homePage.serviceHighlightsSection.highlights || [],
        layout: (homePage.serviceHighlightsSection.layout as 'grid' | 'carousel' | 'list') || 'grid'
      }
    : defaultServiceHighlightsSection;
  const ctaSection = homePage?.ctaSection?.enabled ? homePage.ctaSection : defaultCtaSection;

  const themeColors = {
    primary: site?.theme?.darkPrimaryColor || '#000000',
    secondary: site?.theme?.darkSecondaryColor || '#EF4444',
    accent: site?.theme?.lightPrimaryColor || '#3B82F6',
    mainText: site?.theme?.darkPrimaryColor || '#1F2937',
    secondaryText: site?.theme?.darkSecondaryColor || '#6B7280',
    pageBackground: site?.theme?.pageBackgroundColor || '#FFFFFF',
    sectionBackground: site?.theme?.sectionBackgroundColorLight || '#F9FAFB',
    hoverActive: site?.theme?.hoverActiveColorLight || '#2563EB',
    inactive: site?.theme?.inactiveColorLight || '#9CA3AF',
  };

  const themeFonts = {
    heading: site?.theme?.headingFont,
    body: site?.theme?.bodyFont,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeColors.pageBackground, fontFamily: themeFonts.body }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* About Section */}
        <AboutSection aboutSection={aboutSection} />

        {/* Service Highlights Section */}
        <ServiceHighlightsSection serviceHighlightsSection={serviceHighlightsSection} />

        {/* CTA Section */}
        <CTASection ctaSection={ctaSection} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
