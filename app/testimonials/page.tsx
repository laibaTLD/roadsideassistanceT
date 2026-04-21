import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getTestimonialsData() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return null;
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return null;
    
    const site = siteData.data;
    
    // Testimonials are typically stored in the site data or fetched separately
    // For now, we'll return the site data which may contain testimonials
    return { site };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return null;
  }
}

export default async function TestimonialsPage() {
  const data = await getTestimonialsData();
  const site = data?.site;

  // Default testimonials section configuration
  const defaultTestimonialsSection = {
    enabled: true,
    title: { 
      type: 'doc', 
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Client Testimonials' }] }] 
    },
    description: { 
      type: 'doc', 
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hear what our clients have to say about our services' }] }] 
    },
    testimonials: site?.testimonials || [],
  };

  // Use fetched data or defaults
  const testimonialsSection = defaultTestimonialsSection;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <TestimonialsSection testimonialsSection={testimonialsSection} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
