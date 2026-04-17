'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';

interface ServiceBannerProps {
    service: any;
}

// Utility function to get full image URL
const getFullImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return url;
    if (url.startsWith('/')) return url;
    return `/uploads/${url}`;
};

export const ServiceBanner: React.FC<ServiceBannerProps> = ({ service }) => {
    const themeFonts = useThemeFonts();
    const themeColors = useThemeColors();
    const { site } = useWebBuilder();

    // Banner overlay opacity
    const overlayOpacity = service.banner?.overlayOpacity ?? 50;

    // Determine banner title
    const bannerTitle = service.banner?.useServiceNameAsTitle !== false
        ? service.name
        : service.banner?.customTitle || service.name;

    // Banner background image
    const bannerBgImage = service.banner?.backgroundImage?.url
        ? getFullImageUrl(service.banner.backgroundImage.url)
        : service.thumbnailImage?.url
            ? getFullImageUrl(service.thumbnailImage.url)
            : undefined;

    // Theme colors - use white text for banner for visibility
    const primaryColor = themeColors.primaryButton;
    const textColor = '#FFFFFF'; // White text for contrast
    const secondaryTextColor = 'rgba(255, 255, 255, 0.8)';

    // Dynamic label from service
    const label = service.category || '';

    return (
        <section
            className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: bannerBgImage ? `url(${bannerBgImage})` : undefined,
                backgroundColor: primaryColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Gradient Overlay - always show for consistent look */}
            <div
                className="absolute inset-0"
                style={{
                    background: bannerBgImage 
                        ? `linear-gradient(to bottom, ${primaryColor}${Math.round((overlayOpacity / 100) * 255).toString(16).padStart(2, '0')} 0%, ${primaryColor}${Math.round(((overlayOpacity / 100) * 0.6) * 255).toString(16).padStart(2, '0')} 100%)`
                        : `linear-gradient(to bottom, ${primaryColor}D9 0%, ${primaryColor}80 100%)`,
                }}
            />

            {/* Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute left-1/4 top-0 bottom-0 w-px" style={{ backgroundColor: `${textColor}30` }} />
                <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: `${textColor}30` }} />
                <div className="absolute left-3/4 top-0 bottom-0 w-px" style={{ backgroundColor: `${textColor}30` }} />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 text-center px-6 md:px-12 py-20 md:py-32 max-w-5xl mx-auto">
                {/* Label */}
                {label && (
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-12 h-[1px]" style={{ backgroundColor: `${textColor}40` }} />
                        <span 
                            className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold"
                            style={{ 
                                fontFamily: themeFonts.body,
                                color: `${textColor}60`
                            }}
                        >
                            {label}
                        </span>
                        <div className="w-12 h-[1px]" style={{ backgroundColor: `${textColor}40` }} />
                    </div>
                )}

                <h1
                    className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light uppercase tracking-tight leading-[0.95] mb-6"
                    style={{ 
                        fontFamily: themeFonts.heading,
                        color: textColor,
                        textShadow: `0 4px 30px rgba(0, 0, 0, 0.3)`
                    }}
                >
                    {bannerTitle}
                </h1>
                
                {service.shortDescription && (
                    <div
                        className="text-base md:text-lg lg:text-xl max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
                        style={{ 
                            fontFamily: themeFonts.body,
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}
                    >
                        {typeof service.shortDescription === 'string'
                            ? service.shortDescription
                            : <TiptapRenderer content={service.shortDescription} as="inline" />}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceBanner;
