'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { ServiceDetail } from '@/app/components/sections/ServiceDetail';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import Link from 'next/link';
import { Service } from '@/app/lib/types';

interface ServiceClientProps {
  serviceSlug: string;
  service: Service | null;
}

export default function ServiceClient({ serviceSlug, service: serverService }: ServiceClientProps) {
  const { services, loading } = useWebBuilder();
  
  // Use server data if available, otherwise find in client data
  const service = serverService || services.find(s => s.slug === serviceSlug);
  
  if (loading && !service) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-xs uppercase tracking-[0.4em] opacity-40">Loading Service...</div>
        </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
                <h2 className="text-4xl font-serif uppercase tracking-tight mb-4">Service Not Found</h2>
                <p className="text-xs uppercase tracking-[0.3em] opacity-60 mb-8">The requested service could not be located.</p>
                <Link 
                    href="/services" 
                    className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-black pb-1 hover:opacity-60 transition-opacity"
                >
                    View All Services
                </Link>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <ServiceDetail service={service} allServices={services} />
      <Footer />
    </div>
  );
}
