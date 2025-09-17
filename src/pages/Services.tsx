import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { SEO, seoConfig } from '../components/SEO';
import { getServiceStructuredData, getBreadcrumbStructuredData } from '../lib/structuredData';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services from database...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Services fetch result:', { data, error, count: data?.length });

      if (error) {
        console.error('Database error:', error);
        // Don't throw error, just use fallback data
        setServices([]);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback hardcoded services if database is empty
  const fallbackServices = [
    {
      id: 'landing',
      name: 'Landing Page',
      icon: <GlobeAltIcon className="h-12 w-12" />,
      price: 'Rp 2.500.000',
      description: 'Website satu halaman yang fokus pada konversi dan call-to-action untuk meningkatkan leads',
      features: {
        included: [
          'Desain modern & responsif',
          'Form kontak terintegrasi',
          'SEO basic optimization',
          'Google Analytics setup',
          'Social media integration',
          '1x revisi design',
          'Domain & hosting 1 tahun',
          'SSL Certificate'
        ],
        notIncluded: [
          'Multiple pages',
          'Content management',
          'E-commerce features',
          'Advanced SEO'
        ]
      },
      timeline: '5-7 hari kerja',
      ideal: 'Bisnis yang ingin fokus pada satu produk/layanan utama'
    },
    {
      id: 'profile',
      name: 'Profil Usaha',
      icon: <DocumentTextIcon className="h-12 w-12" />,
      price: 'Rp 4.500.000',
      description: 'Website lengkap multi-halaman untuk profil perusahaan dengan fitur comprehensive',
      features: {
        included: [
          '5-7 halaman lengkap (Home, About, Services, Gallery, Contact)',
          'Admin panel untuk update konten',
          'Blog/artikel section',
          'Galeri produk/layanan',
          'Advanced SEO optimization',
          'Contact forms multiple',
          '2x revisi design',
          'Domain & hosting 1 tahun',
          'SSL Certificate',
          'Google My Business setup'
        ],
        notIncluded: [
          'E-commerce functionality',
          'Payment gateway',
          'User registration',
          'Advanced integrations'
        ]
      },
      timeline: '10-14 hari kerja',
      ideal: 'UMKM yang ingin membangun kredibilitas dan presence online yang kuat',
      popular: true
    },
    {
      id: 'portfolio',
      name: 'Website Portofolio',
      icon: <PhotoIcon className="h-12 w-12" />,
      price: 'Rp 3.500.000',
      description: 'Showcase karya dan layanan dengan tampilan visual yang elegan dan professional',
      features: {
        included: [
          'Gallery interaktif dengan lightbox',
          'Project showcase pages',
          'Testimonial section',
          'About & contact pages',
          'Mobile-optimized gallery',
          'Social media integration',
          '1x revisi design',
          'Domain & hosting 1 tahun',
          'SSL Certificate'
        ],
        notIncluded: [
          'Blog functionality',
          'E-commerce features',
          'Client portal',
          'Advanced animations'
        ]
      },
      timeline: '7-10 hari kerja',
      ideal: 'Freelancer, fotografer, designer, atau creative agency'
    }
  ];

  // Use database services if available, otherwise use fallback
  const displayServices = services.length > 0 ? services : fallbackServices;

  // Type guard to check if service has fallback properties
  const hasFallbackProperties = (service: any): service is typeof fallbackServices[0] => {
    return 'timeline' in service && 'ideal' in service;
  };

  // Helper function to get icon component from string
  const getIconComponent = (iconString: string) => {
    switch (iconString) {
      case '🚀':
        return <GlobeAltIcon className="h-12 w-12" />;
      case '🏢':
        return <DocumentTextIcon className="h-12 w-12" />;
      case '🎨':
        return <PhotoIcon className="h-12 w-12" />;
      default:
        return <span className="text-4xl">{iconString}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const additionalServices = [
    {
      name: 'Maintenance & Support',
      price: 'Rp 300.000/bulan',
      description: 'Update konten, backup, security monitoring'
    },
    {
      name: 'Additional Pages',
      price: 'Rp 500.000/halaman',
      description: 'Tambahan halaman khusus sesuai kebutuhan'
    },
    {
      name: 'E-commerce Integration',
      price: 'Rp 2.000.000',
      description: 'Integrasi toko online dengan payment gateway'
    },
    {
      name: 'Custom Features',
      price: 'Mulai Rp 1.000.000',
      description: 'Fitur khusus sesuai kebutuhan bisnis'
    }
  ];

  return (
    <>
      <SEO
        {...seoConfig.services}
        structuredData={[
          getBreadcrumbStructuredData([
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/services' }
          ]),
          ...services.map(service => getServiceStructuredData(service))
        ]}
      />
      <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Paket Layanan Website
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. 
            Semua paket sudah termasuk domain, hosting, dan SSL certificate.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {displayServices.map((service) => (
            <div 
              key={service.id} 
              className={`relative bg-white rounded-xl shadow-lg border-2 p-8 ${
                hasFallbackProperties(service) && service.popular 
                  ? 'border-blue-500 transform scale-105' 
                  : 'border-gray-200 hover:border-blue-300'
              } transition-all duration-200`}
            >
              {hasFallbackProperties(service) && service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    PALING POPULER
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-blue-600 flex justify-center mb-4">
                  {typeof service.icon === 'string' ? getIconComponent(service.icon) : service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {service.price}
                </div>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                {Array.isArray(service.features) ? (
                  // Database service - simple features array
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Fallback service - detailed features object
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Yang Anda Dapatkan:</h4>
                    <ul className="space-y-2 mb-4">
                      {service.features.included.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-semibold text-gray-900 mb-3">Tidak Termasuk:</h4>
                    <ul className="space-y-2">
                      {service.features.notIncluded.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <XCircleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Timeline & Ideal For - Only show for fallback services */}
              {hasFallbackProperties(service) && service.timeline && service.ideal && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="mb-3">
                    <span className="font-semibold text-gray-900">Timeline: </span>
                    <span className="text-gray-600">{service.timeline}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Cocok untuk: </span>
                    <span className="text-gray-600">{service.ideal}</span>
                  </div>
                </div>
              )}

              <Link
                to="/contact"
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors duration-200 ${
                  hasFallbackProperties(service) && service.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Pilih Paket Ini
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Layanan Tambahan
            </h2>
            <p className="text-lg text-gray-600">
              Upgrade dan customize website Anda dengan layanan tambahan kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <span className="text-lg font-bold text-blue-600">
                    {service.price}
                  </span>
                </div>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Butuh Konsultasi untuk Pilih Paket yang Tepat?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tim kami siap membantu Anda menentukan paket yang sesuai dengan kebutuhan 
            dan budget bisnis Anda. Konsultasi gratis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Konsultasi Gratis
            </Link>
            <Link
              to="/portfolio"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Lihat Contoh Hasil
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};