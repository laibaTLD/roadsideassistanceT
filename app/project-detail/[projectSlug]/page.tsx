'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';
import ProjectDetailSlugClient from './ProjectDetailSlugClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { projectApi } from '@/app/lib/api';



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

export default function ProjectDetailSlugPage() {
  const params = useParams<{ projectSlug: string }>();
  const projectSlug = params?.projectSlug;
  const { site, pages } = useWebBuilder();

  const [project, setProject] = useState<any | null>(null);
  const [otherProjects, setOtherProjects] = useState<any[]>([]);

  const projectDetailPage = useMemo(() => pages.find((p) => p.pageType === 'project-detail') || null, [pages]);

  useEffect(() => {
    let cancelled = false;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[project-detail] params:', { projectSlug });
      console.log('[project-detail] site from WebBuilderProvider:', site);
    }

    const load = async () => {
      if (!site?.slug || !projectSlug) return;

      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[project-detail] fetching project:', { siteSlug: site.slug, projectSlug });
        }
        const fetchedProject = await projectApi.getProjectBySlug(site.slug, projectSlug);
        if (process.env.NODE_ENV !== 'production') {
          console.log('[project-detail] fetched project:', fetchedProject);
        }
        if (!cancelled) setProject(fetchedProject);

        const allProjects = await projectApi.getProjectsBySite(site.slug);
        const others = (allProjects || [])
          .filter((p: any) => p.status === 'published' && p.slug !== projectSlug)
          .slice(0, 3);
        if (process.env.NODE_ENV !== 'production') {
          console.log('[project-detail] other projects:', others);
        }
        if (!cancelled) setOtherProjects(others);
      } catch (error) {
        console.error('Error fetching project:', error);
        if (!cancelled) {
          setProject(null);
          setOtherProjects([]);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [site?.slug, projectSlug]);

  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = useMemo(() => {
    if (!project) return siteName;
    return `${project.seo?.title || project.title} | ${siteName}`;
  }, [project?.seo?.title, project?.title, siteName]);

  const seoDescription = useMemo(() => {
    if (!project) return '';
    return truncate(project.seo?.description || tiptapToText(project.shortDescription) || tiptapToText(project.description), 160);
  }, [project?.seo?.description, project?.shortDescription, project?.description]);

  const ogImage = useMemo(() => {
    if (!project) return undefined;
    return normalizeSeoImage(project.seo?.ogImageUrl || project.featuredImage?.url, project.title);
  }, [project?.seo?.ogImageUrl, project?.featuredImage?.url, project?.title]);

  const themeColors = useMemo(() => getThemeColors(site), [site]);
  const themeFonts = useMemo(() => getThemeFonts(site), [site]);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 uppercase tracking-widest">Project Not Found</div>;
  }

  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={`/project-detail/${project.slug}`} ogType="article" ogImage={ogImage} />
      <ProjectDetailSlugClient project={project} site={site} otherProjects={otherProjects} themeColors={themeColors} themeFonts={themeFonts} pageConfig={projectDetailPage} />
    </>
  );
}
