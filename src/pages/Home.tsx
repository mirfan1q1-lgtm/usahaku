import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  StarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { Showcase, ContactInformation } from '../types';

export const Home: React.FC = () => {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroContacts, setHeroContacts] = useState<{
    whatsapp?: ContactInformation;
    email?: ContactInformation;
  }>({});


  useEffect(() => {
    fetchFeaturedShowcases();
    fetchHeroContacts();
  }, []);

  const fetchFeaturedShowcases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('showcases')
        .select('*')
        .eq('is_featured', true)
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_information')
        .select('*')
        .eq('is_active', true)
        .in('type', ['whatsapp', 'email'])
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Organize contacts by type
      const contacts: { whatsapp?: ContactInformation; email?: ContactInformation } = {};
      data?.forEach(contact => {
        if (contact.type === 'whatsapp') {
          contacts.whatsapp = contact;
        } else if (contact.type === 'email') {
          contacts.email = contact;
        }
      });
      
      setHeroContacts(contacts);
    } catch (error) {
      console.error('Error fetching hero contacts:', error);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex items-center relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Brand Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Solusi Website Profesional #1 di Indonesia
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
              <span className="block">Website Profesional</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 animate-gradient-x">
                untuk Masa Depan
              </span>
              <span className="block">Bisnis Anda</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transformasi digital dimulai dari sini. <strong className="text-white">OrbWeb Studio</strong> menciptakan 
              website modern, cepat, dan conversion-focused yang mengubah visitor menjadi customer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 flex items-center"
              >
                <RocketLaunchIcon className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                Mulai Konsultasi Gratis
              </Link>
              <Link
                to="/portfolio"
                className="group border-2 border-white/20 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm flex items-center"
              >
                <EyeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                Eksplorasi Portfolio
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="text-white/80">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-sm">Website Delivered</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-purple-400">99%</div>
                <div className="text-sm">Client Satisfaction</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-teal-400">24/7</div>
                <div className="text-sm">Support Available</div>
              </div>
              <div className="text-white/80">
                <div className="text-3xl font-bold text-pink-400">3 Hari</div>
                <div className="text-sm">Average Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About OrbWeb Studio Section - Full Screen */}
      <section className="min-h-screen flex items-center py-20 bg-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-48 translate-x-48 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-teal-50 to-blue-50 rounded-full translate-y-48 -translate-x-48 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold mb-6">
              Kenapa Memilih OrbWeb Studio?
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                OrbWeb Studio
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Kami bukan sekadar pembuat website. Kami adalah partner digital yang membantu 
              <strong className="text-gray-900"> transformasi bisnis Anda </strong>
              melalui teknologi web terdepan dan strategi digital yang terbukti efektif.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {/* Website Showcase */}
            <div className="group bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 hover:border-blue-300/70 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Website Showcase</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Template premium siap pakai dengan customisasi penuh. Hemat waktu dan budget 
                  dengan tetap mendapatkan website berkualitas profesional.
                </p>
                <div className="inline-flex items-center text-blue-700 font-semibold group-hover:text-blue-800 transition-colors">
                  <span>Mulai dari Rp 2.5 Juta</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Custom Website */}
            <div className="group bg-gradient-to-br from-teal-50 via-teal-100 to-green-100 p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 border border-teal-200/50 hover:border-teal-300/70 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-2xl mr-6 group-hover:scale-110 transition-transform duration-300">
                    <CogIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Custom Website</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Solusi website yang dirancang khusus sesuai kebutuhan unik bisnis Anda. 
                  From scratch dengan fitur advanced dan integasi sistem yang kompleks.
                </p>
                <div className="inline-flex items-center text-teal-700 font-semibold group-hover:text-teal-800 transition-colors">
                  <span>Mulai dari Rp 5 Juta</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-200/50">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4">
              Standar Kualitas <span className="text-blue-600">OrbWeb Studio</span>
            </h3>
            <p className="text-gray-600 text-center mb-12 text-lg">Setiap website yang kami buat memenuhi standar internasional</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: "📱", title: "Mobile-First Design", desc: "Optimized untuk semua device" },
                { icon: "⚡", title: "Lightning Fast", desc: "Loading speed < 3 detik" },
                { icon: "🎨", title: "Modern UI/UX", desc: "Design trends terkini" },
                { icon: "🔒", title: "Security First", desc: "SSL & keamanan maksimal" }
              ].map((feature, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">{feature.title}</h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Full Screen */}
      <section className="min-h-screen flex items-center py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8">
              🚀 Proses Kerja Kami
            </h2>
            <p className="text-xl sm:text-2xl text-blue-200 max-w-3xl mx-auto">
              Metodologi yang sudah terbukti menghasilkan website berkualitas tinggi 
              dalam waktu yang efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Discovery & Strategy", 
                desc: "Analisis mendalam kebutuhan bisnis dan target audience Anda",
                color: "from-blue-500 to-cyan-500"
              },
              { 
                step: "02", 
                title: "Design & Prototype", 
                desc: "Mockup visual dan wireframe yang detail sebelum development",
                color: "from-purple-500 to-pink-500"
              },
              { 
                step: "03", 
                title: "Development", 
                desc: "Coding dengan teknologi terdepan dan best practices",
                color: "from-teal-500 to-green-500"
              },
              { 
                step: "04", 
                title: "Testing & QA", 
                desc: "Quality assurance menyeluruh di berbagai device dan browser",
                color: "from-orange-500 to-red-500"
              },
              { 
                step: "05", 
                title: "Launch & Deploy", 
                desc: "Go-live dengan monitoring performance dan SEO optimization",
                color: "from-indigo-500 to-purple-500"
              },
              { 
                step: "06", 
                title: "Support & Growth", 
                desc: "Maintenance berkelanjutan dan strategi growth digital",
                color: "from-emerald-500 to-teal-500"
              }
            ].map((process, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <div className={`inline-block bg-gradient-to-r ${process.color} text-white font-bold text-2xl px-6 py-3 rounded-xl mb-6 group-hover:scale-110 transition-transform`}>
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">
                    {process.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/contact"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            >
              Diskusikan Project Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Showcase Preview - Full Screen */}
      <section className="min-h-screen flex flex-col py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-semibold mb-6">
              Portfolio Terbaru
            </div>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Etalase Website
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Koleksi template premium yang siap disesuaikan dengan brand dan kebutuhan bisnis Anda
            </p>
            <Link
              to="/showcase"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Explore All Templates
            </Link>
          </div>

          <div className="flex-1 flex items-center">
            {loading ? (
              <div className="flex justify-center items-center w-full">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
                  <div className="animate-ping absolute top-0 left-0 rounded-full h-20 w-20 border border-blue-400 opacity-25"></div>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {showcases.map((showcase) => (
                  <div key={showcase.id} className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:scale-105">
                    {showcase.is_featured && (
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-bold text-center flex items-center justify-center">
                        <StarIcon className="h-4 w-4 mr-2" />
                        FEATURED TEMPLATE
                      </div>
                    )}
                    <div className="relative overflow-hidden">
                      <img
                        src={showcase.image_url}
                        alt={showcase.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          showcase.category === 'basic' ? 'bg-green-100 text-green-800 border-2 border-green-200' :
                          showcase.category === 'premium' ? 'bg-blue-100 text-blue-800 border-2 border-blue-200' :
                          'bg-purple-100 text-purple-800 border-2 border-purple-200'
                        }`}>
                          {showcase.category === 'basic' ? 'BASIC' :
                           showcase.category === 'premium' ? 'PREMIUM' : 'ENTERPRISE'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{showcase.title}</h3>
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{showcase.description}</p>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        {showcase.price}
                      </div>
                      <div className="flex space-x-3">
                        {showcase.demo_url && (
                          <a
                            href={showcase.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gray-100 text-gray-700 text-center py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center group/btn"
                          >
                            <EyeIcon className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                            Live Preview
                          </a>
                        )}
                        <Link
                          to="/contact"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen flex items-center py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
              Ready to Launch Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                Digital Empire?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              Bergabunglah dengan <strong className="text-white">50+ bisnis</strong> yang sudah 
              mempercayakan transformasi digital mereka kepada <strong className="text-blue-300">OrbWeb Studio</strong>. 
              Saatnya website Anda menjadi mesin penjualan yang powerful!
            </p>
          </div>
          
          {/* Special Offer Badge */}
          <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/30 text-yellow-300 font-bold text-lg mb-12 backdrop-blur-sm animate-pulse">
            <SparklesIcon className="h-6 w-6 mr-3" />
            Konsultasi GRATIS + Analisis Kompetitor senilai Rp 500K
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/showcase"
              className="group bg-gradient-to-r from-white to-gray-100 text-gray-900 px-12 py-6 rounded-2xl text-xl font-bold hover:from-gray-100 hover:to-white transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/20 flex items-center"
            >
              <EyeIcon className="h-7 w-7 mr-3 group-hover:scale-110 transition-transform text-blue-600" />
              Lihat Template Premium
            </Link>
            <Link
              to="/contact"
              className="group border-3 border-white text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-white hover:text-gray-900 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/20 flex items-center backdrop-blur-sm"
            >
              <RocketLaunchIcon className="h-7 w-7 mr-3 group-hover:rotate-12 transition-transform" />
              Mulai Project Sekarang
            </Link>
          </div>
          
          {/* Trust Elements */}
          <div className="text-center text-blue-200">
            <p className="text-lg mb-4">Dipercaya oleh brand-brand ternama</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="font-semibold text-white">StartupTech</span>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="font-semibold text-white">EcoStore</span>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="font-semibold text-white">DigitalCorp</span>
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm border border-white/20">
                <span className="font-semibold text-white">CreativeHub</span>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="mt-16 pt-12 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* WhatsApp */}
              <div className="text-blue-200">
                <div className="text-2xl font-bold text-white mb-2">
                  {heroContacts.whatsapp?.label || 'WhatsApp'}
                </div>
                {heroContacts.whatsapp ? (
                  <a 
                    href={`https://wa.me/${heroContacts.whatsapp.value.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:text-white transition-colors"
                  >
                    {heroContacts.whatsapp.value}
                  </a>
                ) : (
                  <p className="text-lg">+62 812-3456-7890</p>
                )}
              </div>
              
              {/* Email */}
              <div className="text-blue-200">
                <div className="text-2xl font-bold text-white mb-2">
                  {heroContacts.email?.label || 'Email'}
                </div>
                {heroContacts.email ? (
                  <a 
                    href={`mailto:${heroContacts.email.value}`}
                    className="text-lg hover:text-white transition-colors"
                  >
                    {heroContacts.email.value}
                  </a>
                ) : (
                  <p className="text-lg">hello@orbwebstudio.com</p>
                )}
              </div>
              
              {/* Response Time */}
              <div className="text-blue-200">
                <div className="text-2xl font-bold text-white mb-2">Response Time</div>
                <p className="text-lg">{'<'} 2 Jam (Hari Kerja)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};