import { Metadata } from 'next'
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';
import ProjectDetailSlugClient from './ProjectDetailSlugClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

interface ProjectDetailSlugPageProps {
  params: { projectSlug: string }
}

// Enable ISR - revalidate every hour (3600 seconds)
export const revalidate = 3600;

async function getProject(projectSlug: string): Promise<{ project: any; site: any; otherProjects: any[] }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!siteResponse.ok) return { project: null, site: null, otherProjects: [] };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { project: null, site: null, otherProjects: [] };
    
    const site = siteData.data;
    
    const projectResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/projects/${projectSlug}`, {
      next: { revalidate: 3600 }
    });
    
    if (!projectResponse.ok) return { project: null, site, otherProjects: [] };
    
    const projectData = await projectResponse.json();
    if (!projectData.success || !projectData.data) return { project: null, site, otherProjects: [] };
    
    const project = projectData.data;
    
    const allProjectsResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/projects`, {
      next: { revalidate: 3600 }
    });
    
    if (!allProjectsResponse.ok) return { project, site, otherProjects: [] };
    
    const allProjectsData = await allProjectsResponse.json();
    if (!allProjectsData.success || !allProjectsData.data) return { project, site, otherProjects: [] };
    
    const otherProjects = allProjectsData.data
      .filter((p: any) => p.status === 'published' && p.slug !== projectSlug)
      .slice(0, 3);
    
    return { project, site, otherProjects };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { project: null, site: null, otherProjects: [] };
  }
}

export async function generateStaticParams() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`${apiUrl}/api/public/sites/${siteSlug}/projects`);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success || !data.data) return [];
    
    const projects = data.data.filter((p: any) => p.status === 'published');
    
    return projects.map((project: any) => ({
      projectSlug: project.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ProjectDetailSlugPageProps): Promise<Metadata> {
  const { projectSlug } = params;
  const { project, site } = await getProject(projectSlug);
  
  if (!project || !site) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }
  
  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = `${project.seo?.title || project.title} | ${siteName}`;
  const seoDescription = truncate(project.seo?.description || tiptapToText(project.shortDescription) || tiptapToText(project.description), 160);
  const ogImage = normalizeSeoImage(project.seo?.ogImageUrl || project.featuredImage?.url, project.title);
  
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [{ url: ogImage as unknown as string }] : undefined,
      type: 'article',
    },
  };
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

export default async function ProjectDetailSlugPage({ params }: ProjectDetailSlugPageProps) {
  const { projectSlug } = params;
  const { project, site, otherProjects } = await getProject(projectSlug);
  
  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 uppercase tracking-widest">Project Not Found</div>;
  }
  
  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = `${project.seo?.title || project.title} | ${siteName}`;
  const seoDescription = truncate(project.seo?.description || tiptapToText(project.shortDescription) || tiptapToText(project.description), 160);
  const ogImage = normalizeSeoImage(project.seo?.ogImageUrl || project.featuredImage?.url, project.title);
  const themeColors = getThemeColors(site);
  const themeFonts = getThemeFonts(site);
  
  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={`/project-detail/${project.slug}`} ogType="article" ogImage={ogImage} />
      <ProjectDetailSlugClient project={project} site={site} otherProjects={otherProjects} themeColors={themeColors} themeFonts={themeFonts} />
    </>
  );
}
