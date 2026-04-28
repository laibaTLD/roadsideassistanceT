'use client';

import { useEffect, useMemo, useState } from 'react';
import { SeoHead } from '@/app/components/ui/SeoHead';
import ProjectDetailClient from './ProjectDetailClient';
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

export default function ProjectDetailPage() {
  const { site, pages } = useWebBuilder();
  const [projects, setProjects] = useState<any[]>([]);

  const projectListPage = useMemo(() => pages.find((p) => p.pageType === 'project-detail') || null, [pages]);

  useEffect(() => {
    let cancelled = false;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[project-detail-list] site from WebBuilderProvider:', site);
    }

    const load = async () => {
      if (!site?.slug) return;

      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[project-detail-list] fetching projects for siteSlug:', site.slug);
        }
        const data = await projectApi.getProjectsBySite(site.slug);
        const published = (data || []).filter((p: any) => p.status === 'published');
        if (process.env.NODE_ENV !== 'production') {
          console.log('[project-detail-list] fetched projects (published):', published);
        }
        if (!cancelled) setProjects(published);
      } catch (error) {
        console.error('Error fetching projects:', error);
        if (!cancelled) setProjects([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [site?.slug]);

  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = useMemo(() => `Projects | ${siteName}`, [siteName]);
  const themeColors = useMemo(() => getThemeColors(site), [site]);
  const themeFonts = useMemo(() => getThemeFonts(site), [site]);

  return (
    <>
      <SeoHead title={seoTitle} canonicalPath="/project-detail" ogType="website" />
      <ProjectDetailClient site={site} projects={projects} themeColors={themeColors} themeFonts={themeFonts} pageConfig={projectListPage} />
    </>
  );
}
