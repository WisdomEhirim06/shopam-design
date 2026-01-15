'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Star,
  X,
  ChevronDown,
} from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'products'>('home');

  // Categories
  const categories = [
    { id: 'all', name: 'All', color: 'gray' },
    { id: 'fashion', name: 'Fashion', color: 'pink' },
    { id: 'gadgets', name: 'Gadgets', color: 'blue' },
    { id: 'beauty', name: 'Beauty', color: 'purple' },
    { id: 'food', name: 'Food & Drinks', color: 'orange' },
    { id: 'toys', name: 'Toys & Hobbies', color: 'cyan' },
    { id: 'tech', name: 'Tech & Skills', color: 'indigo' },
    { id: 'accessories', name: 'Accessories', color: 'yellow' },
    { id: 'books', name: 'Books', color: 'red' },
    { id: 'electronics', name: 'Electronics', color: 'slate' },
    { id: 'arts', name: 'Arts & Crafts', color: 'teal' },
    { id: 'sports', name: 'Sports', color: 'green' },
  ];

  // Sample products
  const products = [
    {
      id: 1,
      name: 'Premium Wireless Earbuds Pro',
      price: 15000,
      originalPrice: 20000,
      discount: 25,
      image: '/api/placeholder/300/300',
      vendor: 'TechHub Nigeria',
      rating: 4.8,
      reviews: 234,
      category: 'electronics',
      inStock: true,
    },
    {
      id: 2,
      name: 'African Print Ankara Dress',
      price: 28000,
      image: '/api/placeholder/300/300',
      vendor: "Sarah's Fashion",
      rating: 4.9,
      reviews: 189,
      category: 'fashion',
      inStock: true,
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      price: 45000,
      originalPrice: 55000,
      discount: 18,
      image: '/api/placeholder/300/300',
      vendor: 'Electronics Plus',
      rating: 4.7,
      reviews: 456,
      category: 'gadgets',
      inStock: true,
    },
    {
      id: 4,
      name: 'Luxury Leather Handbag',
      price: 32000,
      image: '/api/placeholder/300/300',
      vendor: 'Luxury Bags NG',
      rating: 4.6,
      reviews: 321,
      category: 'fashion',
      inStock: true,
    },
    {
      id: 5,
      name: 'Gaming Headset Pro RGB',
      price: 22000,
      image: '/api/placeholder/300/300',
      vendor: 'Gamer Store',
      rating: 4.8,
      reviews: 567,
      category: 'electronics',
      inStock: true,
    },
    {
      id: 6,
      name: 'Ergonomic Office Chair',
      price: 55000,
      image: '/api/placeholder/300/300',
      vendor: 'Home & Office NG',
      rating: 4.9,
      reviews: 234,
      category: 'accessories',
      inStock: false,
    },
    {
      id: 7,
      name: 'Bluetooth Speaker Portable',
      price: 18000,
      originalPrice: 25000,
      discount: 28,
      image: '/api/placeholder/300/300',
      vendor: 'Audio World',
      rating: 4.7,
      reviews: 445,
      category: 'electronics',
      inStock: true,
    },
    {
      id: 8,
      name: 'Running Shoes Sport Pro',
      price: 25000,
      image: '/api/placeholder/300/300',
      vendor: 'SportFit NG',
      rating: 4.8,
      reviews: 678,
      category: 'sports',
      inStock: true,
    },
  ];

  // Trending Vendors
  const trendingVendors = [
    {
      id: 1,
      name: 'FreshTrend Organics',
      avatar: '/api/placeholder/100/100',
      badge: '🔥',
      followers: '2.5k',
      products: 45,
    },
    {
      id: 2,
      name: 'Glam And African',
      avatar: '/api/placeholder/100/100',
      badge: '⭐',
      followers: '3.2k',
      products: 67,
    },
    {
      id: 3,
      name: 'StyleSquare.ng',
      avatar: '/api/placeholder/100/100',
      badge: '✨',
      followers: '1.8k',
      products: 34,
    },
  ];

  // Best Deals Today
  const bestDeals = [
    {
      id: 1,
      name: 'Nike Air Jordan',
      image: '/api/placeholder/300/300',
      originalPrice: 450000,
      discountPrice: 350000,
      rating: 4.8,
      reviews: 245,
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      image: '/api/placeholder/300/300',
      originalPrice: 1250000,
      discountPrice: 950000,
      rating: 4.9,
      reviews: 567,
    },
    {
      id: 3,
      name: 'Warm Winter Jacket',
      image: '/api/placeholder/300/300',
      originalPrice: 85000,
      discountPrice: 55000,
      rating: 4.7,
      reviews: 189,
    },
  ];

  // Vendors Near You
  const vendorsNearYou = [
    { id: 1, name: "Fresh N'Park Veggies", type: 'Food', badge: 'New' },
    { id: 2, name: 'Cynthia Clothing Store', type: 'Fashion', badge: null },
    { id: 3, name: 'Dash Tech House', type: 'Electronics', badge: 'Sale' },
    { id: 4, name: 'Swim N Essentials', type: 'Sports', badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">ShopAm</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products, vendors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#FA3728] focus:ring-2 focus:ring-[#FA3728]/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
              >
                <ShoppingCart size={24} className="text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FA3728] text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </Link>
              <Link
                href="/auth/signin"
                className="px-4 py-2 text-gray-700 hover:text-[#FA3728] transition-colors font-medium hidden md:block"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-full font-semibold transition-all hidden md:block"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Secondary Nav - Explore Tabs */}
          <div className="flex items-center gap-8 pb-3 overflow-x-auto">
            <Link
              href="/explore"
              className="text-[#FA3728] border-b-2 border-[#FA3728] font-semibold pb-1 whitespace-nowrap"
            >
              Products
            </Link>
            <Link
              href="/feed"
              className="text-gray-600 hover:text-[#FA3728] font-medium pb-1 transition-colors whitespace-nowrap"
            >
              Feed
            </Link>
            <Link
              href="/vendors"
              className="text-gray-600 hover:text-[#FA3728] font-medium pb-1 transition-colors whitespace-nowrap"
            >
              Vendors
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#FA3728] transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal size={18} />
                <span className="font-medium">Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium outline-none hover:border-[#FA3728] transition-colors"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <p className="text-gray-600 text-sm hidden sm:block">
              <span className="font-semibold text-gray-900">{products.length}</span> products found
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-xl text-center transition-all ${
                  selectedCategory === category.name
                    ? 'bg-[#FA3728] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
              >
                <p className="font-semibold text-sm">{category.name}</p>
              </button>
            ))}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block font-semibold mb-3">Price Range</label>
                  <div className="space-y-2">
                    {['All', 'Under ₦10,000', '₦10,000 - ₦30,000', '₦30,000 - ₦50,000', 'Over ₦50,000'].map(
                      (range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={priceRange === range}
                            onChange={() => setPriceRange(range)}
                            className="w-4 h-4 text-[#FA3728] focus:ring-[#FA3728]"
                          />
                          <span className="text-gray-700">{range}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block font-semibold mb-3">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                          <span className="text-gray-700 ml-1">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block font-semibold mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                      />
                      <span className="text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                      />
                      <span className="text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5"></div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.discount && (
                      <span className="px-2 py-1 bg-[#FA3728] text-white text-xs font-bold rounded">
                        -{product.discount}%
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-[#FA3728] hover:text-white transition-all">
                      <Heart size={18} />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-[#FA3728] hover:text-white transition-all">
                      <ShoppingCart size={18} />
                    </button>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-2 right-2">
                    <div className="px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
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

                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-lg md:text-xl font-bold text-[#FA3728]">
                      ₦{product.price.toLocaleString()}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">({product.reviews} reviews)</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all">
              Load More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}