import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { EyeIcon, StarIcon } from '@heroicons/react/24/outline';

interface Showcase {
  id: string;
  title: string;
  description: string;
  image_url: string;
  demo_url?: string;
  price: string;
  features: string[];
  category: 'basic' | 'premium' | 'enterprise';
  is_featured: boolean;
  created_at: string;
}

export const Showcase: React.FC = () => {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'premium' | 'enterprise'>('all');

  useEffect(() => {
    fetchShowcases();
  }, []);

  const fetchShowcases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('showcases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShowcases = selectedCategory === 'all'
    ? showcases
    : showcases.filter(showcase => showcase.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'basic':
        return 'Basic';
      case 'premium':
        return 'Premium';
      case 'enterprise':
        return 'Enterprise';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading showcases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Etalase OrbWeb Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih template website yang sesuai dengan kebutuhan bisnis Anda.
            Setiap etalase sudah termasuk hosting dan domain untuk 1 tahun pertama.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'basic', label: 'Basic' },
              { key: 'premium', label: 'Premium' },
              { key: 'enterprise', label: 'Enterprise' }
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                  selectedCategory === category.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Showcases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShowcases.map((showcase) => (
            <Card key={showcase.id} className={`relative overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
              showcase.is_featured ? 'ring-2 ring-blue-500' : ''
            }`}>
              {showcase.is_featured && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Featured
                  </span>
                </div>
              )}

              <div className="relative">
                <img
                  src={showcase.image_url}
                  alt={showcase.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(showcase.category)}`}>
                    {getCategoryLabel(showcase.category)}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{showcase.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{showcase.description}</p>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{showcase.price}</div>
                  <ul className="space-y-1">
                    {showcase.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                    {showcase.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{showcase.features.length - 3} fitur lainnya
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  {showcase.demo_url && (
                    <a
                      href={showcase.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Preview
                    </a>
                  )}
                  <Link
                    to="/contact"
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Pesan
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShowcases.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Tidak ada etalase dalam kategori ini.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Butuh Website Custom?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Jika tidak menemukan template yang sesuai, kami bisa membuat website custom
              sesuai dengan kebutuhan spesifik bisnis Anda.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Konsultasi Custom Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};