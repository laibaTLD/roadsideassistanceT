import { ContactSection } from '@/app/components/sections/ContactSection';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getSiteData() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return null;
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return null;
    
    return siteData.data;
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
}

export default async function ContactPage() {
  const site = await getSiteData();

  // Use site contactSection if available, otherwise create default contact section config
  const contactSection = site?.contactSection ? {
    ...site.contactSection,
    showMap: true // Ensure map is shown on dedicated contact page
  } : {
    enabled: true,
    title: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'CONTACT US' }] }] },
    description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: "Have a question or want to work together? We'd love to hear from you." }] }] },
    showForm: true,
    showMap: true,
    showContactInfo: true,
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content - Contact Section */}
      <main className="flex-1">
        <ContactSection contactSection={contactSection} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
