import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <CodeBracketIcon className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">OrbWeb Studio</span>
            </div>
            <p className="text-gray-300 mb-4">
              Solusi terbaik untuk kebutuhan website UMKM Anda. 
              Kami membantu mengembangkan bisnis dengan website profesional.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Landing Page</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Profil Usaha</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Website Portofolio</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portofolio</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 OrbWeb Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};