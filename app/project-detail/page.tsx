import { SeoHead } from '@/app/components/ui/SeoHead';
import ProjectDetailClient from './ProjectDetailClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getProjectsData(): Promise<{ site: any; projects: any[] }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { site: null, projects: [] };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { site: null, projects: [] };
    
    const site = siteData.data;
    
    const projectsResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/projects`, {
      next: { revalidate: 3600 }
    });
    
    if (!projectsResponse.ok) return { site, projects: [] };
    
    const projectsData = await projectsResponse.json();
    if (!projectsData.success || !projectsData.data) return { site, projects: [] };
    
    return { site, projects: projectsData.data };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { site: null, projects: [] };
  }
}

function getThemeColors(site: any): ThemeColors {
    return {
        mainText: 'var(--wb-text-main)',
        secondaryText: 'var(--wb-text-secondary)',
        darkPrimaryText: 'var(--wb-text-on-dark)',
        darkSecondaryText: 'var(--wb-text-on-dark-secondary)',
        lightPrimaryText: 'var(--wb-text-main)',
        lightSecondaryText: 'var(--wb-text-secondary)',
        pageBackground: 'var(--wb-page-bg)',
        sectionBackground: 'var(--wb-section-bg-light)',
        sectionBackgroundLight: 'var(--wb-section-bg-light)',
        sectionBackgroundDark: 'var(--wb-section-bg-dark)',
        cardBackground: 'var(--wb-card-bg-light)',
        cardBackgroundLight: 'var(--wb-card-bg-light)',
        cardBackgroundDark: 'var(--wb-card-bg-dark)',
        primaryButton: 'var(--wb-primary)',
        primaryButtonLight: 'var(--wb-primary)',
        primaryButtonDark: 'var(--wb-primary)',
        hoverActive: 'var(--wb-primary-hover)',
        hoverActiveLight: 'var(--wb-primary-hover)',
        hoverActiveDark: 'var(--wb-primary-hover)',
        inactive: 'var(--color-gray-400)',
        inactiveLight: 'var(--color-gray-300)',
        inactiveDark: 'var(--color-gray-600)',
        accent: 'var(--wb-primary)',
    };
}

function getThemeFonts(site: any): ThemeFonts {
    return {
        heading: site?.theme?.headingFont,
        body: site?.theme?.bodyFont,
    };
}

export default async function ProjectDetailPage() {
  const { site, projects } = await getProjectsData();
  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = `Projects | ${siteName}`;
  const themeColors = getThemeColors(site);
  const themeFonts = getThemeFonts(site);

  return (
    <>
      <SeoHead title={seoTitle} canonicalPath="/project-detail" ogType="website" />
      <ProjectDetailClient site={site} projects={projects} themeColors={themeColors} themeFonts={themeFonts} />
    </>
  );
}
