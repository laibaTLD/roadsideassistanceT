import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getServiceSeoData } from '@/app/lib/metadata'
import { Service, Site } from '@/app/lib/types'
import ServiceClient from './ServiceClient'
import { siteApi, serviceApi } from '@/app/lib/api'

interface ServicePageProps {
  params: Promise<{ serviceSlug: string }>
}

// Use SSR instead of ISR - fetch fresh data on every request
export const dynamic = 'force-dynamic';

async function getServiceData(serviceSlug: string): Promise<{ site: Site | null; service: Service | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    if (!siteSlug) return { site: null, service: null };

    const site = await siteApi.getSiteBySlug(siteSlug);
    if (!site?.slug) return { site: null, service: null };
    
    // Try to get service by slug directly using the API utility
    let service: Service | null = null;
    try {
      service = await serviceApi.getServiceBySlug(site.slug, serviceSlug);
    } catch (e) {
      // If direct slug fetch fails, fallback to fetching all services
      const services = await serviceApi.getServicesBySite(site.slug);
      service = services.find((s: any) => s.slug === serviceSlug) || null;
    }
    
    return { site, service };
  } catch (error) {
    console.error('Error fetching service data:', error);
    return { site: null, service: null };
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
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
  const { serviceSlug } = await params;
  const { site, service } = await getServiceData(serviceSlug);
  
  return <ServiceClient serviceSlug={serviceSlug} service={service} />;
}
