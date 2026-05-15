'use client';

import { useMemo } from 'react';
import { SeoHead } from '@/app/components/ui/SeoHead';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { BlogSection } from '@/app/components/sections/BlogSection';
import { Page } from '@/app/lib/types';

export default function BlogPage() {
  const { site, pages } = useWebBuilder();

  if (process.env.NODE_ENV !== 'production') {
    console.log('[blog] site from WebBuilderProvider:', site);
    console.log('[blog] pages from WebBuilderProvider:', pages);
  }

  const blogListPage = useMemo(() => pages.find((p: Page) => p.pageType === 'blog-list') || null, [pages]);

  const siteName = site?.business?.name || site?.name || 'Blog';
  const seoTitle = useMemo(() => `Blog | ${siteName}`, [siteName]);

  return (
    <>
      <SeoHead title={seoTitle} canonicalPath="/blog" ogType="website" />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {blogListPage?.hero?.enabled && <HeroSection hero={blogListPage.hero} />}
          {blogListPage?.blogSection?.enabled && <BlogSection blogSection={blogListPage.blogSection} />}
        </main>
        <Footer />
      </div>
    </>
  );
}