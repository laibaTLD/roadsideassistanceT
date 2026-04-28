'use client';

import { useMemo } from 'react';
import { generateMetadata as buildMetadata, getPageSeoData } from '@/app/lib/metadata';
import PageSlugClient from './PageSlugClient';
import { Page } from '@/app/lib/types';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { SeoHead } from '@/app/components/ui/SeoHead';

export default function PageSlugPage({ params }: { params: { pageSlug: string } }) {
  const { site, pages, serviceAreaPages } = useWebBuilder();
  const { pageSlug } = params;

  // Match by slug first, then by pageType for known types
  const page = useMemo(() => {
    const bySlug = pages.find((p: Page) => p.slug === pageSlug);
    if (bySlug) return bySlug;

    // Fallback: map known slugs to pageTypes
    const slugToPageType: Record<string, string> = {
      services: 'service-list',
      'service-list': 'service-list',
      contact: 'contact',
      'contact-us': 'contact',
      about: 'about',
      'about-us': 'about',
    };

    const pageType = slugToPageType[pageSlug];
    if (pageType) {
      return pages.find((p: Page) => p.pageType === pageType) || null;
    }

    return null;
  }, [pages, pageSlug]);

  const serviceArea = useMemo(() => {
    return serviceAreaPages?.find((sa: any) => sa.slug === pageSlug) || null;
  }, [serviceAreaPages, pageSlug]);

  if (process.env.NODE_ENV !== 'production') {
    console.log('[pageSlug] pageSlug:', pageSlug);
    console.log('[pageSlug] matched page:', page);
    console.log('[pageSlug] matched serviceArea:', serviceArea);
  }

  const seoTitle = page?.seo?.title || page?.name || pageSlug;
  const seoDescription = page?.seo?.description || '';

  return (
    <>
      <SeoHead title={seoTitle} description={seoDescription} canonicalPath={`/${pageSlug}`} ogType="website" />
      <PageSlugClient pageSlug={pageSlug} page={page} serviceArea={serviceArea} />
    </>
  );
}
