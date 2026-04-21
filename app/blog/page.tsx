import { BlogPost } from '@/app/lib/types';
import { SeoHead } from '@/app/components/ui/SeoHead';
import BlogPageClient from './BlogPageClient';
import { ThemeColors, ThemeFonts } from '@/app/hooks/useTheme';

// Enable ISR - revalidate every 30 minutes (1800 seconds)
export const revalidate = 1800;

async function getBlogPosts(): Promise<{ site: any; posts: BlogPost[] }> {
    try {
        const siteSlug = process.env.NEXT_PUBLIC_WEBBUILDER_SITE_SLUG;
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        const siteResponse = await fetch(`${apiUrl}/api/public/sites/${siteSlug}`, {
            next: { revalidate: 1800 }
        });
        
        if (!siteResponse.ok) return { site: null, posts: [] };
        
        const siteData = await siteResponse.json();
        if (!siteData.success || !siteData.data) return { site: null, posts: [] };
        
        const site = siteData.data;
        
        const postsResponse = await fetch(`${apiUrl}/api/public/sites/${site.slug}/blog-posts`, {
            next: { revalidate: 1800 }
        });
        
        if (!postsResponse.ok) return { site, posts: [] };
        
        const postsData = await postsResponse.json();
        if (!postsData.success || !postsData.data) return { site, posts: [] };
        
        const publishedPosts = postsData.data.filter((post: BlogPost) => post.status === 'published');
        return { site, posts: publishedPosts };
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return { site: null, posts: [] };
    }
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

export default async function BlogPage() {
    const { site, posts } = await getBlogPosts();
    const siteName = site?.business?.name || site?.name || 'Caledonian';
    const seoTitle = `Projects | ${siteName}`;
    const themeColors = getThemeColors(site);
    const themeFonts = getThemeFonts(site);

    return (
        <>
            <SeoHead title={seoTitle} canonicalPath="/blog" ogType="website" />
            <BlogPageClient site={site} posts={posts} themeColors={themeColors} themeFonts={themeFonts} />
        </>
    );
}