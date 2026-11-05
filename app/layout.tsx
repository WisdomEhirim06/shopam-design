import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Dancing_Script, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import JsonLd from "@/components/JsonLd";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: '--font-script',
  display: 'swap',
  weight: ['400', '700'],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: '--font-bricolage',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "ShopSafeNG - Nigeria's Trusted Online Marketplace | Shop from Verified Vendors",
    template: "%s | ShopSafeNG"
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
    "ShopSafeNG",
    "ShopSafe",
    "social commerce",
    "vendor marketplace"
  ],
  authors: [{ name: "ShopSafeNG Team" }],
  creator: "ShopSafeNG",
  publisher: "ShopSafeNG",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shopsafe.ng'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/images/shopsafe-icon.svg', type: 'image/svg+xml' },
      { url: '/images/Vector.png' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "ShopSafeNG - Nigeria's Trusted Online Marketplace",
    description: "Shop from 500+ verified vendors across 50+ categories. Quality products, trusted service, 24/7 support.",
    url: 'https://shopsafe.ng',
    siteName: 'ShopSafeNG',
    images: [
      {
        url: '/images/hero-3.jpg',
        width: 1200,
        height: 630,
        alt: 'ShopSafeNG - Shop n Get. Shopping Never Gets Stressful',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ShopSafeNG - Nigeria's Trusted Online Marketplace",
    description: "Shop from 500+ verified vendors. Quality products, trusted service.",
    images: ['/twitter-image.jpg'],
    creator: '@shopsafeng',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${dmSans.variable} ${bricolage.variable} ${dancingScript.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className={jakartaSans.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}