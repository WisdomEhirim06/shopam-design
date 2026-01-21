import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ShopAm - Nigeria's Trusted Online Marketplace | Shop from Verified Vendors",
    template: "%s | ShopAm"
  },
  description: "Discover quality products and services from trusted vendors across Nigeria. Shop electronics, fashion, food, beauty, home services and more. 500+ verified vendors, 50+ categories, 24/7 support.",
  keywords: [
    "online shopping Nigeria",
    "Nigerian marketplace",
    "buy products Nigeria",
    "trusted vendors Nigeria",
    "e-commerce Nigeria",
    "online store Nigeria",
    "shop electronics Nigeria",
    "fashion marketplace",
    "food delivery Nigeria",
    "beauty products Nigeria",
    "verified sellers",
    "ShopAm",
    "social commerce",
    "vendor marketplace"
  ],
  authors: [{ name: "ShopAm Team" }],
  creator: "ShopAm",
  publisher: "ShopAm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shopam.ng'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ShopAm - Nigeria's Trusted Online Marketplace",
    description: "Shop from 500+ verified vendors across 50+ categories. Quality products, trusted service, 24/7 support.",
    url: 'https://shopam.ng',
    siteName: 'ShopAm',
    images: [
      {
        url: '/images/og-image.jpg', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'ShopAm - Shopping Never Gets Stressful',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ShopAm - Nigeria's Trusted Online Marketplace",
    description: "Shop from 500+ verified vendors. Quality products, trusted service.",
    images: ['/images/twitter-image.jpg'], // Add your Twitter card image
    creator: '@shopam_ng', // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}