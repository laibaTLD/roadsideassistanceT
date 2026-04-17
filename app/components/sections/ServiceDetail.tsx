'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { useThemeColors, useThemeFonts } from '@/app/hooks/useTheme';
import { CTASection } from './CTASection';
import { ServiceBanner } from './ServiceBanner';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { OtherServicesCard, QuickContactCard } from './ServiceSidebarCards';
import { ServiceFAQSection } from './ServiceFAQSection';
import { ServiceServingAreasSection } from './ServiceServingAreasSection';
import { ServiceContactFormSection } from './ServiceContactFormSection';

interface ServiceDetailProps {
    service: any;
    allServices?: any[];
    className?: string;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ 
    service, 
    allServices = [],
    className 
}) => {
    const { site } = useWebBuilder();
    const themeColors = useThemeColors();

    // Data Filtering - show all other services
    const otherServices = allServices.filter(s => s._id !== service._id && s.slug !== service.slug);
    const galleryImages = service.galleryImages || [];

    // CTA Configuration from service data
    const cta = service.cta;
    const isCtaEnabled = cta?.enabled ?? true;
    
    // Construct CTA object from service database data only
    const ctaSectionFromService: any = {
        enabled: isCtaEnabled,
        title: cta?.title || service.name || '',
        description: cta?.description || service.shortDescription || '',
        primaryButton: cta?.primaryButton || {
            label: cta?.buttonText || 'Get Started',
            href: cta?.buttonUrl || '/contact',
        },
        backgroundImage: cta?.image,
    };

    // Theme colors
    const bgColor = themeColors.pageBackground || '#FAFBFC';
    const dividerColor = themeColors.inactive || '#D1DCE2';

    return (
        <div 
            className={cn('min-h-screen', className)} 
            style={{ backgroundColor: bgColor }}
        >
            {/* Service Banner */}
            <ServiceBanner service={service} />

            {/* Main Content */}
            <main className="relative py-16 lg:py-24">
                <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                        
                        {/* Left Content */}
                        <div className="lg:col-span-8 space-y-16">
                            <ServiceDetailsSection 
                                service={service} 
                                galleryImages={galleryImages} 
                            />
                        </div>

                        {/* Right Sidebar */}
                        <aside className="lg:col-span-4 relative">
                            <div className="lg:sticky lg:top-24 space-y-8">
                                <OtherServicesCard otherServices={otherServices} />
                                <QuickContactCard service={service} />
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* CTA Section */}
            <div 
                className="border-t"
                style={{ borderColor: `${dividerColor}30` }}
            >
                <CTASection ctaSection={ctaSectionFromService} />
            </div>

            {/* Support Sections */}
            <div>
                <ServiceFAQSection service={service} />
                <ServiceServingAreasSection service={service} />
                <ServiceContactFormSection service={service} />
            </div>
        </div>
    );
};

export default ServiceDetail;