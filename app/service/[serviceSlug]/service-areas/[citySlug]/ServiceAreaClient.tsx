'use client';

import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/serving-area-detail-sections/Hero';
import { About } from '@/app/components/sections/serving-area-detail-sections/About';
import { ServiceOverview } from '@/app/components/sections/serving-area-detail-sections/ServiceOverview';
import { ServiceDetails } from '@/app/components/sections/serving-area-detail-sections/ServiceDetails';
import { WhyChooseUs } from '@/app/components/sections/serving-area-detail-sections/WhyChooseUs';
import { Highlights } from '@/app/components/sections/serving-area-detail-sections/Highlights';
import { OurServices } from '@/app/components/sections/serving-area-detail-sections/OurServices';
import { ServingAreas } from '@/app/components/sections/serving-area-detail-sections/ServingAreas';
import { FAQs } from '@/app/components/sections/serving-area-detail-sections/FAQs';
import { CTA } from '@/app/components/sections/serving-area-detail-sections/CTA';

interface ServiceAreaClientProps {
  serviceArea: any | null;
}

export default function ServiceAreaClient({ serviceArea }: ServiceAreaClientProps) {
  if (!serviceArea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Area Not Found</h2>
          <p className="text-gray-600 mb-4">The service area page could not be found.</p>
          <a href="/" className="inline-block text-blue-600 hover:underline">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  // Individual section data
  const serviceOverviewData = serviceArea.serviceOverview;
  const serviceDetailsData = serviceArea.serviceDetails;
  const whyChooseUsData = serviceArea.whyChooseUs || serviceArea.about;
  const servingAreasData = serviceArea.servingAreas;

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* 1. Hero Section */}
        <HeroSection hero={serviceArea.hero} />
        
        {/* 2. Highlights */}
        <Highlights highlights={serviceArea.highlights} />
        
        {/* 3. About */}
        <About about={serviceArea.about} />
        
        {/* 4. Our Services */}
        <OurServices services={serviceArea.ourServices || serviceArea.services} />
        
        {/* 5. CTA (Call To Action) */}
        <CTA cta={serviceArea.cta} />
        
        {/* 6. Service Overview */}
        <ServiceOverview overview={serviceOverviewData} />
        
        {/* 7. Service Details */}
        <ServiceDetails details={serviceDetailsData} />
        
        {/* 8. Why Choose Us */}
        <WhyChooseUs whyChooseUs={whyChooseUsData} />
        
        {/* 9. FAQs */}
        <FAQs faqs={serviceArea.faqs} />
        
        {/* 10. Service Areas */}
        <ServingAreas service={servingAreasData} />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
