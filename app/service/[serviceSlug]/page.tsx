import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getServiceSeoData } from '@/app/lib/metadata'
import { Service, Site } from '@/app/lib/types'
import ServiceClient from './ServiceClient'

interface ServicePageProps {
  params: { serviceSlug: string }
}

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getServiceData(serviceSlug: string): Promise<{ site: Site | null; service: Service | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { site: null, service: null };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, service: null };
    
    const site = siteData.data;
    
    const servicesResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/services`, {
      next: { revalidate: 3600 }
    });
    
    if (!servicesResponse.ok) return { site, service: null };
    
    const servicesData = await servicesResponse.json();
    if (!servicesData.success || !servicesData.data) return { site, service: null };
    
    const services = servicesData.data;
    const service = services.find((s: any) => s.slug === serviceSlug);
    
    return { site, service: service || null };
  } catch (error) {
    console.error('Error fetching service data:', error);
    return { site: null, service: null };
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = params;
  const { site, service } = await getServiceData(serviceSlug);
  
  if (!service || !site) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
  
  return buildMetadata(getServiceSeoData(service), site);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { site, service } = await getServiceData(params.serviceSlug);
  
  return <ServiceClient serviceSlug={params.serviceSlug} service={service} />;
}
