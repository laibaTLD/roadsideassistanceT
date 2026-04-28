'use client';

import React, { useState } from 'react';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { CardLoader } from '@/app/components/ui/SkeletonLoader';
import Link from 'next/link';

interface BlogSectionProps {
    blogSection: Page['blogSection'];
    className?: string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogSection, className }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    const { blogPosts, loading } = useWebBuilder();

    if (!blogSection?.enabled) return null;

    const displayPosts = blogPosts.slice(0, blogSection.postsToShow || 6);

    // Blog Grid dynamic columns
    const gridCols = displayPosts.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' : 
                    displayPosts.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    if (loading && blogPosts.length === 0) {
        return (
            <section className="py-24 px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-12">
                            <CardLoader />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section 
            className={cn('relative py-24 lg:py-32 w-full', className)}
            style={{ backgroundColor: themeColors.pageBackground }}
        >
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 
                            className="text-4xl md:text-5xl lg:text-6xl font-serif font-light uppercase tracking-tight leading-none mb-6"
                            style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                        >
                            <TiptapRenderer content={blogSection.title || 'Latest Updates'} as="inline" />
                        </h2>
                        {blogSection.description && (
                            <div 
                                className="text-xs uppercase tracking-[0.3em] opacity-60 max-w-md"
                                style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                            >
                                <TiptapRenderer content={blogSection.description} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Blog Grid */}
                <div className={cn("grid gap-px bg-black/10 overflow-hidden", gridCols)}>
                    {displayPosts.map((post, idx) => (
                        <article
                            key={post._id}
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative bg-white group flex flex-col h-full transition-colors duration-500 hover:z-10"
                            style={{ 
                                backgroundColor: themeColors.pageBackground,
                                borderColor: `${themeColors.inactive}20` 
                            }}
                        >
                            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full p-8 lg:p-12">
                                {/* Top Meta */}
                                <div className="flex justify-between items-start mb-12">
                                    <span 
                                        className="text-[10px] tracking-[0.4em] uppercase font-bold opacity-30"
                                        style={{ fontFamily: themeFonts.body }}
                                    >
                                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                                    </span>
                                    {post.categories?.[0] && (
                                        <span className="text-[9px] uppercase tracking-[0.3em] px-3 py-1 bg-black/5 rounded-full">
                                            {post.categories[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Image Wrapper */}
                                <div className="relative overflow-hidden aspect-[4/5] mb-10 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                                    {post.featuredImage && (
                                        <img
                                            src={getImageSrc(post.featuredImage.url || (post.featuredImage as any))}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                </div>

                                {/* Content */}
                                <div className="mt-auto">
                                    <h3
                                        className="text-xl lg:text-2xl font-serif font-medium tracking-tight uppercase mb-4 leading-tight group-hover:opacity-70 transition-opacity"
                                        style={{ color: themeColors.lightPrimaryText, fontFamily: themeFonts.heading }}
                                    >
                                        {post.title}
                                    </h3>
                                    
                                    {post.excerpt && (
                                        <div
                                            className="text-[11px] uppercase tracking-[0.2em] leading-relaxed opacity-60 line-clamp-3"
                                            style={{ color: themeColors.lightSecondaryText, fontFamily: themeFonts.body }}
                                        >
                                            <TiptapRenderer content={post.excerpt} />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};