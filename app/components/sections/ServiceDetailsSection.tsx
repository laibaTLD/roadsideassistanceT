'use client';

import React from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';

interface ServiceDetailsSectionProps {
    service: any;
    galleryImages: any[];
}

// Utility function to get full image URL
const getFullImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return url;
    if (url.startsWith('/')) return url;
    return `/uploads/${url}`;
};

export const ServiceDetailsSection: React.FC<ServiceDetailsSectionProps> = ({
    service,
    galleryImages
}) => {
    const themeColors = useThemeColors();
    const themeFonts = useThemeFonts();
    
    const mainText = themeColors.mainText;
    const secondaryText = themeColors.secondaryText;
    const pageBg = themeColors.pageBackground;
    
    // Ensure text contrast - if colors are too similar, force dark text
    const isLightBg = !pageBg || pageBg === '#FFFFFF' || pageBg === '#FAFBFC' || pageBg === '#F5F5F5';
    const effectiveTextColor = isLightBg ? (mainText || '#1a1a1a') : (mainText || '#FFFFFF');
    const effectiveSecondaryColor = isLightBg ? (secondaryText || '#666666') : (secondaryText || 'rgba(255,255,255,0.8)');
    return (
        <div className="lg:col-span-8">
            {/* Featured Image */}
            {service.thumbnailImage?.url && (
                <div className="mb-8">
                    <img
                        src={getFullImageUrl(service.thumbnailImage.url) || ''}
                        alt={service.thumbnailImage.altText || service.name}
                        className="w-full h-auto max-h-[400px] object-cover rounded-2xl shadow-lg"
                    />
                </div>
            )}

            {/* Full Description */}
            {service.description && (
                <div
                    className="prose prose-lg max-w-none"
                    style={{ color: effectiveTextColor }}
                >
                    <TiptapRenderer content={service.description} />
                </div>
            )}

            {(Array.isArray(service.features) ? service.features.length > 0 : !!service.features) && (
                <div className={service.description ? 'mt-12' : ''}>
                    <h2
                        className="text-2xl lg:text-3xl font-semibold mb-4"
                        style={{ color: effectiveTextColor }}
                    >
                        {service.featuresTitle || 'Features'}
                    </h2>
                    <div
                        className="prose prose-lg max-w-none"
                        style={{ color: effectiveTextColor }}
                    >
                        {Array.isArray(service.features) ? (
                            <ul>
                                {service.features.map((feature: any, index: number) => (
                                    <li key={index}>
                                        {typeof feature === 'string' ? feature : <TiptapRenderer content={feature} as="inline" />}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <TiptapRenderer content={service.features} />
                        )}
                    </div>
                </div>
            )}

            {/* Gallery Images with Alternating Alignment */}
            {galleryImages.length > 0 && (
                <div className="mt-12 space-y-8">
                    {galleryImages.map((image: any, index: number) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex flex-col md:flex-row gap-6 items-center",
                                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                                )}
                            >
                                <div className="md:w-1/2">
                                    <img
                                        src={getFullImageUrl(image.url) || ''}
                                        alt={image.altText || `${service.name} image ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-xl shadow-md"
                                    />
                                </div>
                                <div className="md:w-1/2">
                                    {image.caption && (
                                        <p
                                            className="text-sm italic"
                                            style={{ color: effectiveSecondaryColor }}
                                        >
                                            {image.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
