'use client';

import React, { useMemo, memo } from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn, getImageSrc } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ArrowRight } from 'lucide-react';

interface ProjectsSectionProps {
  projectsSection: Page['projectsSection'];
  className?: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = memo(({ projectsSection, className }) => {
  const themeColors = useThemeColors();
  const { projects } = useWebBuilder();

  if (!projectsSection?.enabled) return null;

  // Get projects from provider or manual selection - memoized
  const displayItems = useMemo(() => {
    const publishedProjects = (projects || []).filter((p) => p.status === 'published');
    return projectsSection.projects?.length ? projectsSection.projects : publishedProjects;
  }, [projects, projectsSection.projects]);

  if (displayItems.length === 0) return null;

  // Theme colors - memoized
  const colors = useMemo(() => ({
    bg: themeColors.pageBackground,
    primary: themeColors.primaryButton,
    mainText: themeColors.mainText,
    secondaryText: themeColors.secondaryText
  }), [themeColors]);

  // Memoize getImageUrl function
  const getImageUrl = useMemo(() => (image: any) => {
    if (!image) return null;
    const img = image as any;
    const imagePath = typeof img === 'object' && img !== null
      ? img.url || img.src
      : img;
    if (!imagePath) return null;
    return getImageSrc(imagePath);
  }, []);

  return (
    <section
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="projects-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {projectsSection.title && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.mainText }}>
                <TiptapRenderer content={projectsSection.title} as="inline" />
              </h2>
            )}
          </div>

          {projectsSection.description && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: colors.secondaryText }}>
              <TiptapRenderer content={projectsSection.description} as="inline" />
            </p>
          )}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayItems.map((item: any, idx) => {
            const imageUrl = getImageUrl(item.featuredImage || item.image);
            const titleText = item.name || item.title || '';
            const locationText = item.location || '';

            return (
              <Link
                key={idx}
                href={`/project-detail/${item.slug || ''}`}
                className="project-card group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={titleText}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div 
                      className="w-full h-full"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `linear-gradient(to top, ${colors.primary}90, transparent, transparent)` }} />
                  
                  {/* View Project Link */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-sm font-medium" style={{ color: 'white' }}>View Project</span>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: 'white' }} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-serif font-semibold leading-tight" style={{ color: colors.mainText }}>
                    {typeof titleText === 'string' ? titleText : <TiptapRenderer content={titleText} as="inline" />}
                  </h3>
                  {locationText && (
                    <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: colors.secondaryText }}>
                      {locationText}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;