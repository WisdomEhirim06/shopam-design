export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ShopSafeNG",
    "description": "Nigeria's trusted online marketplace connecting buyers with verified vendors",
    "url": "https://shopsafe.ng",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shopsafe.ng/explore?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopSafeNG",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shopsafe.ng/images/shopsafe-logo.svg"
      }
    },
    "sameAs": [
      "https://facebook.com/shopsafeng",
      "https://twitter.com/shopsafeng",
      "https://instagram.com/shopsafeng"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ShopSafeNG",
    "alternateName": "ShopSafe Nigeria",
    "url": "https://shopsafe.ng",
    "logo": "https://shopsafe.ng/images/shopsafe-logo.svg",
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
    "name": "ShopSafeNG Marketplace",
    "description": "Shop electronics, fashion, food, beauty products and services from verified Nigerian vendors",
    "url": "https://shopsafe.ng/explore",
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
