import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getPageSeoData } from '@/app/lib/metadata'
import PageSlugClient from './PageSlugClient'
import { Site, Page, ServiceAreaPage } from '@/app/lib/types'

interface PageSlugPageProps {
  params: { pageSlug: string }
}

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getPageData(pageSlug: string): Promise<{ site: Site | null; page: Page | null; serviceArea: ServiceAreaPage | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { site: null, page: null, serviceArea: null };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, page: null, serviceArea: null };
    
    const site = siteData.data;
    
    const pageResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/pages/${pageSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!pageResponse.ok) return { site, page: null, serviceArea: null };
    
    const pageData = await pageResponse.json();
    if (!pageData.success || !pageData.data) return { site, page: null, serviceArea: null };
    
    const page = pageData.data;
    
    const serviceAreaResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/service-areas/${pageSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!serviceAreaResponse.ok) return { site, page, serviceArea: null };
    
    const serviceAreaData = await serviceAreaResponse.json();
    if (serviceAreaData.success && serviceAreaData.data) {
      return { site, page, serviceArea: serviceAreaData.data };
    }
    
    return { site, page, serviceArea: null };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return { site: null, page: null, serviceArea: null };
  }
}

export async function generateStaticParams() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`);
    
    if (!siteResponse.ok) return [];
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return [];
    
    const site = siteData.data;
    
    const pagesResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/pages`);
    
    if (!pagesResponse.ok) return [];
    
    const pagesData = await pagesResponse.json();
    if (!pagesData.success || !pagesData.data) return [];
    
    const pages = pagesData.data.filter((p: any) => p.status === 'published');
    const pageSlugs = pages.map((p: any) => ({ pageSlug: p.slug }));
    
    const serviceAreasResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/service-areas`);
    
    if (!serviceAreasResponse.ok) return pageSlugs;
    
    const serviceAreasData = await serviceAreasResponse.json();
    if (serviceAreasData.success && serviceAreasData.data) {
      const serviceAreas = serviceAreasData.data;
      const serviceAreaSlugs = serviceAreas.map((s: any) => ({ pageSlug: s.slug }));
      return [...pageSlugs, ...serviceAreaSlugs];
    }
    
    return pageSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageSlugPageProps): Promise<Metadata> {
  const { page, site } = await getPageData(params.pageSlug);
  
  if (!page || !site) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
  
  return buildMetadata(getPageSeoData(page), site);
}

export default async function PageSlugPage({ params }: PageSlugPageProps) {
  const { site, page, serviceArea } = await getPageData(params.pageSlug);
  
  return <PageSlugClient pageSlug={params.pageSlug} page={page} serviceArea={serviceArea} />;
}
