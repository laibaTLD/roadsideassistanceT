import type { Page } from '@/app/lib/types';

/** Canonical App Router paths for known page types */
const PAGE_TYPE_PATHS: Record<Page['pageType'], string> = {
  home: '/',
  about: '/about-us',
  contact: '/contact-us',
  'service-list': '/services',
  'blog-list': '/blog',
  'project-detail': '/project-detail',
  testimonials: '/testimonials',
};

/** Slug aliases that resolve to the same canonical paths */
const SLUG_PATHS: Record<string, string> = {
  about: '/about-us',
  'about-us': '/about-us',
  contact: '/contact-us',
  'contact-us': '/contact-us',
  services: '/services',
  'service-list': '/services',
  blog: '/blog',
  'blog-list': '/blog',
  projects: '/project-detail',
  'project-detail': '/project-detail',
  testimonials: '/testimonials',
};

const normalizeSlug = (slug: string): string => slug.replace(/^\/+|\/+$/g, '');

export const buildPageHref = (page: Page): string => {
  const typePath = PAGE_TYPE_PATHS[page.pageType];
  if (typePath) return typePath;

  const slug = normalizeSlug(page.slug || '');
  if (!slug) return '/';

  return SLUG_PATHS[slug] ?? `/${slug}`;
};

export const PAGE_TYPE_ORDER: Array<Page['pageType']> = [
  'home',
  'about',
  'service-list',
  'blog-list',
  'project-detail',
  'testimonials',
  'contact',
];

export const getOrderedNavPages = (pages: Page[]): Page[] => {
  const published = pages.filter((p) => p?.status === 'published' && p?.name?.trim());

  const ordered = [
    ...PAGE_TYPE_ORDER.map((type) => published.find((p) => p.pageType === type)).filter(
      (p): p is Page => Boolean(p)
    ),
    ...published.filter((p) => !PAGE_TYPE_ORDER.includes(p.pageType)),
  ];

  const seen = new Set<string>();
  return ordered.filter((p) => {
    if (p.pageType === 'home') return false;
    const href = buildPageHref(p);
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
};
