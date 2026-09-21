'use client';

import { useEffect } from 'react';
import FloatingGallery from './components/home/FloatingGallery';
import HeroBrand from './components/home/HeroBrand';
import CategoryPills from './components/home/CategoryPills';
import ProductsShowcase from './components/home/ProductsShowcase';
import VendorsSpotlight from './components/home/VendorsSpotlight';
import CustomersSpotlight from './components/home/CustomersSpotlight';
import TypewriterLine from './components/home/TypewriterLine';
import HomeFooter from './components/home/HomeFooter';

export default function LandingPage() {
  // The homepage is always light, regardless of the saved global theme.
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#F8F9FA';
    document.documentElement.setAttribute('data-theme', 'light');
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  return (
    <div data-theme="light" className="min-h-screen bg-canvas font-sans text-ink">
      <FloatingGallery />
      <HeroBrand />
      <CategoryPills />
      <ProductsShowcase />
      <VendorsSpotlight />
      <CustomersSpotlight />
      <TypewriterLine />
      <HomeFooter />
    </div>
  );
}
