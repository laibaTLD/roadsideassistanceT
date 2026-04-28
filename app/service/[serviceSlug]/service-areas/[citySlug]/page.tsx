import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getPageSeoData } from '@/app/lib/metadata'
import { Site } from '@/app/lib/types'
import type { ServiceAreaPage } from '@/app/lib/types'
import ServiceAreaClient from './ServiceAreaClient'

interface ServiceAreaPageProps {
  params: { serviceSlug: string; citySlug: string }
}

// Use SSR instead of ISR - fetch fresh data on every request
export const dynamic = 'force-dynamic';

async function getServiceAreaData(serviceSlug: string, citySlug: string): Promise<{ site: Site | null; serviceArea: ServiceAreaPage | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      cache: 'no-store'
    });
    
    if (!siteResponse.ok) return { site: null, serviceArea: null };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, serviceArea: null };
    
    const site = siteData.data;
    
    const serviceAreaResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/service-areas/by-service/${serviceSlug}/${citySlug}`, {
      cache: 'no-store'
    });
    
    if (!serviceAreaResponse.ok) return { site, serviceArea: null };
    
    const serviceAreaData = await serviceAreaResponse.json();
    if (serviceAreaData.success && serviceAreaData.data) {
      return { site, serviceArea: serviceAreaData.data };
    }
    
    return { site, serviceArea: null };
  } catch (error) {
    console.error('Error fetching service area data:', error);
    return { site: null, serviceArea: null };
  }
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const { serviceSlug, citySlug } = params;
  const { site, serviceArea } = await getServiceAreaData(serviceSlug, citySlug);
  
  if (!serviceArea || !site) {
    return {
      title: 'Service Area Not Found',
      description: 'The requested service area page could not be found.',
    };
  }
  
  return buildMetadata(getPageSeoData(serviceArea), site);
}

export default async function ServiceAreaPage({ params }: ServiceAreaPageProps) {
  const { site, serviceArea } = await getServiceAreaData(params.serviceSlug, params.citySlug);
  
  return <ServiceAreaClient serviceArea={serviceArea} />;
}
