'use client';

import React, { useEffect, useRef } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Page } from '@/app/lib/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterProps {
  page?: Page | null;
}

const isNonEmptyTiptap = (value: unknown): boolean => {
  if (!value) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value).includes('"text"');
    } catch {
      return true;
    }
  }
  return false;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const buildPageHref = (p: Page): string => {
  if (p.pageType === 'home') return '/';
  const slug = (p.slug || '').replace(/^\/+|\/+$/g, '');
  return slug ? `/${slug}` : '/';
};

const PAGE_TYPE_ORDER: Array<Page['pageType']> = [
  'home',
  'about',
  'service-list',
  'blog-list',
  'project-detail',
  'testimonials',
  'contact',
];

export const Footer: React.FC<FooterProps> = ({ page }) => {
  const footerRef = useRef<HTMLElement>(null);
  const { site, pages } = useWebBuilder();
  const themeColors = useThemeColors();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-content',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' }}
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const bgColor = themeColors.primaryButton;
  const textColor = '#ffffff';
  const mutedText = 'rgba(255,255,255,0.65)';
  const subtleBorder = 'rgba(255,255,255,0.12)';
  const subtleBg = 'rgba(255,255,255,0.06)';

  const siteFooter = site?.footer;
  const business = site?.business;
  const address = business?.address;
  const pageOverrides = page?.footerOverrides;
  const isPageOverrideActive = Boolean(pageOverrides?.enabled);

  // ---- Brand
  const logoUrl = isNonEmptyString(siteFooter?.logo?.url)
    ? siteFooter!.logo!.url
    : isNonEmptyString(site?.theme?.logoUrl)
      ? site!.theme!.logoUrl!
      : null;
  const businessName = isNonEmptyString(business?.name)
    ? business!.name!
    : isNonEmptyString(site?.name)
      ? site!.name!
      : null;
  const businessTagline = isNonEmptyString(business?.tagline) ? business!.tagline! : null;
  const logoAlt = siteFooter?.logo?.altText || businessName || 'Logo';

  // Description: prefer site.footer.description, fall back to site.business.description (Tiptap)
  // Either may be a plain string or a Tiptap JSON object depending on the backend payload.
  const rawDescriptionCandidates: unknown[] = [
    siteFooter?.description,
    business?.description,
  ];
  const resolvedDescription: string | object | null =
    (rawDescriptionCandidates.find((d) =>
      isNonEmptyString(d) || isNonEmptyTiptap(d)
    ) as string | object | undefined) ?? null;
  const isDescriptionTiptap = !!resolvedDescription
    && typeof resolvedDescription === 'object';
  const descriptionString = isNonEmptyString(resolvedDescription)
    ? resolvedDescription
    : null;
  const showSocial = Boolean(siteFooter?.showSocialLinks);
  const socialLinks = showSocial
    ? (site?.socialLinks || []).filter((l) => isNonEmptyString(l?.url))
    : [];

  // ---- Nav links: page override > pages-derived
  const overrideLinks = (pageOverrides?.links || [])
    .filter((l) => isNonEmptyString(l?.label) && isNonEmptyString(l?.href))
    .map((l) => ({ label: l.label, href: l.href }));

  const publishedPages = (pages || []).filter(
    (p) => p?.status === 'published' && isNonEmptyString(p?.name)
  );
  const orderedPages = [
    ...PAGE_TYPE_ORDER
      .map((type) => publishedPages.find((p) => p.pageType === type))
      .filter((p): p is Page => Boolean(p)),
    ...publishedPages.filter((p) => !PAGE_TYPE_ORDER.includes(p.pageType)),
  ];
  const seenHrefs = new Set<string>();
  const derivedNavLinks = orderedPages
    .map((p) => ({ label: p.name, href: buildPageHref(p) }))
    .filter((l) => {
      if (seenHrefs.has(l.href)) return false;
      seenHrefs.add(l.href);
      return true;
    });

  const navLinks = isPageOverrideActive && overrideLinks.length > 0
    ? overrideLinks
    : derivedNavLinks;

  // ---- Site footer columns (rendered only when no page override is overriding)
  const siteColumns = !isPageOverrideActive
    ? (siteFooter?.columns || [])
        .map((col) => ({
          title: isNonEmptyString(col?.title) ? col.title : '',
          links: (col?.links || []).filter(
            (l) => isNonEmptyString(l?.label) && isNonEmptyString(l?.url)
          ),
        }))
        .filter((col) => col.links.length > 0)
    : [];

  // ---- Contact details
  const contactPhone = isNonEmptyString(business?.phone) ? business!.phone! : null;
  const contactEmail = isNonEmptyString(business?.email) ? business!.email! : null;
  const addressLine1 = isNonEmptyString(address?.street) ? address!.street! : null;
  const addressLine2Parts = [
    isNonEmptyString(address?.city) ? address!.city! : null,
    isNonEmptyString(address?.state) ? address!.state! : null,
    isNonEmptyString(address?.zipCode) ? address!.zipCode! : null,
  ].filter(Boolean) as string[];
  const addressLine2 = addressLine2Parts.length
    ? `${addressLine2Parts[0]}${addressLine2Parts[1] ? `, ${addressLine2Parts[1]}` : ''}${addressLine2Parts[2] ? ` ${addressLine2Parts[2]}` : ''}`
    : null;
  const addressCountry = isNonEmptyString(address?.country) ? address!.country! : null;
  const hasAddress = Boolean(addressLine1 || addressLine2 || addressCountry);
  const hasContact = Boolean(contactPhone || contactEmail || hasAddress);

  // ---- Copyright
  const overrideCopyright = isPageOverrideActive && isNonEmptyString(pageOverrides?.copyright)
    ? pageOverrides!.copyright!
    : null;
  const siteCopyright = isNonEmptyTiptap(siteFooter?.copyright) ? siteFooter!.copyright : null;
  const hasCopyright = Boolean(overrideCopyright || siteCopyright);

  const hasBrand = Boolean(logoUrl || businessName || businessTagline || resolvedDescription || socialLinks.length > 0);
  const hasNav = navLinks.length > 0;
  const hasSiteColumns = siteColumns.length > 0;

  const hasAnyContent = hasBrand || hasNav || hasSiteColumns || hasContact || hasCopyright;
  if (!hasAnyContent) return null;

  const eyebrowClass = 'text-[11px] font-semibold uppercase tracking-[0.25em]';

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="footer-content relative max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-20 md:pt-24 pb-10">

        {/* Top section: 3 aligned columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-14 md:gap-x-10 lg:gap-x-16 items-start">

          {/* ====== Brand ====== */}
          {hasBrand && (
            <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="h-20 md:h-24 lg:h-28 w-auto object-contain self-start"
                />
              )}

              {(businessName || businessTagline) && (
                <div className="space-y-1">
                  {businessName && (
                    <h2
                      className="font-serif text-2xl md:text-3xl font-semibold leading-tight"
                      style={{ color: textColor }}
                    >
                      {businessName}
                    </h2>
                  )}
                  {businessTagline && (
                    <p className={eyebrowClass} style={{ color: mutedText }}>
                      {businessTagline}
                    </p>
                  )}
                </div>
              )}

              {resolvedDescription && (
                <div
                  className="text-sm leading-relaxed max-w-md"
                  style={{ color: mutedText }}
                >
                  {isDescriptionTiptap ? (
                    <TiptapRenderer content={resolvedDescription} as="inline" />
                  ) : (
                    <p>{descriptionString}</p>
                  )}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {socialLinks.map((link, idx) => {
                    const platformKey = typeof link.platform === 'string'
                      ? link.platform
                      : String(link.platform || 'social');
                    return (
                      <a
                        key={link.url || `social-${idx}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          color: textColor,
                          border: `1px solid ${subtleBorder}`,
                          backgroundColor: subtleBg,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = bgColor;
                          e.currentTarget.style.backgroundColor = textColor;
                          e.currentTarget.style.borderColor = textColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = textColor;
                          e.currentTarget.style.backgroundColor = subtleBg;
                          e.currentTarget.style.borderColor = subtleBorder;
                        }}
                        aria-label={platformKey}
                      >
                        <span className="text-xs font-bold">
                          {platformKey.slice(0, 1).toUpperCase()}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ====== Navigation ====== */}
          {hasNav && (
            <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-5 md:pt-20">
              <h3 className={eyebrowClass} style={{ color: mutedText }}>
                Navigation
              </h3>
              <span
                className="block w-10 h-px"
                style={{ backgroundColor: subtleBorder }}
                aria-hidden
              />
              <nav className="flex flex-col gap-3">
                {navLinks.map((link, idx) => (
                  <Link
                    key={`${link.href}-${idx}`}
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-base hover:opacity-80 transition-opacity"
                    style={{ color: textColor }}
                  >
                    <span className="font-light">{link.label}</span>
                    <ArrowUpRight
                      className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* ====== Contact ====== */}
          {hasContact && (
            <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-5 md:pt-20">
              <h3 className={eyebrowClass} style={{ color: mutedText }}>
                Get in Touch
              </h3>
              <span
                className="block w-10 h-px"
                style={{ backgroundColor: subtleBorder }}
                aria-hidden
              />

              <ul className="flex flex-col gap-4 text-sm">
                {contactPhone && (
                  <li>
                    <a
                      href={`tel:${contactPhone}`}
                      className="group inline-flex items-start gap-3 hover:opacity-80 transition-opacity"
                      style={{ color: textColor }}
                    >
                      <span
                        className="mt-0.5 inline-flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: subtleBg, border: `1px solid ${subtleBorder}` }}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-base font-light">{contactPhone}</span>
                    </a>
                  </li>
                )}

                {contactEmail && (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group inline-flex items-start gap-3 hover:opacity-80 transition-opacity break-all"
                      style={{ color: textColor }}
                    >
                      <span
                        className="mt-0.5 inline-flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: subtleBg, border: `1px solid ${subtleBorder}` }}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-base font-light">{contactEmail}</span>
                    </a>
                  </li>
                )}

                {hasAddress && (
                  <li className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex w-8 h-8 rounded-full items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: subtleBg, border: `1px solid ${subtleBorder}` }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <address
                      className="not-italic text-sm leading-relaxed"
                      style={{ color: mutedText }}
                    >
                      {addressLine1 && <>{addressLine1}<br /></>}
                      {addressLine2 && <>{addressLine2}<br /></>}
                      {addressCountry && <>{addressCountry}</>}
                    </address>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Site footer columns (extra link groups from backend) */}
        {hasSiteColumns && (
          <div
            className="mt-16 pt-12"
            style={{ borderTop: `1px solid ${subtleBorder}` }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-12 md:pt-20">
              {siteColumns.map((col, colIdx) => (
                <div key={`${col.title}-${colIdx}`} className="flex flex-col gap-5">
                  {col.title && (
                    <h3 className={eyebrowClass} style={{ color: mutedText }}>
                      {col.title}
                    </h3>
                  )}
                  <span
                    className="block w-10 h-px"
                    style={{ backgroundColor: subtleBorder }}
                    aria-hidden
                  />
                  <nav className="flex flex-col gap-3">
                    {col.links.map((link, linkIdx) => (
                      <Link
                        key={`${link.url}-${linkIdx}`}
                        href={link.url}
                        className="group inline-flex items-center gap-2 text-base hover:opacity-80 transition-opacity"
                        style={{ color: textColor }}
                      >
                        <span className="font-light">{link.label}</span>
                        <ArrowUpRight
                          className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                        />
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Copyright */}
      {hasCopyright && (
        <div className="relative" style={{ borderTop: `1px solid ${subtleBorder}` }}>
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-5">
            <div
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-xs"
              style={{ color: mutedText }}
            >
              {overrideCopyright ? (
                <span>{overrideCopyright}</span>
              ) : siteCopyright ? (
                <div>
                  <TiptapRenderer content={siteCopyright} as="inline" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
