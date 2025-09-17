// Structured Data untuk SEO
export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "OrbWeb Studio",
  "description": "Jasa pembuatan website profesional, template website, dan solusi digital untuk bisnis Anda",
  "url": "https://orbwebstudio.com",
  "logo": "https://orbwebstudio.com/logo.png",
  "image": "https://orbwebstudio.com/og-image.jpg",
  "foundingDate": "2024",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ID",
    "addressLocality": "Jakarta",
    "addressRegion": "DKI Jakarta"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-812-3456-7890",
    "contactType": "customer service",
    "availableLanguage": "Indonesian"
  },
  "sameAs": [
    "https://instagram.com/orbwebstudio",
    "https://facebook.com/orbwebstudio",
    "https://linkedin.com/company/orbwebstudio"
  ],
  "service": [
    {
      "@type": "Service",
      "name": "Jasa Pembuatan Website",
      "description": "Pembuatan website profesional dengan desain modern dan responsive",
      "provider": {
        "@type": "Organization",
        "name": "OrbWeb Studio"
      }
    },
    {
      "@type": "Service", 
      "name": "Template Website",
      "description": "Template website siap pakai dengan desain berkualitas tinggi",
      "provider": {
        "@type": "Organization",
        "name": "OrbWeb Studio"
      }
    }
  ]
});

export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OrbWeb Studio",
  "description": "Jasa pembuatan website profesional dan template website",
  "url": "https://orbwebstudio.com",
  "publisher": {
    "@type": "Organization",
    "name": "OrbWeb Studio"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://orbwebstudio.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const getServiceStructuredData = (service: any) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "OrbWeb Studio",
    "url": "https://orbwebstudio.com"
  },
  "offers": {
    "@type": "Offer",
    "price": service.price,
    "priceCurrency": "IDR",
    "availability": "https://schema.org/InStock"
  },
  "serviceType": "Web Development",
  "areaServed": "Indonesia"
});

export const getPortfolioStructuredData = (portfolio: any) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": portfolio.title,
  "description": portfolio.description,
  "creator": {
    "@type": "Organization",
    "name": "OrbWeb Studio"
  },
  "url": portfolio.demo_url,
  "image": portfolio.image_url,
  "genre": portfolio.category,
  "dateCreated": portfolio.created_at
});

export const getBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://orbwebstudio.com${item.url}`
  }))
});

export const getFAQStructuredData = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const getLocalBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "OrbWeb Studio",
  "description": "Jasa pembuatan website profesional dan template website",
  "url": "https://orbwebstudio.com",
  "telephone": "+62-812-3456-7890",
  "email": "info@orbwebstudio.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Contoh No. 123",
    "addressLocality": "Jakarta Selatan",
    "addressRegion": "DKI Jakarta",
    "postalCode": "12345",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-6.2088",
    "longitude": "106.8456"
  },
  "openingHours": "Mo-Fr 09:00-17:00",
  "priceRange": "$$",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer",
  "currenciesAccepted": "IDR"
});