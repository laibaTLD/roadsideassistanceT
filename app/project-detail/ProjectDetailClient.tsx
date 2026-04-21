'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { getImageSrc } from '@/app/lib/utils';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailClientProps {
    site: any;
    projects: any[];
    themeColors: ThemeColors;
    themeFonts: ThemeFonts;
}

export default function ProjectDetailClient({ site, projects, themeColors, themeFonts }: ProjectDetailClientProps) {

    const pinWrapRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);

    const publishedProjects = (projects || []).filter((p: any) => p.status === 'published');
    const siteName = site?.business?.name || site?.name || 'Perspective';

    useGSAP(() => {
        if (!publishedProjects.length || !sectionsRef.current || !pinWrapRef.current) return;

        const track = sectionsRef.current;
        const pinWrap = pinWrapRef.current;

        // Wait one frame so the DOM has rendered and scrollWidth is accurate
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: pinWrap,
                start: 'top top',
                // ✅ end = exact pixel distance the track needs to travel
                end: () => `+=${track.scrollWidth - pinWrap.offsetWidth}`,
                pin: true,
                anticipatePin: 1,
                scrub: true,          // ✅ boolean = instant sync, no tween lag at all
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // ✅ Direct transform — bypass GSAP tween entirely for max perf
                    const x = -(track.scrollWidth - pinWrap.offsetWidth) * self.progress;
                    track.style.transform = `translate3d(${x}px, 0px, 0px)`;
                },
            });
        });

        return () => ctx.revert();

    }, { dependencies: [publishedProjects.length] });

    return (
        <div style={{ backgroundColor: themeColors.pageBackground }}>
            <SeoHead title={`Projects | ${siteName}`} canonicalPath="/project-detail" ogType="website" />
            <Header />

            {/* ── Hero section — edit freely ─────────────────────────── */}
            <section
                className="h-screen w-full flex flex-col items-center justify-center gap-6"
                style={{ backgroundColor: themeColors.sectionBackgroundDark }}
            >
                <h1
                    className="text-5xl lg:text-8xl font-light tracking-tighter text-center"
                    style={{ color: themeColors.darkPrimaryText, fontFamily: themeFonts.heading }}
                >
                    {siteName}
                </h1>
                <p
                    className="text-xs uppercase tracking-[0.5em]"
                    style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                >
                    Scroll to explore
                </p>
            </section>
            {/* ──────────────────────────────────────────────────────── */}

            {/* Pin container — GSAP pins this */}
            <div
                ref={pinWrapRef}
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* Track — we move this with translate3d */}
                <div
                    ref={sectionsRef}
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: 'max-content',
                        willChange: 'transform',
                        // GPU compositing layer — critical for smooth scrolling
                        transform: 'translate3d(0px, 0px, 0px)',
                    }}
                >
                    {/* Intro panel */}
                    <section
                        className="h-full flex flex-col justify-center px-12 lg:px-20 border-r flex-shrink-0"
                        style={{
                            width: 'clamp(280px, 30vw, 480px)',
                            borderColor: `${themeColors.secondaryText}15`,
                        }}
                    >
                        <h2
                            className="text-3xl lg:text-5xl font-light tracking-tighter mb-4"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            {siteName}
                        </h2>
                        <p
                            className="text-xs uppercase tracking-[0.4em] font-medium"
                            style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                        >
                            Selected Projects
                        </p>
                    </section>

                    {/* Project cards */}
                    {publishedProjects.map((project: any) => (
                        <Link
                            key={project._id}
                            href={`/project-detail/${project.slug}`}
                            className="relative h-full group border-r overflow-hidden flex-shrink-0"
                            style={{
                                width: 'clamp(320px, 45vw, 800px)',
                                borderColor: `${themeColors.secondaryText}15`,
                            }}
                        >
                            <div className="absolute inset-0 bg-zinc-100 overflow-hidden">
                                {project.featuredImage ? (
                                    <img
                                        src={getImageSrc(project.featuredImage.url)}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                            </div>

                            {project.category && (
                                <div
                                    className="absolute top-12 right-[-40px] rotate-45 w-40 py-1 text-center shadow-lg"
                                    style={{
                                        backgroundColor: themeColors.primaryButton,
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.2em',
                                        zIndex: 10,
                                    }}
                                >
                                    {project.category.toUpperCase()}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-12 lg:p-16 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                <h2
                                    className="text-3xl lg:text-4xl uppercase tracking-[0.1em] mb-2"
                                    style={{ color: themeColors.pageBackground, fontFamily: themeFonts.heading }}
                                >
                                    {project.title}
                                </h2>
                                <div className="flex flex-col gap-1">
                                    <span
                                        className="text-xs uppercase tracking-[0.3em] opacity-80"
                                        style={{ color: themeColors.pageBackground, fontFamily: themeFonts.body }}
                                    >
                                        {project.location || 'Location'}
                                    </span>
                                    <div
                                        className="w-0 group-hover:w-full h-[1px] transition-all duration-1000 ease-in-out"
                                        style={{ backgroundColor: themeColors.pageBackground }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div className="h-full flex-shrink-0" style={{ width: '10vw' }} />
                </div>
            </div>

            <Footer />
        </div>
    );
}