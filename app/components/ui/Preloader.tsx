'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

const messages = [
  "Locating nearby help…",
  "Connecting to mechanics…",
  "Help is on the way…"
];

const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const themeColors = useThemeColors();
  const { site } = useWebBuilder();

  const bgColor = themeColors.sectionBackgroundDark || '#050505';
  const textColor = themeColors.darkPrimaryText || '#ffffff';
  const accent = themeColors.primaryButton || '#FFB020';

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        onComplete: exitAnimation
      });

      // =========================
      // 🔹 INTRO (Poppr style)
      // =========================
      tl.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );

      tl.fromTo(brandRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );

      tl.fromTo(subTextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );

      // =========================
      // 🚗 CAR DRIVE ANIMATION
      // =========================
      tl.fromTo(carRef.current,
        { x: -200, opacity: 0 },
        { x: 200, opacity: 1, duration: 1.8, ease: "power2.inOut" },
        "-=0.8"
      );

      // continuous loop road effect
      gsap.to(carRef.current, {
        y: "-=6",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      });

      // =========================
      // 🧠 TEXT STORY SEQUENCE
      // =========================
      messages.forEach((msg, i) => {
        tl.to(subTextRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (subTextRef.current) {
              subTextRef.current.innerText = msg;
            }
          }
        });

        tl.to(subTextRef.current, {
          opacity: 1,
          duration: 0.5
        });
      });

      // =========================
      // 📊 PROGRESS BAR
      // =========================
      tl.to(progressBarRef.current, {
        scaleX: 1,
        duration: 3,
        ease: "none",
        onUpdate: function () {
          setProgress(Math.floor(this.progress() * 100));
        }
      }, 0);

      // =========================
      // ✨ MICRO INTERACTIONS
      // =========================
      tl.to(brandRef.current, {
        textShadow: `0 0 20px ${accent}`,
        duration: 1,
        yoyo: true,
        repeat: 1
      }, "-=2");

      function exitAnimation() {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut",
          onComplete: () => {
            setIsVisible(false);
            document.body.style.overflow = '';
          }
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  // Preloader disabled - return null to skip rendering
  return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: bgColor }}
    >

      <div className="flex flex-col items-center">

        {/* 🚗 CAR COMPONENT (SVG UPGRADED) */}
        <div ref={carRef} className="mb-8 relative">
          <svg 
            width="100" 
            height="45" 
            viewBox="0 0 100 45" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-2xl"
          >
            {/* Car Body */}
            <path 
              d="M10 30C10 28 12 25 20 22L35 10C40 8 65 8 75 12L88 22C95 25 98 28 98 32V38H2V32L10 30Z" 
              fill={textColor} 
            />
            {/* Windows */}
            <path 
              d="M38 13H65L72 21H24L38 13Z" 
              fill={bgColor} 
              fillOpacity="0.6" 
            />
            {/* Wheels */}
            <circle cx="22" cy="38" r="6" fill={textColor} stroke={bgColor} strokeWidth="2"/>
            <circle cx="78" cy="38" r="6" fill={textColor} stroke={bgColor} strokeWidth="2"/>
            {/* Headlight Effect */}
            <rect x="92" y="26" width="6" height="3" rx="1.5" fill={accent} className="animate-pulse" />
          </svg>
          
          {/* Subtle light beam from headlight */}
          <div 
            className="absolute top-6 -right-4 w-12 h-4 blur-md opacity-40 pointer-events-none"
            style={{ 
              background: `linear-gradient(to right, ${accent}, transparent)`,
              clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0 70%)'
            }}
          />
        </div>

        {/* 🏷️ BRAND */}
        <h1
          ref={brandRef}
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: textColor }}
        >
          {site?.business?.name || "RoadAssist"}
        </h1>

        {/* 🧠 SUBTEXT */}
        <p
          ref={subTextRef}
          className="text-sm tracking-widest uppercase mb-10"
          style={{ color: `${textColor}aa` }}
        >
          Locating nearby help…
        </p>

        {/* 📊 PROGRESS */}
        <div className="w-56">
          <div className="h-[2px] bg-white/20 overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full origin-left scale-x-0"
              style={{ background: accent }}
            />
          </div>

          <div className="flex justify-between text-xs mt-3 text-white/60">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>

      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,1)]" />
    </div>
  );
};

export default Preloader;