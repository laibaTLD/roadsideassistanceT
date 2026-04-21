import { Metadata } from 'next'
import { generateMetadata as buildMetadata, getPageSeoData } from '@/app/lib/metadata'
import HomeClient from './HomeClient'
import { Site, Page } from '@/app/lib/types'

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getHomeData(): Promise<{ site: Site | null; homePage: Page | null }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { site: null, homePage: null };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, homePage: null };
    
    const site = siteData.data;
    
    const pagesResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/pages`, {
      next: { revalidate: 3600 }
    });
    
    if (!pagesResponse.ok) return { site, homePage: null };
    
    const pagesData = await pagesResponse.json();
    if (!pagesData.success || !pagesData.data) return { site, homePage: null };
    
    const pages = pagesData.data;
    const homePage = pages.find((p: any) => p.pageType === 'home');
    
    if (homePage?._id) {
      const pageResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/pages/${homePage._id}`, {
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
    console.error('Error fetching home data:', error);
    return { site: null, homePage: null };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { site, homePage } = await getHomeData();
    
    if (!site) {
      return {
        title: 'Home',
        description: 'Welcome to our website',
      };
    }
    
    if (homePage) {
      return buildMetadata(getPageSeoData(homePage), site);
    }
    
    return {
      title: site?.business?.name || site?.name || 'Home',
      description: 'Welcome to our website',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Home',
      description: 'Welcome to our website',
    };
  }
}

export default async function Home() {
  const { site, homePage } = await getHomeData();
  
  return <HomeClient />;
}
