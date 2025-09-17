import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Portfolio as PortfolioType } from '../types';
import { supabase } from '../lib/supabase';
import { SEO, seoConfig } from '../components/SEO';
import { getPortfolioStructuredData, getBreadcrumbStructuredData } from '../lib/structuredData';
import { EyeIcon } from '@heroicons/react/24/outline';

export const Portfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<PortfolioType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'landing', name: 'Landing Page' },
    { id: 'profile', name: 'Profil Usaha' },
    { id: 'portfolio', name: 'Portofolio' }
  ];

  useEffect(() => {
    console.log('Portfolio page mounted, starting data fetch...');
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      console.log('Fetching portfolios from database...');
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching portfolios:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details
        });
      } else {
        console.log('Portfolios fetched successfully:', data);
        console.log('Number of portfolios:', data?.length || 0);
        setPortfolios(data || []);
      }
    } catch (error) {
      console.error('Network error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolios = selectedCategory === 'all' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        {...seoConfig.portfolio}
        structuredData={[
          getBreadcrumbStructuredData([
            { name: 'Home', url: '/' },
            { name: 'Portfolio', url: '/portfolio' }
          ]),
          ...portfolios.map(portfolio => getPortfolioStructuredData(portfolio))
        ]}
      />
      <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Portfolio Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat hasil karya website yang telah kami buat untuk berbagai klien UMKM. 
            Setiap project dibuat dengan standar profesional dan disesuaikan dengan kebutuhan bisnis.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12 space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 mb-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolios.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <EyeIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Portfolio
              </h3>
              <p className="text-gray-600 mb-6">
                Portfolio akan ditampilkan di sini setelah admin menambahkan karya.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolios.map((portfolio) => (
              <Card key={portfolio.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={portfolio.image_url}
                    alt={portfolio.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      {portfolio.demo_url && (
                        <a
                          href={portfolio.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
                        >
                          <EyeIcon className="w-4 h-4 mr-2" />
                          Lihat Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      portfolio.category === 'landing' 
                        ? 'bg-blue-100 text-blue-800'
                        : portfolio.category === 'profile'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {portfolio.category === 'landing'
                        ? 'Landing Page'
                        : portfolio.category === 'profile'
                        ? 'Profil Usaha'
                        : 'Portofolio'
                      }
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {portfolio.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {portfolio.description}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(portfolio.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ingin Website Seperti Ini untuk Bisnis Anda?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Setiap website yang kami buat disesuaikan dengan kebutuhan dan karakteristik 
            bisnis klien. Mari diskusikan project website impian Anda!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Konsultasi Project
            </a>
            <a
              href="/services"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Lihat Paket Harga
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};