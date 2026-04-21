'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/app/lib/types';
import { getImageSrc } from '@/app/lib/utils';
import { Header } from '@/app/components/layout/Header';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

interface BlogPageClientProps {
    site: any;
    posts: BlogPost[];
    themeColors: ThemeColors;
    themeFonts: ThemeFonts;
}

export default function BlogPageClient({ site, posts, themeColors, themeFonts }: BlogPageClientProps) {
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (posts.length === 0 || !sectionsRef.current || !scrollContainerRef.current) return;

        gsap.registerPlugin(ScrollTrigger);

        const target = sectionsRef.current;
        
        const getScrollAmount = () => {
            return -(target.scrollWidth - window.innerWidth);
        };

        const tween = gsap.to(target, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: scrollContainerRef.current,
                start: "top top",
                end: () => `+=${target.scrollWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        return () => {
            tween.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, { dependencies: [posts.length], scope: scrollContainerRef });

    const siteName = site?.business?.name || site?.name || 'Caledonian';

    return (
        <div className="relative" style={{ backgroundColor: themeColors.pageBackground }}>
            <Header />

            <main ref={scrollContainerRef} className="h-screen overflow-hidden flex flex-col">
                <div 
                    ref={sectionsRef} 
                    className="flex h-full w-max will-change-transform"
                >
                    <section 
                        className="w-[40vw] md:w-[30vw] h-full flex flex-col justify-center px-12 lg:px-20 border-r flex-shrink-0" 
                        style={{ borderColor: `${themeColors.secondaryText}15` }}
                    >
                        <h1 
                            className="text-3xl lg:text-5xl font-light tracking-tighter mb-4"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            {siteName}
                        </h1>
                        <p 
                            className="text-xs uppercase tracking-[0.4em] font-medium"
                            style={{ color: themeColors.primaryButton, fontFamily: themeFonts.body }}
                        >
                            Selected Blogs
                        </p>
                    </section>

                    {posts.map((post) => (
                        <Link 
                            key={post._id}
                            href={`/blog/${post.slug}`}
                            className="relative w-[85vw] md:w-[45vw] h-full group border-r overflow-hidden flex-shrink-0"
                            style={{ borderColor: `${themeColors.secondaryText}15` }}
                        >
                            <div className="absolute inset-0 bg-zinc-100 overflow-hidden">
                                {post.featuredImage ? (
                                    <img
                                        src={getImageSrc(post.featuredImage.url)}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
                            </div>

                            {post.categories?.[0] && (
                                <div className="absolute top-12 right-[-40px] rotate-45 w-40 py-1 text-center shadow-lg"
                                     style={{ 
                                        backgroundColor: themeColors.primaryButton, 
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        letterSpacing: '0.2em',
                                        zIndex: 10
                                     }}>
                                    {post.categories[0].toUpperCase()}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-12 lg:p-16 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                <h2 
                                    className="text-3xl lg:text-4xl uppercase tracking-[0.1em] mb-2"
                                    style={{ color: themeColors.pageBackground, fontFamily: themeFonts.heading }}
                                >
                                    {post.title}
                                </h2>
                                <div className="flex flex-col gap-1">
                                    <span 
                                        className="text-xs uppercase tracking-[0.3em] opacity-80"
                                        style={{ color: themeColors.pageBackground, fontFamily: themeFonts.body }}
                                    >
                                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        }) : 'No Date'}
                                    </span>
                                    <div 
                                        className="w-0 group-hover:w-full h-[1px] transition-all duration-1000 ease-in-out"
                                        style={{ backgroundColor: themeColors.pageBackground }}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div className="w-[10vw] h-full flex-shrink-0" />
                </div>
            </main>
        </div>
    );
}
