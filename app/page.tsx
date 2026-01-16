'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';

// Stress Relief Section Component
function StressReliefSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  // E-commerce pain points that ShopAm solves
  const stressPhrases = [
    {
      text: "Tired of fake products?",
      image: "/images/stress-1.jpg", // confused shopper with counterfeit item
    },
    {
      text: "Can't find what you need?",
      image: "/images/stress-2.jpg", // person searching endlessly on phone
    },
    {
      text: "Worried about getting scammed?",
      image: "/images/stress-3.png", // person looking worried at checkout
    },
    {
      text: "Frustrated with poor customer service?",
      image: "/images/stress-4.jpg", // person on hold waiting
    },
    {
      text: "ShopAm is different.",
      image: "/images/stress-5.jpg", // happy satisfied shopper
      isResolution: true,
    },
  ];

  useEffect(() => {
    // Change phrase every 3 seconds
    const timer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % stressPhrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Animated Typography */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhrase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                <h2
                  className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
                    stressPhrases[currentPhrase].isResolution
                      ? 'text-[#FA3728]'
                      : 'text-gray-900'
                  }`}
                >
                  {stressPhrases[currentPhrase].text}
                </h2>
                
                {stressPhrases[currentPhrase].isResolution && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-xl text-gray-600"
                  >
                    Verified vendors. Real products. Trusted service.
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex gap-2 mt-8">
              {stressPhrases.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index === currentPhrase ? 'bg-[#FA3728]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right - Animated Images */}
          <div className="relative h-[350px] md:h-[400px] lg:h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhrase}
                initial={{ opacity: 0, scale: 0.95, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: 3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {/* Image Container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  {/* Placeholder Background */}
                  <Image src={stressPhrases[currentPhrase].image} alt="" fill className="object-cover" />
                  <div
                    className={`w-full h-full ${
                      stressPhrases[currentPhrase].isResolution
                        ? 'bg-gradient-to-br from-green-100 to-emerald-200'
                        : 'bg-gradient-to-br from-gray-100 to-gray-300'
                    } flex items-center justify-center`}
                  >
                    <span className="text-gray-400 text-center px-8 text-sm">
                      Image {currentPhrase + 1}
                      <br />
                      <span className="text-xs mt-2 block">
                        {stressPhrases[currentPhrase].isResolution
                          ? '(Happy shopper)'
                          : '(Pain point visual)'}
                      </span>
                    </span>
                  </div>

                  {/* Overlay for non-resolution slides */}
                  {!stressPhrases[currentPhrase].isResolution && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  )}
                </div>

                {/* Decorative Element */}
                {stressPhrases[currentPhrase].isResolution && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute -top-3 -right-3 w-16 h-16 md:w-20 md:h-20 bg-[#FA3728] rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check size={32} className="text-white" />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel images (your 3 images)
  const heroImages = [
    {
      id: 1,
      title: 'Shopping Never Gets Stressful with ShopAm',
      subtitle: 'Discover amazing products from trusted vendors',
      image: '/images/hero-1.png',
    },
    {
      id: 2,
      title: 'Everything You Need in One Place',
      subtitle: 'Browse thousands of products across all categories',
      image: '/images/hero-2.png',
    },
    {
      id: 3,
      title: 'Connect with Local Vendors',
      subtitle: 'Support Nigerian businesses and get the best deals',
      image: '/images/hero-3.png',
    },
  ];

  // Auto-scroll carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // Sample products with reduced card size
  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Earbuds Pro',
      price: 15000,
      image: '/api/placeholder/200/200',
      vendor: 'TechHub',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'African Print Dress',
      price: 28000,
      image: '/api/placeholder/200/200',
      vendor: "Sarah's Store",
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      price: 45000,
      image: '/api/placeholder/200/200',
      vendor: 'Electronics Plus',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Leather Handbag',
      price: 32000,
      image: '/api/placeholder/200/200',
      vendor: 'Fashion Corner',
      rating: 4.6,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/black-logo.png" alt="ShopAm" width={40} height={40} />
              <span className="text-2xl font-bold text-gray-900">ShopAm</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/explore"
                className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
              >
                Explore
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                href="/vendors"
                className="text-gray-600 hover:text-[#FA3728] transition-colors font-medium"
              >
                Vendors
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="md:flex items-center gap-4">
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
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="pt-16 relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* Background with Diagonal Image Effect */}
              <div className="absolute inset-0">
                {/* Base Red Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FA3728] to-[#E31B23]"></div>

                {/* Image Layer 1 - Diagonal clip */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage: `url(${heroImages[currentSlide].image})`,
                    clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)',
                  }}
                ></div>

                {/* Image Layer 2 - Blend overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url(${heroImages[currentSlide].image})`,
                    clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 30% 100%)',
                  }}
                ></div>

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                  >
                    {heroImages[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-2xl text-white/90 mb-8"
                  >
                    {heroImages[currentSlide].subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-[#FA3728] rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
                    >
                      Explore Products
                      <ArrowRight size={22} />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-[#FA3728]">500+</p>
                <p className="text-sm md:text-base text-gray-300">Vendors Ready</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-[#FA3728]">50+</p>
                <p className="text-sm md:text-base text-gray-300">Categories</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-[#FA3728]">24/7</p>
                <p className="text-sm md:text-base text-gray-300">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stress Relief Section - Animated Typography + Images */}
      <StressReliefSection />

      {/* Featured Products - REDUCED SIZE */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-red-100 text-[#FA3728] rounded-full text-sm font-semibold mb-4">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Products
            </h2>
            <p className="text-lg text-gray-600">
              Discover your favorite products from your nearest vendors
            </p>
          </div>

          {/* Products Grid - REDUCED SIZE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer border border-gray-100"
              >
                {/* Product Image - SMALLER */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5"></div>
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-gray-900">{product.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info - REDUCED SPACE */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1 truncate">{product.vendor}</p>
                  <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-[#FA3728] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold text-[#FA3728] mt-1">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Explore More CTA */}
          <div className="text-center">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Explore More Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose ShopAm */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ShopAm?</h2>
            <p className="text-lg text-gray-400">Your trusted shopping partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FA3728] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Vendors</h3>
              <p className="text-gray-400">All vendors are verified for your safety</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FA3728] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-400">Compare and get the best deals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FA3728] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Get your products delivered quickly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#FA3728] to-[#E31B23] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers on ShopAm
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#FA3728] rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl"
          >
            Explore Products Now
            <ArrowRight size={24} />
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
                  <span className="text-white font-bold">S</span>
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