'use client';

import Link from 'next/link';
import { BlogPost } from '@/app/lib/types';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { ArrowLeft } from 'lucide-react';

interface BlogPostClientProps {
    post: BlogPost;
    site: any;
    otherPosts: BlogPost[];
    themeColors: ThemeColors;
    themeFonts: ThemeFonts;
}

export default function BlogPostClient({ post, site, otherPosts, themeColors, themeFonts }: BlogPostClientProps) {

    const siteName = site?.business?.name || site?.name || 'Perspective';

    return (
        <div className="min-h-screen" style={{ backgroundColor: themeColors.pageBackground }}>
            <Header />

            <main className="relative">
                <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-end">
                    {post.featuredImage && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={getImageSrc(post.featuredImage.url)}
                                alt={post.featuredImage.altText || post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40" /> 
                        </div>
                    )}
                    
                    <div className="container mx-auto px-6 lg:px-12 relative z-10 pb-16 lg:pb-24">
                        <div className="max-w-4xl">
                            {post.categories?.[0] && (
                                <span className="text-[6px] md:text-xs uppercase tracking-[0.3em] text-white/80 mb-6 block font-medium">
                                    {post.categories[0]}
                                </span>
                            )}
                            <h1 
                                className="text-3xl md:text-5xl lg:text-6xl text-white font-extralight uppercase leading-[1.1] tracking-tight md:tracking-[-0.02em] text-balance"
                                style={{ fontFamily: themeFonts.heading }}
                            >
                                {post.title}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="border-y" style={{ borderColor: `rgba(0, 0, 0, 0.1)`, backgroundColor: themeColors.pageBackground }}>
                    <div className="container mx-auto px-6 lg:px-12 py-8 flex flex-wrap gap-8 md:gap-16 items-center">
                        <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-[0.3em] block" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>Published</span>
                            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: '#000000' }}>
                                {new Date(post.publishedAt!).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                        
                        <Link
                            href="/blog"
                            className="ml-auto flex items-center gap-2 group text-[10px] uppercase tracking-[0.4em] hover:opacity-100 transition-opacity"
                            style={{ color: '#000000' }}
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
                        </Link>
                    </div>
                </div>

                <div className="container px-6 lg:px-12 py-10 lg:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                        
                        <article className="lg:col-span-8 lg:col-start-3">
                            <div 
                                className="prose prose-lg md:prose-xl max-w-none prose-headings:uppercase prose-headings:font-light prose-headings:tracking-widest prose-img:rounded-none prose-blockquote:border-l prose-blockquote:italic !text-black"
                                style={{ 
                                    color: '#000000', 
                                    fontFamily: themeFonts.body,
                                }}
                            >
                                <TiptapRenderer content={post.content || post.excerpt} />
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-12 pt-8 flex flex-wrap gap-4" style={{ borderTop: `1px solid rgba(0, 0, 0, 0.1)` }}>
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="text-[10px] uppercase tracking-[0.3em] px-4 py-2"
                                            style={{
                                                backgroundColor: `rgba(0, 0, 0, 0.05)`,
                                                color: '#000000'
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    </div>
                </div>

                {otherPosts.length > 0 && (
                    <section className="py-24 lg:py-32" style={{ backgroundColor: `rgba(0, 0, 0, 0.02)` }}>
                        <div className="container mx-auto px-6 lg:px-12">
                            <h3 className="text-[11px] uppercase tracking-[0.6em] text-center mb-16 opacity-40 text-black" style={{ fontFamily: themeFonts.heading }}>
                                More Blogs
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: `rgba(0, 0, 0, 0.1)` }}>
                                {otherPosts.map(other => (
                                    <Link
                                        key={other._id}
                                        href={`/blog/${other.slug}`}
                                        className="group p-8 lg:p-12 transition-colors flex flex-col h-full"
                                        style={{ backgroundColor: themeColors.pageBackground }}
                                    >
                                        <span className="text-[9px] uppercase tracking-[0.4em] mb-4 opacity-40 block text-black">Next Article</span>
                                        <h4 className="text-xl uppercase font-light tracking-wide mb-8 group-hover:opacity-60 transition-opacity flex-grow text-black">
                                            {other.title}
                                        </h4>
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-4 text-black">
                                            Explore <ArrowLeft size={14} className="rotate-180" />
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
