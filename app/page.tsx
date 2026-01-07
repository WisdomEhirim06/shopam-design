'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero carousel images
  const heroImages = [
    {
      id: 1,
      title: 'Shopping Never Gets Stressful with ShopAm',
      subtitle: 'Discover amazing products from trusted vendors',
      image: '/api/placeholder/1200/600',
    },
    {
      id: 2,
      title: 'Everything You Need in One Place',
      subtitle: 'Browse thousands of products across all categories',
      image: '/api/placeholder/1200/600',
    },
    {
      id: 3,
      title: 'Connect with Local Vendors',
      subtitle: 'Support Nigerian businesses and get the best deals',
      image: '/api/placeholder/1200/600',
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Sample products
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wireless Earbuds',
      price: 15000,
      image: '/api/placeholder/300/300',
      vendor: 'TechHub Nigeria',
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: 'African Print Ankara Dress',
      price: 28000,
      image: '/api/placeholder/300/300',
      vendor: "Sarah's Fashion",
      rating: 4.9,
      reviews: 189,
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      price: 45000,
      image: '/api/placeholder/300/300',
      vendor: 'Electronics Plus',
      rating: 4.7,
      reviews: 456,
    },
    {
      id: 4,
      name: 'Leather Handbag Collection',
      price: 32000,
      image: '/api/placeholder/300/300',
      vendor: 'Luxury Bags NG',
      rating: 4.6,
      reviews: 321,
    },
    {
      id: 5,
      name: 'Gaming Headset Pro',
      price: 22000,
      image: '/api/placeholder/300/300',
      vendor: 'Gamer Store',
      rating: 4.8,
      reviews: 567,
    },
    {
      id: 6,
      name: 'Office Chair Ergonomic',
      price: 55000,
      image: '/api/placeholder/300/300',
      vendor: 'Home & Office',
      rating: 4.9,
      reviews: 234,
    },
    {
      id: 7,
      name: 'Bluetooth Speaker',
      price: 18000,
      image: '/api/placeholder/300/300',
      vendor: 'Audio World',
      rating: 4.7,
      reviews: 445,
    },
    {
      id: 8,
      name: 'Running Shoes Sport',
      price: 25000,
      image: '/api/placeholder/300/300',
      vendor: 'SportFit NG',
      rating: 4.8,
      reviews: 678,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                <img src="./public/shopam-logo.png" />
                
              </div>
              <span className="text-2xl font-bold text-gray-900">ShopAm</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/explore" className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium">
                Explore
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium">
                Categories
              </Link>
              <Link href="/vendors" className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium">
                Vendors
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Become a Vendor
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/explore"
                  className="block py-2 text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Explore
                </Link>
                <Link
                  href="/categories"
                  className="block py-2 text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/vendors"
                  className="block py-2 text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vendors
                </Link>
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block py-2 text-center border border-gray-200 rounded-lg font-medium hover:border-[#FA3728] hover:text-[#FA3728] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block py-2 text-center bg-[#FA3728] text-white rounded-lg font-semibold hover:bg-[#E31B23] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Become a Vendor
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="pt-16 relative overflow-hidden">
        <div className="relative h-[500px] md:h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FA3728] to-[#E31B23]">
                <div className="absolute inset-0 bg-black/40"></div>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {heroImages[currentSlide].title}
                      </h1>
                      <p className="text-xl md:text-2xl text-white/90 mb-8">
                        {heroImages[currentSlide].subtitle}
                      </p>
                      <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-[#FA3728] rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        <Search size={22} />
                        Explore Products
                        <ArrowRight size={22} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
          >
            <ChevronRight size={24} className="text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Stats Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#FA3728]">500+</p>
                  <p className="text-sm text-gray-600">Trusted Vendors</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#FA3728]">5k+</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-[#FA3728]">24/7</p>
                  <p className="text-sm text-gray-600">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full mb-4">
              <Sparkles className="text-[#FA3728]" size={18} />
              <span className="text-sm font-medium text-[#FA3728]">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Products
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what's hot with Nigerian shoppers right now
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5"></div>
                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                    <div className="px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900 flex items-center gap-1">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-4">
                  <p className="text-xs text-gray-500 mb-1 truncate">{product.vendor}</p>
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FA3728] transition-colors min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg md:text-xl font-bold text-[#FA3728]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">({product.reviews})</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore More CTA */}
          <div className="text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Explore More Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why ShopAm */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ShopAm?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              We make shopping stress-free with these key features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Trusted & Verified',
                description: 'All vendors are verified to ensure you shop with confidence and peace of mind.',
              },
              {
                icon: TrendingUp,
                title: 'Best Prices Always',
                description: 'Compare prices across vendors instantly and find the best deals on the market.',
              },
              {
                icon: Zap,
                title: 'Fast & Reliable',
                description: 'Quick delivery, responsive support, and seamless shopping experience guaranteed.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-50 rounded-2xl mb-6">
                  <feature.icon className="text-[#FA3728]" size={32} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#FA3728] to-[#E31B23] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Your Shopping Journey Today
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join thousands of happy shoppers discovering amazing products every day
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-[#FA3728] rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Search size={22} />
            Explore Products Now
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                  <img src="/public/shopam-logo.png" />
                </div>
                <span className="text-xl font-bold">ShopAm</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your stress-free shopping destination in Nigeria.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/explore" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="hover:text-white transition-colors">
                    Vendors
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Vendors */}
            <div>
              <h4 className="font-semibold mb-4">Sell</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/auth/signup" className="hover:text-white transition-colors">
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">© 2026 ShopAm. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}