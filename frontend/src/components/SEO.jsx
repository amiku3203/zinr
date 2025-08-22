import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  image, 
  url, 
  type = 'website',
  author = 'ZinR',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData = null
}) => {
  const fullTitle = title ? `${title} - ZinR` : 'ZinR - Digital Restaurant Management Platform';
  const fullDescription = description || 'Transform your restaurant with ZinR - the complete digital menu, order management, and payment solution. Accept orders, manage menus, and grow your business digitally.';
  const fullKeywords = ['restaurant management', 'digital menu', 'online ordering', 'QR code menu', 'restaurant technology', 'food delivery', 'restaurant software', ...keywords].join(', ');
  
  const defaultImage = 'https://zinr.com/og-image.jpg'; // Replace with your actual OG image URL
  const fullImage = image || defaultImage;
  const fullUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ZinR" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@zinr" />
      <meta name="twitter:creator" content="@zinr" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#F59E0B" />
      <meta name="msapplication-TileColor" content="#F59E0B" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ZinR" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Structured Data for Organization */}
      {!structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ZinR",
            "url": "https://zinr.com",
            "logo": "https://zinr.com/logo.png",
            "description": "Digital Restaurant Management Platform",
            "foundingDate": "2024",
            "sameAs": [
              "https://twitter.com/zinr",
              "https://facebook.com/zinr",
              "https://linkedin.com/company/zinr"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-XXXXXXXXXX",
              "contactType": "customer service",
              "email": "support@zinr.com"
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
