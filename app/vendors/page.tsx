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
} from 'lucide-react';
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
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative flex items-center justify-center">
                <img src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 min-w-0 mx-2 sm:mx-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search vendors by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: '2px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm rounded-full outline-none transition-all focus:!border-[#FA3728]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
              Discover Shops
            </h1>
            <p className="text-lg text-gray-600">
              Browse shops and find what you need
            </p>
          </div>

          {/* Categories Filter */}
          <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-[#FA3728] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Shop product thumbnails — click to visit shop */}
                <Link href={`/vendors/${vendor.id}`} className="block">
                  <div className="grid grid-cols-3 h-24">
                    {vendor.shopProducts.map((p, i) => (
                      <div
                        key={i}
                        className={`${p.color} flex items-center justify-center`}
                      >
                        <span className="text-[10px] text-gray-500 font-medium text-center px-1 leading-tight">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </Link>

                {/* Vendor info */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center text-white text-base font-bold">
                        {vendor.name[0]}
                      </div>
                      {vendor.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <CheckCircle size={9} className="text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{vendor.name}</h3>
                      <p className="text-xs text-gray-500">{vendor.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{vendor.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{vendor.bio}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package size={11} />
                        {vendor.products} items
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {vendor.location.split(',')[0]}
                      </span>
                    </div>
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="text-xs font-semibold text-[#FA3728]"
                    >
                      Visit Shop →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all">
              Load More Shops
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}