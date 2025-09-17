import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'OrbWeb Studio - Jasa Pembuatan Website Profesional',
  description = 'OrbWeb Studio menyediakan jasa pembuatan website profesional, template website, dan solusi digital untuk bisnis Anda. Dapatkan website modern, responsive, dan SEO-friendly.',
  keywords = 'jasa pembuatan website, template website, web development, website profesional, SEO, responsive design, digital marketing',
  image = '/og-image.jpg',
  url = 'https://orbwebstudio.com',
  type = 'website',
  structuredData
}) => {
  const fullTitle = title.includes('OrbWeb Studio') ? title : `${title} | OrbWeb Studio`;
  const fullUrl = url.startsWith('http') ? url : `https://orbwebstudio.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://orbwebstudio.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="OrbWeb Studio" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="OrbWeb Studio" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@orbwebstudio" />
      <meta name="twitter:creator" content="@orbwebstudio" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'OrbWeb Studio - Jasa Pembuatan Website Profesional',
    description: 'OrbWeb Studio menyediakan jasa pembuatan website profesional, template website, dan solusi digital untuk bisnis Anda. Dapatkan website modern, responsive, dan SEO-friendly.',
    keywords: 'jasa pembuatan website, template website, web development, website profesional, SEO, responsive design, digital marketing, orbweb studio',
    url: '/'
  },
  services: {
    title: 'Paket Layanan Website - OrbWeb Studio',
    description: 'Pilih paket layanan website yang sesuai dengan kebutuhan bisnis Anda. Mulai dari website company profile hingga e-commerce dengan harga terjangkau.',
    keywords: 'paket website, layanan website, harga website, company profile, e-commerce, landing page, website bisnis',
    url: '/services'
  },
  portfolio: {
    title: 'Portfolio Website - OrbWeb Studio',
    description: 'Lihat portfolio website yang telah kami buat untuk berbagai klien. Dapatkan inspirasi untuk website bisnis Anda.',
    keywords: 'portfolio website, contoh website, website klien, inspirasi website, desain website',
    url: '/portfolio'
  },
  showcase: {
    title: 'Template Website - OrbWeb Studio',
    description: 'Beli template website siap pakai dengan desain modern dan responsive. Cocok untuk berbagai jenis bisnis.',
    keywords: 'template website, jual template, desain template, website siap pakai, template responsive',
    url: '/showcase'
  },
  contact: {
    title: 'Kontak Kami - OrbWeb Studio',
    description: 'Hubungi OrbWeb Studio untuk konsultasi pembuatan website. Tim profesional siap membantu mewujudkan website impian Anda.',
    keywords: 'kontak orbweb studio, konsultasi website, hubungi kami, order website, jasa website',
    url: '/contact'
  }
};