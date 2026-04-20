'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Star,
  MapPin,
  Package,
  ShoppingCart,
  CheckCircle,
  MessageCircle,
  UserPlus,
  Heart,
} from 'lucide-react';
import { authService } from '@/lib/api';
import ProfileButton from '../components/ProfileButton';

interface ShopProduct {
  name: string;
  color: string;
}

interface Vendor {
  id: number;
  name: string;
  bio: string;
  category: string;
  rating: number;
  reviews: number;
  products: number;
  location: string;
  verified: boolean;
  responseTime: string;
  shopProducts: ShopProduct[];
}

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Food & Drinks',
    'Home & Living',
    'Beauty, Hair & Personal Care',
    'Accessories',
    'Women\'s Fashion',
    'Men\'s Fashion',
    'Baby & Kids',
  ];

  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Sarah's Fashion",
      bio: 'Authentic African fashion and accessories',
      category: 'Fashion',
      rating: 4.9,
      reviews: 234,
      products: 45,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 1 hour',
      shopProducts: [
        { name: 'Ankara Dress', color: 'bg-orange-100' },
        { name: 'Print Scarf', color: 'bg-yellow-100' },
        { name: 'Ankara Bag', color: 'bg-red-100' },
      ],
    },
    {
      id: 2,
      name: 'TechHub Nigeria',
      bio: 'Your trusted source for gadgets and electronics',
      category: 'Electronics',
      rating: 4.8,
      reviews: 567,
      products: 128,
      location: 'Abuja, Nigeria',
      verified: true,
      responseTime: '< 2 hours',
      shopProducts: [
        { name: 'Earbuds', color: 'bg-blue-100' },
        { name: 'Charger', color: 'bg-indigo-100' },
        { name: 'Phone Case', color: 'bg-sky-100' },
      ],
    },
    {
      id: 3,
      name: 'Kiara Takeaway',
      bio: 'Delicious meals delivered to your doorstep',
      category: 'Food & Drinks',
      rating: 5.0,
      reviews: 1240,
      products: 67,
      location: 'Port Harcourt, Nigeria',
      verified: true,
      responseTime: '< 30 mins',
      shopProducts: [
        { name: 'Jollof Rice', color: 'bg-red-100' },
        { name: 'Puff Puff', color: 'bg-amber-100' },
        { name: 'Chapman', color: 'bg-pink-100' },
      ],
    },
    {
      id: 4,
      name: 'Book Zone',
      bio: 'Wide selection of books across all genres',
      category: 'Books',
      rating: 4.7,
      reviews: 345,
      products: 234,
      location: 'Ibadan, Nigeria',
      verified: false,
      responseTime: '< 3 hours',
      shopProducts: [
        { name: 'Fiction', color: 'bg-green-100' },
        { name: 'Self Help', color: 'bg-teal-100' },
        { name: 'Academic', color: 'bg-emerald-100' },
      ],
    },
    {
      id: 5,
      name: 'BeautyPlus NG',
      bio: 'Premium beauty products and cosmetics',
      category: 'Beauty',
      rating: 4.8,
      reviews: 678,
      products: 156,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 1 hour',
      shopProducts: [
        { name: 'Lipstick', color: 'bg-rose-100' },
        { name: 'Foundation', color: 'bg-orange-100' },
        { name: 'Serum', color: 'bg-purple-100' },
      ],
    },
    {
      id: 6,
      name: 'Home & Office NG',
      bio: 'Furniture and office supplies for every need',
      category: 'Home & Office',
      rating: 4.6,
      reviews: 234,
      products: 89,
      location: 'Lagos, Nigeria',
      verified: true,
      responseTime: '< 2 hours',
      shopProducts: [
        { name: 'Desk Chair', color: 'bg-gray-100' },
        { name: 'Table Lamp', color: 'bg-yellow-100' },
        { name: 'Bookshelf', color: 'bg-stone-100' },
      ],
    },
  ];

  const filteredVendors = vendors.filter(
    (vendor) =>
      (selectedCategory === 'All' || vendor.category.includes(selectedCategory)) &&
      (searchQuery === '' || vendor.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFollow = (vendorId: number) => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/auth/user-signin';
      return;
    }
    // Implement follow logic here
    alert('Following vendor...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3">
            {/* Top Row: Logo & Action Icons */}
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="relative flex items-center justify-center">
                  <img src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} />
                </div>
              </Link>

              {/* Action Buttons - Gap reduced */}
              <div className="flex items-center gap-0 flex-shrink-0">
                <Link
                  href="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                >
                  <ShoppingCart size={20} className="text-gray-700" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#FA3728] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    3
                  </span>
                </Link>
                <Link
                  href="/chats"
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                >
                  <MessageCircle size={20} className="text-gray-700" />
                </Link>
                <ProfileButton />
              </div>
            </div>

            {/* Middle Row: Full Width Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search vendors by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
                  className="w-full pl-12 pr-4 py-2.5 text-sm rounded-full outline-none transition-all focus:!border-[#FA3728] placeholder:text-gray-400/60"
                />
              </div>
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
              className="text-[#FA3728] border-b border-[#FA3728]/70 font-semibold pb-1 whitespace-nowrap"
            >
              Vendors
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Discover Shops
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Browse shops and find what you need
            </p>
          </div>

          {/* Categories Filter */}
          <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 text-xs rounded-full font-semibold whitespace-nowrap transition-all ${selectedCategory === category
                      ? 'bg-[#FA3728] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-100 hover:border-[#FA3728]/30'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            <span className="font-semibold text-gray-900">{filteredVendors.length}</span> shops found
          </p>

          {/* Vendors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-8">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer p-3 rounded-2xl border border-gray-100/80 hover:border-[#FA3728]/20 transition-all hover:bg-white hover:shadow-xl shadow-sm"
              >
                <Link href={`/vendors/${vendor.id}`}>
                  {/* Brand Image Area (STRICT SQUARE) */}
                  <div className="relative aspect-square rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-transparent flex items-center justify-center">
                      <span className="text-5xl font-black text-[#FA3728]/10 group-hover:scale-110 transition-transform duration-500">
                        {vendor.name[0]}
                      </span>
                    </div>
                    {/* Heart/Follow Overlay */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFollow(vendor.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                    >
                      <Heart size={16} className="text-[#FA3728]" />
                    </button>
                  </div>

                  {/* Vendor Info Section */}
                  <div className="px-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate group-hover:text-[#FA3728] transition-colors">
                        {vendor.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-700">{vendor.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                      {vendor.category}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">
                      {vendor.bio}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white text-gray-900 border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all">
              Load More Shops
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}