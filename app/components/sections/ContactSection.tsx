'use client';

import React, { useEffect, useRef } from 'react';
import { Page, BusinessHours } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { useThemeColors } from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { cn } from '@/app/lib/utils';
import { ArrowRight, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { ContactSideForm } from '@/app/components/ui/ContactSideForm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

interface ContactSectionProps {
  contactSection: Page['contactSection'];
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contactSection, className }) => {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const themeColors = useThemeColors();
  const { site } = useWebBuilder();

  useEffect(() => {
    if (!contactSection?.enabled) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo('.contact-header',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }}
      );

      // Content animation
      gsap.fromTo('.contact-content',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-content', start: 'top 75%' }}
      );

      // Map animation
      gsap.fromTo('.contact-map',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-map', start: 'top 75%' }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [contactSection]);

  if (!contactSection?.enabled) return null;

  const business = site?.business;
  const address = business?.address;
  const businessHours = business?.businessHours;
  const phone = business?.phone;
  const email = business?.email;

  const formatTime = (time: string) => {
    if (!time) return '';
    if (businessHours?.displayFormat === '12h') {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const formatDayHours = (dayHours: BusinessHours) => {
    if (!dayHours.isOpen) return 'Closed';
    if (dayHours.is24Hours) return '24h';
    if (dayHours.timeRanges && dayHours.timeRanges.length > 0) {
      return dayHours.timeRanges.map(range =>
        `${formatTime(range.openTime)} - ${formatTime(range.closeTime)}`
      ).join(', ');
    }
    return '';
  };

  // Theme colors
  const bgColor = themeColors.pageBackground;
  const primaryColor = themeColors.primaryButton;
  const mainText = themeColors.mainText;
  const secondaryText = themeColors.secondaryText;

  // Dynamic content
  const title = contactSection.title;
  const description = contactSection.description;

  return (
    <section
      ref={sectionRef}
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="contact-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {title ? (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: mainText }}>
                <TiptapRenderer content={title} as="inline" />
              </h2>
            ) : (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: mainText }}>
                Get in Touch
              </h2>
            )}
          </div>

          {description && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: secondaryText }}>
              <TiptapRenderer content={description} as="inline" />
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Contact Info */}
          <div className="contact-content space-y-8">
            {/* Address Card */}
            <div 
              className="p-8 rounded-2xl"
              style={{ backgroundColor: `${primaryColor}08` }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: mainText }}>
                    Address
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: secondaryText }}>
                    {address?.street && <>{address.street}<br /></>}
                    {address?.city}{address?.state && `, ${address.state}`} {address?.zipCode}
                  </p>
                  
                  {site?.business?.coordinates && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address?.street || ''} ${address?.city || ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-colors hover:opacity-70"
                      style={{ color: primaryColor }}
                    >
                      View on Map
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            {businessHours?.isEnabled && (
              <div 
                className="p-8 rounded-2xl"
                style={{ backgroundColor: `${primaryColor}08` }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: mainText }}>
                      Business Hours
                    </h3>
                    <div className="space-y-2">
                      {businessHours.hours.map((day) => (
                        <div key={day.day} className="flex justify-between items-center text-sm">
                          <span style={{ color: secondaryText }}>{DAY_LABELS[day.day]}</span>
                          <span style={{ color: mainText }}>{formatDayHours(day)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {phone && (
                <a 
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-opacity-10"
                  style={{ backgroundColor: `${primaryColor}05` }}
                >
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="text-sm" style={{ color: mainText }}>{phone}</span>
                </a>
              )}
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:bg-opacity-10"
                  style={{ backgroundColor: `${primaryColor}05` }}
                >
                  <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                  <span className="text-sm" style={{ color: mainText }}>{email}</span>
                </a>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="group w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl font-medium transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ backgroundColor: primaryColor, color: 'white' }}
            >
              Send us a Message
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right: Map */}
          <div className="contact-map relative h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
            {site?.business?.coordinates ? (
              <iframe
                title="Office Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'grayscale(1) contrast(1.1)' }}
                src={`https://maps.google.com/maps?q=${site.business.coordinates.latitude},${site.business.coordinates.longitude}&z=15&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                <span className="text-sm" style={{ color: secondaryText }}>Map location not configured</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Form Component */}
      <ContactSideForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
};

export default ContactSection;