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

  const heroSlides = [
    {
      image: '/images/hero-shopping.jpg',
      title: 'Shopping Never Gets',
      titleHighlight: 'Stressful',
     
      subtitle: 'Discover amazing products from trusted vendors',
    },
    {
      image: '/images/hero-3.jpg',
      title: 'Find Everything',
      titleHighlight: 'You Need',
      titleEnd: 'in One Place',
      subtitle: 'From fashion to electronics, we have it all',
    },
    {
      image: '/images/hero-4.jpg',
      title: 'Shop with',
      titleHighlight: 'Confidence',
      titleEnd: 'Every Time',
      subtitle: 'Verified vendors, quality products, trusted service',
    },
  ];

  const stressPhrases = [
    {
      text: "Tired of fake products?",
      image: '/images/stress-1.jpg',
    },
    {
      text: "Can't find what you need?",
      image: '/images/stress-2.jpeg',
    },
    {
      text: "Worried about getting scammed?",
      image: '/images/stress-3.jpg',
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

  const trendingProducts = [
    { id: 1, name: 'Wireless Earbuds', price: 15000, originalPrice: 20000, discount: 25, image: '/images/products/wireless-earbuds.jpg', vendor: 'TechHub NG', rating: 4.8, reviews: 234 },
    { id: 2, name: 'Ankara Dress', price: 28000, image: '/images/products/fashion.jpg', vendor: "Sarah's Fashion", rating: 4.9, reviews: 189 },
    { id: 3, name: 'Smart Watch', price: 45000, originalPrice: 55000, discount: 18, image: '/images/products/smartwatch.jpg', vendor: 'Gadgets Plus', rating: 4.7, reviews: 456 },
    { id: 4, name: 'Leather Handbag', price: 32000, image: '/images/products/handbad.jpg', vendor: 'Luxury Bags', rating: 4.6, reviews: 321 },
    { id: 5, name: 'Running Shoes', price: 25000, image: '/images/products/shoes-black.jpg', vendor: 'SportFit NG', rating: 4.8, reviews: 278 },
    { id: 6, name: 'Bluetooth Speaker', price: 18000, originalPrice: 25000, discount: 28, image: '/images/products/speaker.jpg', vendor: 'Audio World', rating: 4.7, reviews: 445 },
    { id: 7, name: 'Laptop Backpack', price: 12000, image: '/images/products/backpack.jpg', vendor: 'Bags & More', rating: 4.5, reviews: 167 },
    { id: 8, name: 'Phone Case', price: 3500, image: '/images/products/phone.png', vendor: 'Accessories Hub', rating: 4.6, reviews: 892 },
    { id: 9, name: 'Desk Lamp', price: 8500, image: '/images/products/lamp.jpg', vendor: 'Home Essentials', rating: 4.7, reviews: 234 },
    { id: 10, name: 'Water Bottle', price: 4000, image: '/images/products/bottle.jpg', vendor: 'Fitness Gear', rating: 4.8, reviews: 567 },
  ];

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

  const benefits = [
    { icon: Shield, title: 'Verified Vendors', description: 'All vendors are thoroughly vetted' },
    { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable delivery' },
    { icon: HeadphonesIcon, title: '24/7 Support', description: 'Always here to help you' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo - Larger */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative flex items-center justify-center">
                <img src="/images/shopam-logo.png" alt="ShopAm Logo" width={100} height={100}/>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/explore" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
                Explore
              </Link>
              <Link href="/feed" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
                Categories
              </Link>
              <Link href="/vendors" className="text-white/90 hover:text-white font-medium transition-colors text-sm lg:text-base">
                Vendors
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/auth/user-signin"
                className="hidden sm:block text-white/90 hover:text-white font-medium transition-colors px-3 py-2 text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 sm:px-5 sm:py-2 lg:px-6 lg:py-2.5 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-lg text-xs sm:text-sm lg:text-base whitespace-nowrap leading-tight flex items-center justify-center min-h-[36px]"
              >
                Become a Vendor
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-white"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden border-t border-white/20 bg-gray-900/95 backdrop-blur-md"
              >
                <div className="py-3 space-y-1">
                  <Link href="/explore" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Explore
                  </Link>
                  <Link href="/feed" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Categories
                  </Link>
                  <Link href="/vendors" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Vendors
                  </Link>
                  <Link href="/auth/user-signin" className="block text-white/90 hover:text-white font-medium py-2.5 px-3 text-sm" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* HERO - Compact on mobile, expansive on desktop */}
      <section className="relative h-[50vh] sm:h-[70vh] lg:h-[90vh] min-h-[360px] sm:min-h-[500px] max-h-[900px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <link
            key={i}
            rel={i == 0 ? 'preload' : 'prefetch'}
            as='image'
            href={slide.image}

          />
        ))}
        
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
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%23f3f4f6" width="1920" height="1080"/%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/20 sm:bg-gradient-to-r sm:from-gray-900/90 sm:via-gray-900/70 sm:to-gray-900/50"></div>
            </div>

            <div className="relative h-full flex items-center sm:items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 sm:pt-16 lg:pt-20">
                <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-[1.65rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.2] sm:leading-tight mb-2 sm:mb-4 lg:mb-6"
                  >
                    {heroSlides[currentSlide].title}{' '}
                    <span className="text-[#FA3728]">{heroSlides[currentSlide].titleHighlight}</span>
                    {heroSlides[currentSlide].titleEnd && (
                      <> {heroSlides[currentSlide].titleEnd}</>
                    )}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-[13px] sm:text-lg md:text-xl lg:text-2xl text-white/85 mb-4 sm:mb-6 lg:mb-10 leading-relaxed max-w-sm sm:max-w-none"
                  >
                    {heroSlides[currentSlide].subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      href="/explore"
                      className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 lg:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold text-[13px] sm:text-base lg:text-lg transition-all shadow-xl hover:shadow-2xl active:scale-95"
                    >
                      Explore Products
                      <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    </Link>
                  </motion.div>

                  
                  
                </div>
              </div>
            </div>

            {/* Navigation arrows - hidden on small mobile, visible on larger screens */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/50 hidden sm:flex items-center justify-center text-white transition-all active:scale-90"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-black/25 backdrop-blur-sm hover:bg-black/50 hidden sm:flex items-center justify-center text-white transition-all active:scale-90"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* STATS */}
      <section className="bg-gray-900 py-6 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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
                <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#FA3728] mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-[11px] sm:text-sm lg:text-base text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STRESS CAROUSEL */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white" style={{ marginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStressPhrase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
            >
              {/* Image */}
              <div className="order-1">
                <div className="relative aspect-[4/3] rounded-xl sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl sm:shadow-xl lg:shadow-2xl">
                  <Image
                    src={stressPhrases[currentStressPhrase].image}
                    alt="Shopping experience"
                    fill
                    quality={75}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23f3f4f6" width="800" height="600"/%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="order-2 text-left">
                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 lg:mb-6 ${
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
                    className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-600"
                  >
                    Verified vendors. Real products. Trusted service.
                  </motion.p>
                )}

                <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-4 lg:mt-6">
                  {stressPhrases.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 sm:h-1 rounded-full transition-all ${
                        index === currentStressPhrase ? 'w-8 sm:w-8 bg-[#FA3728]' : 'w-4 sm:w-4 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-50" style={{ marginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10 lg:mb-12">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-orange-100 text-[#FA3728] rounded-full text-[11px] sm:text-sm font-semibold mb-2 sm:mb-4">
              Trending Now
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
              Popular Products
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what's trending on ShopAm
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg sm:rounded-lg lg:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative w-full aspect-square sm:aspect-[4/3] bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    quality={70}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3C/svg%3E';
                    }}
                  />
                  {product.discount && (
                    <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 bg-[#FA3728] text-white text-[9px] sm:text-[10px] font-bold rounded">
                      -{product.discount}%
                    </span>
                  )}
                  <button className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={12} className="sm:w-3.5 sm:h-3.5 text-gray-700" />
                  </button>
                  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-1.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[9px] sm:text-[10px] font-semibold flex items-center gap-0.5">
                    <Star size={9} className="sm:w-2.5 sm:h-2.5 text-amber-400 fill-amber-400" />
                    {product.rating}
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 lg:p-3">
                  <p className="text-[9px] sm:text-[10px] text-gray-500 mb-0.5 truncate">{product.vendor}</p>
                  <h3 className="font-semibold text-[11px] sm:text-xs lg:text-sm text-gray-900 mb-1 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm sm:text-sm lg:text-base font-bold text-[#FA3728]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-[9px] sm:text-[10px] text-gray-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-500">({product.reviews} reviews)</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 lg:py-4 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all shadow-md text-sm sm:text-base active:scale-95"
            >
              View All Products
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* INFINITE SCROLL */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden" style={{ marginTop: '80px' }}>
        <div className="mb-5 sm:mb-8 lg:mb-10 text-center">
          <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Shop by Category</h3>
        </div>

        <div className="relative mb-3 sm:mb-4 lg:mb-6 overflow-hidden">
          <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 animate-scroll-right">
            {[...productImages, ...productImages].map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
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
          <div className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 animate-scroll-left">
            {[...productImages2, ...productImages2].map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-gray-100"
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

      {/* CATEGORIES - Compact horizontal layout on mobile, grid on larger screens */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white" style={{ marginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10 lg:mb-12">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-pink-100 text-[#FA3728] rounded-full text-[11px] sm:text-sm font-semibold mb-2 sm:mb-4">
              Categories
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Explore services across multiple categories
            </p>
          </div>

          {/* Mobile: 4-column compact grid */}
          <div className="sm:hidden">
            <div className="grid grid-cols-4 gap-2.5">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04 }}
                    className={`${category.color} ${category.textColor} p-2 py-3 rounded-xl hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center`}
                  >
                    <div className={`${category.iconBg} w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform`}>
                      <Icon size={16} />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-[10px] leading-tight">{category.name}</h3>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${category.color} ${category.textColor} p-4 lg:p-6 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all cursor-pointer group`}
                >
                  <div className={`${category.iconBg} w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="lg:w-6 lg:h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-tight">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE - Always horizontal */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white" style={{ marginTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-4">
              Why Choose ShopAm?
            </h2>
            <p className="text-xs sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center p-3 sm:p-6 lg:p-8 rounded-xl sm:rounded-xl lg:rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#FA3728]/10 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 lg:mb-6">
                    <Icon className="text-[#FA3728] w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  </div>
                  <h3 className="text-[11px] sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-3 lg:mb-4 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-[9px] sm:text-sm lg:text-base text-gray-600 leading-relaxed hidden sm:block">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 lg:py-24 bg-gradient-to-br from-[#FA3728] to-[#E31B23] text-white" style={{ marginTop: '80px' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-sm sm:text-lg lg:text-2xl text-white/90 mb-6 sm:mb-8">
              Join thousands of happy customers shopping on ShopAm today
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/explore"
                className="px-6 sm:px-8 py-3 sm:py-3 lg:py-4 bg-white text-[#FA3728] rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl text-sm sm:text-base lg:text-lg active:scale-95"
              >
                Start Shopping
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 sm:px-8 py-3 sm:py-3 lg:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all text-sm sm:text-base lg:text-lg active:scale-95"
              >
                Become a Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <img src="/images/shopam-logo.png" alt="ShopAm Logo" width={100} height={100}/>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 max-w-sm">
                Your trusted marketplace for quality products and services from verified vendors across Nigeria.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-2 sm:space-y-2 text-sm sm:text-base">
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
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <div className="space-y-2 sm:space-y-2 text-sm sm:text-base">
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
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
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

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}