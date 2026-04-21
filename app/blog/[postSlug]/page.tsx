import { Metadata } from 'next'
import { BlogPost } from '@/app/lib/types';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { normalizeSeoImage, tiptapToText, truncate } from '@/app/lib/seo';
import BlogPostClient from './BlogPostClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

interface BlogPostPageProps {
  params: { postSlug: string }
}

// Enable ISR - revalidate every 30 minutes (1800 seconds)
export const revalidate = 1800;

async function getBlogPost(postSlug: string): Promise<{ post: BlogPost | null; site: any; otherPosts: BlogPost[] }> {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
      next: { revalidate: 1800 }
    });
    
    if (!siteResponse.ok) return { post: null, site: null, otherPosts: [] };
    
    const siteData = await siteResponse.json();
    if (!siteData.success || !siteData.data) return { post: null, site: null, otherPosts: [] };
    
    const site = siteData.data;
    
    const postResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/blog-posts/${postSlug}`, {
      next: { revalidate: 1800 }
    });
    
    if (!postResponse.ok) return { post: null, site, otherPosts: [] };
    
    const postData = await postResponse.json();
    if (!postData.success || !postData.data) return { post: null, site, otherPosts: [] };
    
    const post = postData.data;
    
    const allPostsResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/blog-posts`, {
      next: { revalidate: 1800 }
    });
    
    if (!allPostsResponse.ok) return { post, site, otherPosts: [] };
    
    const allPostsData = await allPostsResponse.json();
    if (!allPostsData.success || !allPostsData.data) return { post, site, otherPosts: [] };
    
    const otherPosts = allPostsData.data
      .filter((p: BlogPost) => p.status === 'published' && p.slug !== postSlug)
      .slice(0, 3);
    
    return { post, site, otherPosts };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { post: null, site: null, otherPosts: [] };
  }
}

export async function generateStaticParams() {
  try {
    const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`${apiUrl}/api/public/sites/${siteSlug}/blog-posts`);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success || !data.data) return [];
    
    const posts = data.data.filter((p: BlogPost) => p.status === 'published');
    
    return posts.map((post: BlogPost) => ({
      postSlug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { postSlug } = params;
  const { post, site } = await getBlogPost(postSlug);
  
  if (!post || !site) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = `${post.seo?.title || post.title} | ${siteName}`;
  const seoDescription = truncate(post.seo?.description || tiptapToText(post.excerpt) || tiptapToText(post.content), 160);
  const ogImage = normalizeSeoImage(post.seo?.ogImageUrl || post.featuredImage?.url, post.title);
  
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [{ url: ogImage as unknown as string }] : undefined,
      type: 'article',
    },
  };
}

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { postSlug } = params;
  const { post, site, otherPosts } = await getBlogPost(postSlug);
  
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 uppercase tracking-widest">Entry Not Found</div>;
  }
  
  const siteName = site?.business?.name || site?.name || 'Perspective';
  const seoTitle = `${post.seo?.title || post.title} | ${siteName}`;
  const seoDescription = truncate(post.seo?.description || tiptapToText(post.excerpt) || tiptapToText(post.content), 160);
  const ogImage = normalizeSeoImage(post.seo?.ogImageUrl || post.featuredImage?.url, post.title);
  const themeColors = getThemeColors(site);
  const themeFonts = getThemeFonts(site);
  
  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={`/blog/${post.slug}`} ogType="article" ogImage={ogImage} />
      <BlogPostClient post={post} site={site} otherPosts={otherPosts} themeColors={themeColors} themeFonts={themeFonts} />
    </>
  );
}