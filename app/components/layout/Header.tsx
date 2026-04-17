'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors } from '@/app/hooks/useTheme';
import { getImageSrc, cn } from '@/app/lib/utils';
import { Menu } from 'lucide-react';
import gsap from 'gsap';

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
    } else {
      gsap.to(menuOverlayRef.current, {
        clipPath: 'circle(0% at 95% 5%)',
        duration: 0.8,
        ease: 'expo.inOut',
      });
    }
  }, [isMenuOpen]);

  const businessName = site?.business?.name || site?.name || '';

  // Get navigation links from site data only
  const navLinks = site?.footer?.columns?.[0]?.links?.slice(0, 4) || [];

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
            className="nav-item z-[110]"
          >
            {site?.theme?.logoUrl ? (
              <img
                src={getImageSrc(site.theme.logoUrl)}
                alt={site?.name || 'Logo'}
                className="h-8 md:h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#2D434D] leading-tight uppercase">
                {businessName}
              </span>
            )}
          </Link>

          {/* CENTER - Navigation - Vertical Column, Upside Down */}
          <nav className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 -translate-x-1/2 rotate-180">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.url} 
                className="nav-item text-[11px] text-[#5A7986] hover:text-[#2D434D] transition-colors tracking-[0.1em] uppercase rotate-180"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT - Social Links + Menu */}
          <div className="flex items-center gap-6 z-[110]">
           
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-item p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5 text-[#5A7986]" />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MENU */}
      <div
        ref={menuOverlayRef}
        className="fixed inset-0 z-[90] bg-[#f2f2f2] flex flex-col md:flex-row items-center justify-center px-10"
        style={{ clipPath: 'circle(0% at 95% 5%)' }}
      >
          {/* CENTER - Navigation - Vertical Column, Upside Down */}
          <nav className="flex flex-col items-center gap-3 absolute left-1/2 -translate-x-1/2">
            {['Home', 'About', 'Contact', 'Services', 'Blog', 'Project Detail', 'Testimonials'].map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setIsMenuOpen(false)}
                className="nav-item-large text-3xl md:text-5xl font-serif text-[#2D434D] hover:text-[#5A7986] transition-colors rotate-180"
              >
                {item}
              </Link>
            ))}
          </nav>
      </div>

      <style jsx global>{`
        body {
          overflow: ${isMenuOpen ? 'hidden' : 'auto'};
        }
      `}</style>
    </>
  );
};