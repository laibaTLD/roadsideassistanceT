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

export default function ServiceClient({ service }: ServiceClientProps) {
  const { services } = useWebBuilder();
  
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service could not be found.</p>
          <Link href="/" className="inline-block text-blue-600 hover:underline">
            Return Home
          </Link>
        </div>
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
