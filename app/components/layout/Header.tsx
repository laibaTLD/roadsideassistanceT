'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { getImageSrc } from '@/app/lib/utils';
import { Menu } from 'lucide-react';
import { buildPageHref, getOrderedNavPages } from '@/app/lib/page-routes';
import gsap from 'gsap';

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const Header: React.FC = () => {
  const { site, pages } = useWebBuilder();
  const themeColors = useThemeColors();
  const headerRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'circle(150% at 95% 5%)',
        duration: 1.2,
        ease: 'expo.inOut',
      });
      gsap.fromTo('.nav-item-large',
        { y: 150, rotate: 5, opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power4.out', delay: 0.4 }
      );
      gsap.fromTo('.nav-overlay-logo',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
      );
    } else {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'circle(0% at 95% 5%)',
        duration: 0.8,
        ease: 'expo.inOut',
      });
    }
  }, [isMenuOpen]);

  const businessName = isNonEmptyString(site?.business?.name)
    ? site!.business!.name!
    : isNonEmptyString(site?.name)
      ? site!.name!
      : '';

  const logoUrl = isNonEmptyString(site?.footer?.logo?.url)
    ? site!.footer!.logo!.url
    : isNonEmptyString(site?.theme?.logoUrl)
      ? site!.theme!.logoUrl!
      : null;
  const logoAlt = site?.footer?.logo?.altText || businessName || 'Logo';

  const navLinks = getOrderedNavPages(pages || []).map((p) => ({
    label: p.name.trim(),
    href: buildPageHref(p),
  }));

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4 md:py-6"
        style={{ backgroundColor: themeColors.pageBackground }}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">

          {/* LEFT - Logo */}
          <Link
            href="/"
            className="nav-item z-[110] flex items-center"
            aria-label={businessName || 'Home'}
          >
            {logoUrl ? (
              <img
                src={getImageSrc(logoUrl)}
                alt={logoAlt}
                className="h-10 md:h-12 w-auto object-contain"
              />
            ) : businessName ? (
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#2D434D] leading-tight uppercase">
                {businessName}
              </span>
            ) : null}
          </Link>

          {/* RIGHT - Menu */}
          <div className="flex items-center gap-6 z-[110]">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-item p-2 hover:bg-white/50 rounded-full transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-5 h-5 text-[#5A7986]" />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MENU */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-[90] bg-[#f2f2f2] flex flex-col items-center justify-center px-6 md:px-10"
        style={{ clipPath: 'circle(0% at 95% 5%)' }}
      >
        {/* TOP - Logo in overlay */}
        {logoUrl && (
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="nav-overlay-logo absolute top-6 left-6 md:top-10 md:left-12 flex items-center"
            aria-label={businessName || 'Home'}
          >
            <img
              src={getImageSrc(logoUrl)}
              alt={logoAlt}
              className="h-10 md:h-14 w-auto object-contain"
            />
          </Link>
        )}

        {/* CENTER - Navigation derived from backend pages */}
        {navLinks.length > 0 && (
          <nav className="flex flex-col items-center gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="nav-item-large text-3xl md:text-5xl font-serif text-[#2D434D] hover:text-[#5A7986] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </>
  );
};
