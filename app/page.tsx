'use client';

import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Stats from './components/landing/Stats';
import StressCarousel from './components/landing/StressCarousel';
import TrendingProducts from './components/landing/TrendingProducts';
import InfiniteScroll from './components/landing/InfiniteScroll';
import Categories from './components/landing/Categories';
import WhyChoose from './components/landing/WhyChoose';
import Cta from './components/landing/Cta';
import Footer from './components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <StressCarousel />
      <TrendingProducts />
      <InfiniteScroll />
      <Categories />
      <WhyChoose />
      <Cta />
      <Footer />
    </div>
  );
}
