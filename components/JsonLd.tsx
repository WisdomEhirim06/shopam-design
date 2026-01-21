export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ShopAm",
    "description": "Nigeria's trusted online marketplace connecting buyers with verified vendors",
    "url": "https://shopam.ng",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shopam.ng/explore?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopAm",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shopam.ng/logo.png"
      }
    },
    "sameAs": [
      "https://facebook.com/shopam",
      "https://twitter.com/shopam_ng",
      "https://instagram.com/shopam_ng"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShopAm",
    "alternateName": "ShopAm Nigeria",
    "url": "https://shopam.ng",
    "logo": "https://shopam.ng/logo.png",
    "description": "Nigeria's trusted online marketplace with 500+ verified vendors across 50+ categories",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressRegion": "Lagos"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English"],
      "areaServed": "NG"
    }
  };

  const marketplaceData = {
    "@context": "https://schema.org",
    "@type": "MarketPlace",
    "name": "ShopAm Marketplace",
    "description": "Shop electronics, fashion, food, beauty products and services from verified Nigerian vendors",
    "url": "https://shopam.ng/explore",
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": "5000+",
      "priceCurrency": "NGN"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceData) }}
      />
    </>
  );
}