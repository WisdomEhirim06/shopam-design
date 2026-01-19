'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Package,
  Users,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedVendors, setFollowedVendors] = useState<number[]>([]);

  // Categories
  const categories = [
    'All',
    'Fashion',
    'Electronics',
    'Food & Drinks',
    'Beauty',
    'Home & Office',
    'Sports',
    'Books',
    'Toys',
    'Tech',
  ];

  // Sample vendors
  const vendors = [
    {
      id: 1,
      name: "Sarah's Fashion",
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Authentic African fashion and accessories',
      category: 'Fashion',
      rating: 4.9,
      reviews: 234,
      followers: 2340,
      products: 45,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 1 hour',
    },
    {
      id: 2,
      name: 'TechHub Nigeria',
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Your trusted source for gadgets and electronics',
      category: 'Electronics',
      rating: 4.8,
      reviews: 567,
      followers: 5670,
      products: 128,
      location: 'Abuja, Nigeria',
      verified: true,
      responseTime: '< 2 hours',
    },
    {
      id: 3,
      name: 'Kiara Takeaway',
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Delicious meals delivered to your doorstep',
      category: 'Food & Drinks',
      rating: 5.0,
      reviews: 1240,
      followers: 12400,
      products: 67,
      location: 'Port Harcourt, Nigeria',
      verified: true,
      responseTime: '< 30 mins',
    },
    {
      id: 4,
      name: 'Book Zone',
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Wide selection of books across all genres',
      category: 'Books',
      rating: 4.7,
      reviews: 345,
      followers: 890,
      products: 234,
      location: 'Ibadan, Nigeria',
      verified: false,
      responseTime: '< 3 hours',
    },
    {
      id: 5,
      name: 'BeautyPlus NG',
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Premium beauty products and cosmetics',
      category: 'Beauty',
      rating: 4.8,
      reviews: 678,
      followers: 4560,
      products: 156,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 1 hour',
    },
    {
      id: 6,
      name: 'Home & Office NG',
      avatar: '/api/placeholder/200/200',
      cover: '/api/placeholder/600/200',
      bio: 'Furniture and office supplies',
      category: 'Home & Office',
      rating: 4.6,
      reviews: 234,
      followers: 1230,
      products: 89,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 2 hours',
    },
  ];

  const handleFollow = (vendorId: number) => {
    // Check if user is authenticated
    const isAuthenticated = false; // Replace with actual auth check

    if (!isAuthenticated) {
      // Redirect to signup
      window.location.href = '/auth/signup';
      return;
    }

    setFollowedVendors((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      (selectedCategory === 'All' || vendor.category === selectedCategory) &&
      (searchQuery === '' || vendor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                  placeholder="Search vendors by name or category..."
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
              className="text-gray-600 hover:text-[#FA3728] font-medium pb-1 transition-colors whitespace-nowrap"
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
              className="text-[#FA3728] border-b-2 border-[#FA3728] font-semibold pb-1 whitespace-nowrap"
            >
              Vendors
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Discover Vendors
            </h1>
            <p className="text-lg text-gray-600">
              Browse and follow your favorite shops and sellers
            </p>
          </div>

          {/* Categories Filter - FULLY RESPONSIVE */}
          <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-[#FA3728] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            <span className="font-semibold text-gray-900">{filteredVendors.length}</span> vendors
            found
          </p>

          {/* Vendors Grid - SIMPLIFIED */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                {/* Vendor Picture & Name */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                      {vendor.name[0]}
                    </div>
                    {vendor.verified && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle size={12} className="text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/vendors/${vendor.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 hover:text-[#FA3728] transition-colors truncate">
                        {vendor.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">{vendor.category}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {vendor.bio}
                </p>

                {/* Actions - Two Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(vendor.id)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      followedVendors.includes(vendor.id)
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#FA3728] text-white hover:bg-[#E31B23] shadow-sm'
                    }`}
                  >
                    {followedVendors.includes(vendor.id) ? 'Following' : 'Follow'}
                  </button>
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg font-semibold text-sm text-gray-700 hover:border-[#FA3728] hover:text-[#FA3728] transition-all text-center"
                  >
                    View Shop
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all">
              Load More Vendors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}