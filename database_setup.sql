-- ===========================================
-- OrbWeb Studio Database Setup
-- Run this SQL in your Supabase SQL Editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLE CREATION (Order matters for foreign keys)
-- ===========================================

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(100),
  features TEXT[],
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  demo_url VARCHAR(500),
  category VARCHAR(50) CHECK (category IN ('landing', 'profile', 'portfolio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create showcases table FIRST (before orders table due to foreign key)
CREATE TABLE IF NOT EXISTS showcases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  demo_url VARCHAR(500),
  price VARCHAR(100) NOT NULL,
  features TEXT[],
  category VARCHAR(50) CHECK (category IN ('basic', 'premium', 'enterprise')),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table (references showcases)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  service_type VARCHAR(100) NOT NULL,
  showcase_id UUID REFERENCES showcases(id),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ROW LEVEL SECURITY SETUP
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Services policies (public read, authenticated write)
CREATE POLICY "services_select_policy" ON services FOR SELECT USING (true);
CREATE POLICY "services_insert_policy" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "services_update_policy" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "services_delete_policy" ON services FOR DELETE USING (auth.role() = 'authenticated');

-- Portfolios policies (public read, authenticated write)
CREATE POLICY "portfolios_select_policy" ON portfolios FOR SELECT USING (true);
CREATE POLICY "portfolios_insert_policy" ON portfolios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "portfolios_update_policy" ON portfolios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "portfolios_delete_policy" ON portfolios FOR DELETE USING (auth.role() = 'authenticated');

-- Showcases policies (public read, authenticated write)
CREATE POLICY "showcases_select_policy" ON showcases FOR SELECT USING (true);
CREATE POLICY "showcases_insert_policy" ON showcases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "showcases_update_policy" ON showcases FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "showcases_delete_policy" ON showcases FOR DELETE USING (auth.role() = 'authenticated');

-- Orders policies (public insert, authenticated read/write)
CREATE POLICY "orders_insert_policy" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_policy" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "orders_update_policy" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "orders_delete_policy" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showcases_updated_at BEFORE UPDATE ON showcases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert sample services
INSERT INTO services (name, description, price, features, icon) VALUES
('Landing Page', 'Website landing page yang menarik untuk bisnis Anda', 'Rp 500.000', ARRAY['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Contact Form'], '🚀'),
('Profil Usaha', 'Website profil lengkap untuk memperkenalkan bisnis Anda', 'Rp 1.500.000', ARRAY['Company Profile', 'Services Showcase', 'Team Section', 'Contact Integration'], '🏢'),
('Website Portfolio', 'Portfolio website untuk menampilkan karya dan jasa Anda', 'Rp 2.000.000', ARRAY['Project Gallery', 'Skills Section', 'Testimonials', 'Blog Integration'], '🎨');

-- Insert sample portfolios
INSERT INTO portfolios (title, description, image_url, demo_url, category) VALUES
('Landing Page Kafe Modern', 'Website landing page untuk kafe dengan desain modern dan menarik', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 'https://example.com/demo1', 'landing'),
('Profil Usaha Toko Online', 'Website profil untuk toko online dengan katalog produk', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500', 'https://example.com/demo2', 'profile'),
('Portfolio Fotografer', 'Website portfolio untuk fotografer profesional', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500', 'https://example.com/demo3', 'portfolio');

-- Insert sample showcases
INSERT INTO showcases (title, description, image_url, demo_url, price, features, category, is_featured) VALUES
('Landing Page Basic', 'Template landing page sederhana untuk bisnis kecil', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 'https://example.com/showcase1', 'Rp 1.500.000', ARRAY['1 halaman responsif', 'Form kontak', 'SEO dasar', 'Mobile friendly'], 'basic', false),
('Landing Page Premium', 'Template landing page premium dengan animasi dan fitur lengkap', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', 'https://example.com/showcase2', 'Rp 3.000.000', ARRAY['Animasi smooth', 'Multi section', 'CTA optimized', 'Analytics integration', 'SSL certificate'], 'premium', true),
('Website Profil Basic', 'Template website profil untuk UMKM dengan 3 halaman', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500', 'https://example.com/showcase3', 'Rp 2.500.000', ARRAY['3 halaman lengkap', 'Galeri produk', 'Form kontak', 'SEO optimized', 'Mobile responsive'], 'basic', false),
('Website Profil Premium', 'Template website profil premium dengan fitur lengkap', 'https://images.unsplash.com/photo-1486312338219-ce68e2c6f44d?w=500', 'https://example.com/showcase4', 'Rp 5.000.000', ARRAY['5+ halaman', 'CMS admin panel', 'E-commerce ready', 'Multi language', 'Advanced analytics'], 'premium', true),
('Website Portfolio Basic', 'Template portfolio untuk freelancer dan kreator', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500', 'https://example.com/showcase5', 'Rp 2.000.000', ARRAY['Gallery interaktif', 'About & services', 'Contact form', 'Social media links'], 'basic', false),
('Website Portfolio Enterprise', 'Template portfolio enterprise dengan fitur advanced', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', 'https://example.com/showcase6', 'Rp 8.000.000', ARRAY['Client showcase', 'Testimonial system', 'Blog integration', 'Advanced gallery', 'Custom animations', 'Performance optimized'], 'enterprise', true);

-- ===========================================
-- SETUP COMPLETE
-- ===========================================

-- Next steps:
-- 1. Create admin user in Supabase Dashboard > Authentication > Users
-- 2. Login at /admin with the created credentials
-- 3. Start managing showcases, portfolios, and orders