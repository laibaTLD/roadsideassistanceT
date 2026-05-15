'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { Page } from '@/app/lib/types';

interface ProjectDetailClientProps {
    site: any;
    projects: any[];
    themeColors: ThemeColors;
    themeFonts: ThemeFonts;
    pageConfig: Page | null;
}

export default function ProjectDetailClient({ site, projects, themeColors, themeFonts, pageConfig }: ProjectDetailClientProps) {
    const publishedProjects = (projects || []).filter((p: any) => p.status === 'published');
    const siteName = site?.business?.name || site?.name || 'Perspective';

    // Grid columns logic based on count
    const gridCols = publishedProjects.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 
                    publishedProjects.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto' : 
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div style={{ backgroundColor: themeColors.pageBackground }}>
            <SeoHead title={`Projects | ${siteName}`} canonicalPath="/project-detail" ogType="website" />
            <Header />

            {/* Use the page configuration hero if enabled */}
            {pageConfig?.hero?.enabled && <HeroSection hero={pageConfig.hero} />}

            <main className="py-24 lg:py-32">
                <div className="container mx-auto px-6 lg:px-12">
                    {/* Section Intro */}
                    <div className="mb-16 lg:mb-24">
                        <span className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-40 mb-4 block">
                            Our Portfolio
                        </span>
                        <h1 
                            className="text-4xl md:text-5xl lg:text-7xl font-serif font-light uppercase tracking-tight leading-none"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            Selected Projects
                        </h1>
                    </div>

                    {/* Projects Grid */}
                    {publishedProjects.length > 0 ? (
                        <div className={cn("grid gap-12 lg:gap-16", gridCols)}>
                            {publishedProjects.map((project: any, idx) => (
                                <Link
                                    key={project._id}
                                    href={`/project-detail/${project.slug}`}
                                    className="group flex flex-col h-full"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden mb-8 shadow-xl group-hover:shadow-2xl transition-all duration-700 bg-black/5">
                                        {project.featuredImage ? (
                                            <img
                                                src={getImageSrc(project.featuredImage.url)}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                        
                                        {project.category && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                                <span className="text-[9px] uppercase tracking-widest font-bold text-black">{project.category}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-30">
                                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                            </span>
                                            {project.location && (
                                                <span className="text-[9px] uppercase tracking-[0.2em] font-medium opacity-60">
                                                    {project.location}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h2 
                                            className="text-xl lg:text-2xl font-serif font-medium tracking-tight uppercase leading-tight group-hover:opacity-70 transition-opacity" 
                                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                                        >
                                            {project.title}
                                        </h2>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center opacity-40 uppercase tracking-widest text-sm">
                            No projects found
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}