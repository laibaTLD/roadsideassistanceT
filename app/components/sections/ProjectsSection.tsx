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

  // Projects Grid dynamic columns
  const gridCols = displayItems.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 
                  displayItems.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto' : 
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      className={cn('relative w-full py-24 md:py-32', className)}
      style={{ backgroundColor: colors.bg }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl">
            {projectsSection.title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light uppercase tracking-tight leading-none mb-6" style={{ color: colors.mainText }}>
                <TiptapRenderer content={projectsSection.title} as="inline" />
              </h2>
            )}
            {projectsSection.description && (
              <div className="text-xs uppercase tracking-[0.3em] opacity-60 max-w-md" style={{ color: colors.secondaryText }}>
                <TiptapRenderer content={projectsSection.description} />
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className={cn("grid gap-12 lg:gap-16", gridCols)}>
          {displayItems.map((item: any, idx) => {
            const imageUrl = getImageUrl(item.featuredImage || item.image);
            const titleText = item.name || item.title || '';
            const locationText = item.location || '';

            return (
              <Link
                key={idx}
                href={`/project-detail/${item.slug || ''}`}
                className="group flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-700 bg-black/5">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={titleText}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Category/Tag overlay if it exists in the data */}
                  {item.category && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                       <span className="text-[9px] uppercase tracking-widest font-bold text-black">{item.category}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-auto">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-30">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    {locationText && (
                      <span className="text-[9px] uppercase tracking-[0.2em] font-medium opacity-60">
                        {locationText}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-serif font-medium tracking-tight uppercase leading-tight group-hover:opacity-70 transition-opacity" style={{ color: colors.mainText }}>
                    {typeof titleText === 'string' ? titleText : <TiptapRenderer content={titleText} as="inline" />}
                  </h3>
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