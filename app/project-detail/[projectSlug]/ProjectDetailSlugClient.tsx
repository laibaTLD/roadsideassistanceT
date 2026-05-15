'use client';

import Link from 'next/link';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { Page } from '@/app/lib/types';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface ProjectDetailSlugClientProps {
    project: any;
    site: any;
    otherProjects: any[];
    themeColors: ThemeColors;
    themeFonts: ThemeFonts;
    pageConfig: Page | null;
}

export default function ProjectDetailSlugClient({ project, site, otherProjects, themeColors, themeFonts, pageConfig }: ProjectDetailSlugClientProps) {

    const siteName = site?.business?.name || site?.name || 'Perspective';
    const seoTitle = `${project.seo?.title || project.title} | ${siteName}`;

    return (
        <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
            <SeoHead title={seoTitle} canonicalPath={`/project-detail/${project.slug}`} ogType="article" />
            <Header />

            <main className="relative pt-0">
                {/* Use the page configuration hero if enabled, otherwise fallback to project-specific header but only if it's considered a section we want */}
                {pageConfig?.hero?.enabled ? (
                    <HeroSection hero={pageConfig.hero} />
                ) : (
                    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-end">
                        {project.featuredImage?.url && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={getImageSrc(project.featuredImage.url)}
                                    alt={project.featuredImage.altText || project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50" />
                            </div>
                        )}

                        <div className="container mx-auto px-6 lg:px-12 relative z-10 pb-16 lg:pb-24">
                            <div className="max-w-4xl">
                                {project.category && (
                                    <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/80 mb-6 block font-medium">
                                        {project.category}
                                    </span>
                                )}
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl text-white font-extralight uppercase leading-[1.1] tracking-tight text-balance"
                                    style={{ fontFamily: themeFonts.heading }}
                                >
                                    {project.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                )}

                {(project.clientName || project.location) && (
                    <div className="border-y" style={{ borderColor: `rgba(0, 0, 0, 0.1)`, backgroundColor: themeColors.pageBackground }}>
                        <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-wrap gap-8 md:gap-16 items-center">
                            {project.clientName && (
                                <div className="space-y-1">
                                    <span className="text-[9px] uppercase tracking-[0.3em] block" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>Client</span>
                                    <span className="text-xs uppercase tracking-widest font-medium text-black">{project.clientName}</span>
                                </div>
                            )}
                            {project.location && (
                                <div className="space-y-1">
                                    <span className="text-[9px] uppercase tracking-[0.3em] block" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>Location</span>
                                    <span className="text-xs uppercase tracking-widest font-medium text-black">{project.location}</span>
                                </div>
                            )}
                            <Link
                                href="/project-detail"
                                className="ml-auto flex items-center gap-2 group text-[10px] uppercase tracking-[0.4em] text-black"
                            >
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
                            </Link>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-6 lg:px-12 py-4 lg:py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <article className="lg:col-span-8 lg:col-start-3">
                            {(project.shortDescription || project.description) && (
                                <div
                                    className="prose prose-lg md:prose-xl max-w-none prose-headings:uppercase prose-headings:font-light prose-headings:tracking-widest !text-black mb-16"
                                    style={{ fontFamily: themeFonts.body }}
                                >
                                    {project.shortDescription && <TiptapRenderer content={project.shortDescription} />}
                                    {project.description && <TiptapRenderer content={project.description} />}
                                </div>
                            )}

                            {project.galleryImages && project.galleryImages.length > 0 && (
                                <div className="space-y-4 lg:space-y-8">
                                   <h3 className="text-[11px] uppercase tracking-[0.6em] opacity-40 text-black">Gallery</h3>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    {project.galleryImages.map((img: any, idx: number) => (
                                        <div key={idx} className="overflow-hidden bg-gray-100">
                                            <img
                                                src={getImageSrc(img.url)}
                                                alt={img.altText || project.title}
                                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                  </div>
                                </div>
                            )}

                            {project.servicesUsed && project.servicesUsed.length > 0 && (
                                <div className="mt-16 pt-8 flex flex-wrap gap-4" style={{ borderTop: `1px solid rgba(0, 0, 0, 0.1)` }}>
                                    {project.servicesUsed.map((service: string) => (
                                        <span
                                            key={service}
                                            className="text-[10px] uppercase tracking-[0.3em] px-4 py-2 bg-black/5 text-black"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    </div>
                </div>

                {otherProjects && otherProjects.length > 0 && (
                    <section className="py-24 lg:py-32" style={{ backgroundColor: `rgba(0, 0, 0, 0.02)` }}>
                        <div className="container mx-auto px-6 lg:px-12">
                            <h3 className="text-[11px] uppercase tracking-[0.6em] text-center mb-16 opacity-40 text-black">
                                Related Works
                            </h3>
                            <div className={cn(
                                "grid gap-px bg-black/10",
                                otherProjects.length === 1 ? "grid-cols-1 max-w-md mx-auto" : 
                                otherProjects.length === 2 ? "grid-cols-1 md:grid-cols-2" : 
                                "grid-cols-1 md:grid-cols-3"
                            )}>
                                {otherProjects.map((other: any) => (
                                    <Link
                                        key={other._id}
                                        href={`/project-detail/${other.slug}`}
                                        className="group p-8 lg:p-12 transition-colors flex flex-col h-full bg-white"
                                        style={{ backgroundColor: themeColors.pageBackground }}
                                    >
                                        <span className="text-[9px] uppercase tracking-[0.4em] mb-4 opacity-40 block text-black">Next Project</span>
                                        <h4 className="text-xl uppercase font-light tracking-wide mb-8 group-hover:opacity-60 transition-opacity flex-grow text-black">
                                            {other.title}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-4 text-black">
                                            View Project <ArrowUpRight size={14} />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
