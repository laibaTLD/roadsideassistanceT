'use client';

import React, { memo } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface ProjectSectionProps {
  projectSection: Page['projectSection'];
  className?: string;
}

export const ProjectSection: React.FC<ProjectSectionProps> = memo(({ projectSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  if (!projectSection?.enabled) return null;
  if (!projectSection.title && !projectSection.description) return null;

  return (
    <section
      className={cn('relative w-full py-16 md:py-24', className)}
      style={{ backgroundColor: themeColors.pageBackground }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          {projectSection.title && (
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light uppercase tracking-tight leading-none mb-6"
              style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
            >
              <TiptapRenderer content={projectSection.title} as="inline" />
            </h2>
          )}
          {projectSection.description && (
            <div
              className="text-xs uppercase tracking-[0.3em] opacity-60 max-w-md"
              style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
            >
              <TiptapRenderer content={projectSection.description} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

ProjectSection.displayName = 'ProjectSection';

export default ProjectSection;
