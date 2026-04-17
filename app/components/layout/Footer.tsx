'use client';

import React, { useEffect, useRef } from 'react';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { Page } from '@/app/lib/types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const Footer: React.FC = () => {
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

  const business = site?.business;
  const address = business?.address;
  const legal = site?.legal;

  // Theme colors - use dark primary for footer background
  const bgColor = themeColors.primaryButton;
  const textColor = 'white';
  const mutedText = 'rgba(255,255,255,0.6)';

  const normalizeSlug = (slug: unknown) => {
    if (typeof slug !== 'string') return '';
    const trimmed = slug.trim();
    if (!trimmed) return '';
    const noSlashes = trimmed.replace(/^\/+|\/+$/g, '');
    return noSlashes.toLowerCase();
  };

  // Get published pages for navigation
  const footerPages = pages
    .filter(page => page.status === 'published')
    .map(page => ({ page, slugKey: normalizeSlug(page.slug) }))
    .filter(({ slugKey }) => Boolean(slugKey))
    .filter(({ slugKey }, index, arr) => arr.findIndex(p => p.slugKey === slugKey) === index)
    .map(({ page }) => page);

  // Order pages
  const pageTypeOrder: Array<'home' | 'about' | 'service-list' | 'blog-list' | 'contact'> = 
    ['home', 'about', 'service-list', 'blog-list', 'contact'];

  const isPage = (p: Page | undefined): p is Page => Boolean(p);

  const footerNavPages: Page[] = pageTypeOrder
    .map((t) => footerPages.find((p) => p.pageType === t))
    .filter(isPage);

  // Social links from site
  const socialLinks = site?.socialLinks || [];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="footer-content relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column: Brand & Description */}
          <div className="lg:col-span-4 space-y-6">
            {site?.theme?.logoUrl ? (
              <img
                src={site.theme.logoUrl}
                alt={site?.business?.name || site?.name}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <span className="font-serif text-3xl font-bold" style={{ color: textColor }}>
                {site?.business?.name || site?.name}
              </span>
            )}
            
            {/* Description - Handle multiple data sources */}
            {(() => {
              // Try multiple possible description sources
              const description = site?.business?.description || site?.seo?.description || '';
              
              if (!description) return null;
              
              // Check if it's a Tiptap JSON object
              if (typeof description === 'object' && description !== null) {
                return (
                  <div className="text-sm leading-relaxed max-w-sm" style={{ color: mutedText }}>
                    <TiptapRenderer content={description} as="inline" />
                  </div>
                );
              }
              
              // Plain string
              return (
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: mutedText }}>
                  {description}
                </p>
              );
            })()}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center">
                {socialLinks.map((link, idx) => {
                  const platformKey = typeof link.platform === 'string' ? link.platform : String(link.platform || 'social');
                  return (
                    <a
                      key={link.url || `social-${idx}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      style={{ 
                        color: textColor,
                        border: `1px solid ${textColor}20`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = bgColor;
                        e.currentTarget.style.backgroundColor = textColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = textColor;
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="text-xs font-bold">{platformKey.slice(0, 1).toUpperCase()}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Middle Column: Navigation - Vertical Column, Upside Down */}
          <div className="lg:col-span-4 lg:pl-8 flex flex-col items-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-6 " style={{ color: mutedText }}>
              Quick Links
            </h3>
            <nav className="flex flex-col items-center gap-3 rotate-180">
              {['Testimonials', 'Project Detail', 'Contact', 'Service', 'Blog', 'About', 'Home'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : item === 'About' ? '/about-us' : item === 'Contact' ? '/contact-us' : item === 'Service' ? '/services' : item === 'Blog' ? '/blog' : item === 'Testimonials' ? '/testimonials' : item === 'Project Detail' ? '/project-detail' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex items-center gap-2 hover:opacity-70 transition-opacity rotate-180"
                  style={{ color: textColor }}
                >
                  <span className="text-lg font-light">{item}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column: Contact Info */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-6" style={{ color: mutedText }}>
              Contact
            </h3>
            
            <div className="space-y-4">
              {business?.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="block text-lg hover:opacity-70 transition-opacity"
                  style={{ color: textColor }}
                >
                  {business.phone}
                </a>
              )}
              
              {business?.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="block text-lg hover:opacity-70 transition-opacity"
                  style={{ color: textColor }}
                >
                  {business.email}
                </a>
              )}
              
              {address && (address.street || address.city) && (
                <p className="text-sm leading-relaxed" style={{ color: mutedText }}>
                  {address.street && <>{address.street}<br /></>}
                  {address.city}{address.state && `, ${address.state}`} {address.zipCode}
                </p>
              )}
            </div>

            {/* Newsletter Form */}
            <form className="mt-8 flex items-center gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{ 
                  color: textColor,
                  backgroundColor: `${textColor}10`,
                  border: `1px solid ${textColor}20`
                }}
              />
              <button
                type="submit"
                className="w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ backgroundColor: textColor, color: bgColor }}
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative" style={{ borderTop: `1px solid ${textColor}10` }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: mutedText }}>
            
            {/* Copyright */}
            <span>&copy; {currentYear} {site?.business?.name || site?.name}. All rights reserved.</span>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {legal?.termsOfService?.heading && (
                <Link href="/terms-of-service" className="transition-colors" style={{ color: textColor }}>
                  {legal.termsOfService.heading}
                </Link>
              )}
              {legal?.privacyPolicy?.heading && (
                <Link href="/privacy-policy" className="transition-colors" style={{ color: textColor }}>
                  {legal.privacyPolicy.heading}
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;