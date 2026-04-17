'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { cn } from '@/app/lib/utils';
import { useThemeColors } from '@/app/hooks/useTheme';
import { Plus, Minus } from 'lucide-react';

interface FAQsProps {
  faqs: any;
  className?: string;
}

export const FAQs: React.FC<FAQsProps> = memo(({ faqs, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const themeColors = useThemeColors();

  // Memoize theme colors
  const colors = useMemo(() => ({
    bg: themeColors.pageBackground,
    primary: themeColors.primaryButton,
    mainText: themeColors.mainText,
    secondaryText: themeColors.secondaryText
  }), [themeColors]);

  const toggle = useCallback((index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  if (!faqs || (!faqs.title && !faqs.description && (!faqs.items || faqs.items.length === 0))) return null;

  return (
    <section
      className={cn('relative w-full py-24 md:py-32 overflow-hidden', className)}
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background Number */}
      <div className="absolute top-10 right-0 text-[18vw] font-serif font-bold leading-none pointer-events-none select-none translate-x-1/4 opacity-[0.08]" style={{ color: colors.primary }}>
        11
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        
        {/* Header */}
        <div className="faq-header flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-xl">
            {faqs.title && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: colors.mainText }}>
                <TiptapRenderer content={faqs.title} as="inline" />
              </h2>
            )}
          </div>

          {faqs.description && (
            <p className="text-sm md:text-base max-w-md leading-relaxed lg:text-right" style={{ color: colors.secondaryText }}>
              <TiptapRenderer content={faqs.description} as="inline" />
            </p>
          )}
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {faqs.items.map((item: any, index: number) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  "faq-item rounded-2xl overflow-hidden transition-all duration-500",
                  isOpen ? "shadow-lg" : "hover:shadow-md"
                )}
                style={{ backgroundColor: `${colors.primary}08` }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-6 lg:p-8 text-left group"
                >
                  <div className="flex items-center gap-6">
                    {/* Number */}
                    <span
                      className="text-3xl font-serif font-bold opacity-20"
                      style={{ color: colors.primary }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Question */}
                    <h3
                      className="text-lg md:text-xl font-medium transition-colors"
                      style={{ color: colors.mainText }}
                    >
                      <TiptapRenderer content={item.question} as="inline" />
                    </h3>
                  </div>

                  {/* Toggle Icon */}
                  <div
                    className={cn(
                      "shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isOpen 
                        ? "rotate-180" 
                        : "group-hover:scale-110"
                    )}
                    style={{
                      backgroundColor: isOpen ? colors.primary : `${colors.primary}20`,
                      color: isOpen ? 'white' : colors.primary
                    }}
                  >
                    {isOpen ? <Minus strokeWidth={2} size={18} /> : <Plus strokeWidth={2} size={18} />}
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={cn(
                    "grid transition-all duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className="px-6 lg:px-8 pb-6 lg:pb-8 pl-[5.5rem] lg:pl-[6.5rem] text-sm md:text-base leading-relaxed max-w-3xl"
                      style={{ color: colors.secondaryText }}
                    >
                      <TiptapRenderer content={item.answer} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FAQs.displayName = 'FAQs';

export default FAQs;
