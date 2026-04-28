'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { BlogPost } from '@/app/lib/types';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';
import BlogPostClient from './BlogPostClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { blogApi } from '@/app/lib/api';

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

export default function BlogPostPage() {
  const params = useParams<{ postSlug: string }>();
  const postSlug = params?.postSlug;
  const { site } = useWebBuilder();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [otherPosts, setOtherPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (process.env.NODE_ENV !== 'production') {
      console.log('[blog-post] params:', { postSlug });
      console.log('[blog-post] site from WebBuilderProvider:', site);
    }

    const load = async () => {
      if (!site?.slug || !postSlug) return;

      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[blog-post] fetching post:', { siteSlug: site.slug, postSlug });
        }
        const fetchedPost = await blogApi.getPostBySlug(site.slug, postSlug);
        if (process.env.NODE_ENV !== 'production') {
          console.log('[blog-post] fetched post:', fetchedPost);
        }
        if (!cancelled) setPost(fetchedPost);

        const allPosts = await blogApi.getPostsBySite(site.slug);
        const others = (allPosts || [])
          .filter((p: BlogPost) => p.status === 'published' && p.slug !== postSlug)
          .slice(0, 3);
        if (process.env.NODE_ENV !== 'production') {
          console.log('[blog-post] other posts:', others);
        }
        if (!cancelled) setOtherPosts(others);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        if (!cancelled) {
          setPost(null);
          setOtherPosts([]);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [site?.slug, postSlug]);

  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = useMemo(() => {
    if (!post) return siteName;
    return `${post.seo?.title || post.title} | ${siteName}`;
  }, [post?.seo?.title, post?.title, siteName]);

  const seoDescription = useMemo(() => {
    if (!post) return '';
    return truncate(post.seo?.description || tiptapToText(post.excerpt) || tiptapToText(post.content), 160);
  }, [post?.seo?.description, post?.excerpt, post?.content]);

  const ogImage = useMemo(() => {
    if (!post) return undefined;
    return normalizeSeoImage(post.seo?.ogImageUrl || post.featuredImage?.url, post.title);
  }, [post?.seo?.ogImageUrl, post?.featuredImage?.url, post?.title]);

  const themeColors = useMemo(() => getThemeColors(site), [site]);
  const themeFonts = useMemo(() => getThemeFonts(site), [site]);

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 uppercase tracking-widest">Entry Not Found</div>;
  }

  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={`/blog/${post.slug}`} ogType="article" ogImage={ogImage} />
      <BlogPostClient post={post} site={site} otherPosts={otherPosts} themeColors={themeColors} themeFonts={themeFonts} />
    </>
  );
}