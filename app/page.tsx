'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Home,
  Utensils,
  Dumbbell,
  Camera,
  GraduationCap,
  Scissors,
  Wrench,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  HeadphonesIcon,
  Star,
  Heart,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStressPhrase, setCurrentStressPhrase] = useState(0);

  // Hero carousel slides
  const heroSlides = [
    {
      image: '/images/hero-woman-shopping.png',
      title: 'Shopping Never Gets',
      titleHighlight: 'Stressful',
      titleEnd: 'with ShopAm',
      subtitle: 'Discover amazing products from trusted vendors',
    },
    {
      image: '/images/hero-1.png',
      title: 'Find Everything',
      titleHighlight: 'You Need',
      titleEnd: 'in One Place',
      subtitle: 'From fashion to electronics, we have it all',
    },
    {
      image: '/images/hero-2.png',
      title: 'Shop with',
      titleHighlight: 'Confidence',
      titleEnd: 'Every Time',
      subtitle: 'Verified vendors, quality products, trusted service',
    },
  ];

  // Stress relief carousel with images
  const stressPhrases = [
    {
      text: "Tired of fake products?",
      image: '/images/stress-1.jpg',
    },
    {
      text: "Can't find what you need?",
      image: '/images/stress-2.jpg',
    },
    {
      text: "Worried about getting scammed?",
      image: '/images/stress-3.png',
    },
    {
      text: "Frustrated with poor customer service?",
      image: '/images/stress-4.jpg',
    },
    {
      text: "ShopAm is different.",
      image: '/images/stress-5.jpg',
      isResolution: true,
    },
  ];

  // Trending products
  const trendingProducts = [
    {
      id: 1,
      name: 'Premium Wireless Earbuds',
      price: 15000,
      originalPrice: 20000,
      discount: 25,
      image: '/images/products/earbuds.jpg',
      vendor: 'TechHub NG',
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: 'African Print Ankara Dress',
      price: 28000,
      image: '/images/products/ankara-dress.jpg',
      vendor: "Sarah's Fashion",
      rating: 4.9,
      reviews: 189,
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      price: 45000,
      originalPrice: 55000,
      discount: 18,
      image: '/images/products/smartwatch.jpg',
      vendor: 'Gadgets Plus',
      rating: 4.7,
      reviews: 456,
    },
    {
      id: 4,
      name: 'Luxury Leather Handbag',
      price: 32000,
      image: '/images/products/handbag.jpg',
      vendor: 'Luxury Bags NG',
      rating: 4.6,
      reviews: 321,
    },
  ];

  // Product images for infinite scroll
  const productImages = [
    '/images/products/fruits.jpg',
    '/images/products/shoes-black.jpg',
    '/images/products/chicken.jpg',
    '/images/products/sneakers-white.png',
    '/images/products/phone.png',
    '/images/products/fashion.jpg',
    '/images/products/hair.jpg',
  ];

  const productImages2 = [
    '/images/products/camera.jpg',
    '/images/products/sneakers-orange.jpg',
    '/images/products/book.png',
    '/images/products/boots.jpg',
    '/images/products/food.jpg',
    '/images/products/controller.jpg',
    '/images/products/girl.jpg',
  ];

  // Categories
  const categories = [
    { name: 'Beauty & Hair', icon: Scissors, color: 'bg-pink-50', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
    { name: 'Tech & Repair', icon: Wrench, color: 'bg-blue-50', textColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { name: 'Home Services', icon: Home, color: 'bg-green-50', textColor: 'text-green-600', iconBg: 'bg-green-100' },
    { name: 'Fashion', icon: ShoppingBag, color: 'bg-purple-50', textColor: 'text-purple-600', iconBg: 'bg-purple-100' },
    { name: 'Food & Catering', icon: Utensils, color: 'bg-orange-50', textColor: 'text-orange-600', iconBg: 'bg-orange-100' },
    { name: 'Fitness & Wellness', icon: Dumbbell, color: 'bg-pink-50', textColor: 'text-pink-600', iconBg: 'bg-pink-100' },
    { name: 'Photography', icon: Camera, color: 'bg-yellow-50', textColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    { name: 'Education', icon: GraduationCap, color: 'bg-blue-50', textColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  ];

  // Why choose ShopAm
  const benefits = [
    {
      icon: Shield,
      title: 'Verified Vendors',
      description: 'All vendors are thoroughly vetted and verified for your safety',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your products delivered quickly and reliably',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Our support team is always here to help you',
    },
  ];

  // Auto-rotate hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate stress phrases
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStressPhrase((prev) => (prev + 1) % stressPhrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Image src="/images/black-logo.png" alt="ShopAm Logo" width={40} height={100}></Image>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">
                Shop<span className="text-[#FA3728]">Am</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/explore" className="text-white/90 hover:text-white font-medium transition-colors">
                Explore
              </Link>
              <Link href="/feed" className="text-white/90 hover:text-white font-medium transition-colors">
                Categories
              </Link>
              <Link href="/vendors" className="text-white/90 hover:text-white font-medium transition-colors">
                Vendors
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/auth/user-signin"
                className="hidden sm:block text-white/90 hover:text-white font-medium transition-colors px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 sm:px-6 py-2 sm:py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-lg text-xs sm:text-base"
              >
                Become a Vendor
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden py-4 border-t border-white/20 bg-gray-900/95 backdrop-blur-md"
            >
              <div className="flex flex-col gap-3">
                <Link href="/explore" className="text-white/90 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Explore
                </Link>
                <Link href="/feed" className="text-white/90 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Categories
                </Link>
                <Link href="/vendors" className="text-white/90 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Vendors
                </Link>
                <Link href="/auth/user-signin" className="text-white/90 hover:text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="relative h-screen min-h-[500px] sm:min-h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <img
                src={heroSlides[currentSlide].image}
                alt="Shopping"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%23f3f4f6" width="1920" height="1080"/%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40"></div>
            </div>

            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6"
                  >
                    {heroSlides[currentSlide].title}{' '}
                    <span className="text-[#FA3728]">{heroSlides[currentSlide].titleHighlight}</span>{' '}
                    {heroSlides[currentSlide].titleEnd}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-10"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold text-sm sm:text-lg transition-all shadow-xl hover:shadow-2xl"
                    >
                      Explore Products
                      <ArrowRight size={20} />
                    </Link>
                  </motion.div>

                  <div className="flex gap-2 mt-6 sm:mt-12">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 rounded-full transition-all ${
                          index === currentSlide ? 'w-8 bg-[#FA3728]' : 'w-4 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-gray-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { number: '500+', label: 'Vendors Ready' },
              { number: '50+', label: 'Categories' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#FA3728] mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stress Relief Section with Images */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStressPhrase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Image */}
              <div className="order-2 lg:order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={stressPhrases[currentStressPhrase].image}
                    alt="Shopping experience"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h2
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${
                    stressPhrases[currentStressPhrase].isResolution
                      ? 'text-[#FA3728]'
                      : 'text-gray-900'
                  }`}
                >
                  {stressPhrases[currentStressPhrase].text}
                </h2>

                {stressPhrases[currentStressPhrase].isResolution && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-600"
                  >
                    Verified vendors. Real products. Trusted service.
                  </motion.p>
                )}

                <div className="flex gap-2 justify-center lg:justify-start mt-6">
                  {stressPhrases.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full transition-all ${
                        index === currentStressPhrase ? 'w-8 bg-[#FA3728]' : 'w-4 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Trending/Popular Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-[#FA3728] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Trending Now
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Popular Products
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what's trending on ShopAm
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f3f4f6" width="300" height="300"/%3E%3C/svg%3E';
                    }}
                  />
                  {product.discount && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#FA3728] text-white text-xs font-bold rounded">
                      -{product.discount}%
                    </span>
                  )}
                  <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={16} className="text-gray-700" />
                  </button>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {product.rating}
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.vendor}</p>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-lg sm:text-xl font-bold text-[#FA3728]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs sm:text-sm text-gray-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">({product.reviews} reviews)</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-md text-sm sm:text-base"
            >
              View All Products
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Infinite Scrolling Product Images */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="mb-6 sm:mb-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Shop by Category</h3>
        </div>

        <div className="relative mb-4 sm:mb-6 overflow-hidden">
          <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll-right">
            {[...productImages, ...productImages].map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
              >
                <img
                  src={img}
                  alt="Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll-left">
            {[...productImages2, ...productImages2].map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
              >
                <img
                  src={img}
                  alt="Product"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Popular Categories */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-[#FA3728] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Popular Categories
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Explore services across multiple categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${category.color} ${category.textColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:shadow-lg transition-all cursor-pointer group`}
                >
                  <div className={`${category.iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Why Choose ShopAm */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose ShopAm?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FA3728]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Icon className="text-[#FA3728]" size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Ready to Start Shopping CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#FA3728] to-[#E31B23] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8">
              Join thousands of happy customers shopping on ShopAm today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explore"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#FA3728] rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl text-sm sm:text-lg"
              >
                Start Shopping
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all text-sm sm:text-lg"
              >
                Become a Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-gray-900 text-white py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="text-[#FA3728]" size={28} />
                <span className="text-xl sm:text-2xl font-bold">ShopAm</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4">
                Your trusted marketplace for quality products and services from verified vendors across Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-2 text-sm sm:text-base">
                <Link href="/explore" className="block text-gray-400 hover:text-white transition-colors">
                  Explore
                </Link>
                <Link href="/vendors" className="block text-gray-400 hover:text-white transition-colors">
                  Vendors
                </Link>
                <Link href="/auth/signup" className="block text-gray-400 hover:text-white transition-colors">
                  Become a Vendor
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">Support</h4>
              <div className="space-y-2 text-sm sm:text-base">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2026 ShopAm. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-left {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right:hover,
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}