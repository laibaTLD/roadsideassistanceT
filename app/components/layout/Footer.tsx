'use client';

import React, { useEffect, useRef } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc } from '@/app/lib/utils';
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Share2,
  Twitter,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => {
  const key = platform.toLowerCase();
  const className = 'w-4 h-4';
  if (key === 'facebook') return <Facebook className={className} />;
  if (key === 'instagram') return <Instagram className={className} />;
  if (key === 'x' || key === 'twitter') return <Twitter className={className} />;
  if (key === 'youtube') return <Youtube className={className} />;
  if (key === 'linkedin') return <Linkedin className={className} />;
  return <Share2 className={className} />;
};

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const { site } = useWebBuilder();
  const themeColors = useThemeColors();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-content',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%' },
        }
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

  const logoUrl = isNonEmptyString(siteFooter?.logo?.url)
    ? getImageSrc(siteFooter!.logo!.url)
    : isNonEmptyString(site?.theme?.logoUrl)
      ? getImageSrc(site!.theme!.logoUrl!)
      : null;
  const businessName = isNonEmptyString(business?.name)
    ? business!.name!
    : isNonEmptyString(site?.name)
      ? site!.name!
      : null;
  const businessTagline = isNonEmptyString(business?.tagline) ? business!.tagline! : null;
  const logoAlt = siteFooter?.logo?.altText || businessName || 'Logo';

  const rawDescription = siteFooter?.description;
  const resolvedDescription: string | object | null =
    isNonEmptyString(rawDescription) || isNonEmptyTiptap(rawDescription)
      ? (rawDescription as string | object)
      : null;
  const isDescriptionTiptap =
    !!resolvedDescription && typeof resolvedDescription === 'object';

  const showSocial = siteFooter?.showSocialLinks === true;
  const socialLinks = showSocial
    ? (site?.socialLinks || []).filter((l) => isNonEmptyString(l?.url))
    : [];

  const footerColumns = (siteFooter?.columns || [])
    .map((col) => ({
      title: isNonEmptyString(col?.title) ? col.title : '',
      links: (col?.links || []).filter(
        (l) => isNonEmptyString(l?.label) && isNonEmptyString(l?.url)
      ),
    }))
    .filter((col) => col.links.length > 0);

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

  const siteCopyright = isNonEmptyTiptap(siteFooter?.copyright)
    ? siteFooter!.copyright
    : null;
  const hasCopyright = Boolean(siteCopyright);

  const hasBrand = Boolean(
    logoUrl || businessName || businessTagline || resolvedDescription || socialLinks.length > 0
  );
  const hasColumns = footerColumns.length > 0;

  const hasAnyContent = hasBrand || hasColumns || hasContact || hasCopyright;
  if (!hasAnyContent) return null;

  const eyebrowClass = 'text-[11px] font-semibold uppercase tracking-[0.25em]';

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="footer-content relative max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-20 md:pt-24 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-14 md:gap-x-10 lg:gap-x-12 items-start">

          {hasBrand && (
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
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
                    <p>{resolvedDescription as string}</p>
                  )}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {socialLinks.map((link, idx) => {
                    const platformKey =
                      typeof link.platform === 'string'
                        ? link.platform
                        : String(link.platform || 'social');
                    return (
                      <a
                        key={`${link.url}-${platformKey}-${idx}`}
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
                        <SocialIcon platform={platformKey} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {hasColumns && (
            <div
              className={
                hasContact
                  ? 'md:col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-8'
                  : 'md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8'
              }
            >
              {footerColumns.map((col, colIdx) => (
                <div key={`footer-col-${colIdx}-${col.title}`} className="flex flex-col gap-5">
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
                        <ArrowUpRight className="w-4 h-4 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          )}

          {hasContact && (
            <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-5">
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
                        style={{
                          backgroundColor: subtleBg,
                          border: `1px solid ${subtleBorder}`,
                        }}
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
                        style={{
                          backgroundColor: subtleBg,
                          border: `1px solid ${subtleBorder}`,
                        }}
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
                      style={{
                        backgroundColor: subtleBg,
                        border: `1px solid ${subtleBorder}`,
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <address
                      className="not-italic text-sm leading-relaxed"
                      style={{ color: mutedText }}
                    >
                      {addressLine1 && (
                        <>
                          {addressLine1}
                          <br />
                        </>
                      )}
                      {addressLine2 && (
                        <>
                          {addressLine2}
                          <br />
                        </>
                      )}
                      {addressCountry && <>{addressCountry}</>}
                    </address>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {hasCopyright && (
        <div className="relative" style={{ borderTop: `1px solid ${subtleBorder}` }}>
          <div className="max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 py-5">
            <div className="text-xs" style={{ color: mutedText }}>
              <TiptapRenderer content={siteCopyright} as="inline" />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
