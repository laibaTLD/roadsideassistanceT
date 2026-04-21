import type { Metadata } from 'next'
import './globals.css'
import { WebBuilderProvider } from '@/app/providers/WebBuilderProvider'
import { ErrorBoundary } from '@/app/components/ui/ErrorBoundary'
import { ThemeFontWrapper } from './components/ui/ThemeFontWrapper'
import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { ChatbotProviderWrapper } from '@/app/providers/ChatbotProviderWrapper'

export const metadata: Metadata = {
  title: 'Web Builder Site',
  description: 'Generated site using Web Builder',
}

import Preloader from './components/ui/Preloader'

async function getSiteData() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is required');
    }
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return null;
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return null;
    
    const site = siteData.data;
    
    // Fetch pages for navigation
    const pagesResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/pages`, {
      next: { revalidate: 3600 }
    });
    
    if (!pagesResponse.ok) return { site, pages: [] };
    
    const pagesData = await pagesResponse.json();
    if (!pagesData.success || !pagesData.data) return { site, pages: [] };
    
    return { site, pages: pagesData.data };
  } catch (error) {
    console.error('Error fetching site data:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteData = await getSiteData();
  
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <WebBuilderProvider initialData={siteData || undefined}>
            <LanguageProvider>
              <ChatbotProviderWrapper>
                <ThemeFontWrapper>
                  <main className="min-h-screen">
                    <Preloader />
                    {children}
                  </main>
                </ThemeFontWrapper>
              </ChatbotProviderWrapper>
            </LanguageProvider>
          </WebBuilderProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
