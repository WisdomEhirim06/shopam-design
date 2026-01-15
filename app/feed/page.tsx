'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ShoppingCart,
  MoreVertical,
  Star,
} from 'lucide-react';

export default function FeedPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample posts from vendors
  const posts = [
    {
      id: 1,
      vendor: {
        name: "Sarah's Fashion",
        avatar: '/api/placeholder/100/100',
        verified: true,
        followers: 2340,
      },
      image: '/api/placeholder/600/600',
      caption: 'New collection alert! 🔥 African print dresses now available. Limited stock!',
      likes: 234,
      comments: 45,
      timeAgo: '2 hours ago',
      tags: ['fashion', 'african', 'dress'],
      isLiked: false,
      isSaved: false,
    },
    {
      id: 2,
      vendor: {
        name: 'TechHub Nigeria',
        avatar: '/api/placeholder/100/100',
        verified: true,
        followers: 5670,
      },
      image: '/api/placeholder/600/600',
      caption: 'Premium wireless earbuds with noise cancellation. Get yours today! 🎧',
      likes: 567,
      comments: 89,
      timeAgo: '5 hours ago',
      tags: ['tech', 'earbuds', 'gadgets'],
      isLiked: true,
      isSaved: false,
    },
    {
      id: 3,
      vendor: {
        name: 'Kiara Takeaway',
        avatar: '/api/placeholder/100/100',
        verified: true,
        followers: 12400,
      },
      image: '/api/placeholder/600/600',
      caption: 'Grilled chicken perfection! 🍗 Order now and get 20% off your first order.',
      likes: 1240,
      comments: 156,
      timeAgo: '1 day ago',
      tags: ['food', 'chicken', 'delivery'],
      isLiked: false,
      isSaved: true,
    },
    {
      id: 4,
      vendor: {
        name: 'Book Zone',
        avatar: '/api/placeholder/100/100',
        verified: false,
        followers: 890,
      },
      image: '/api/placeholder/600/600',
      caption: 'New arrivals in fiction! Add these titles to your reading list 📚',
      likes: 89,
      comments: 23,
      timeAgo: '3 days ago',
      tags: ['books', 'reading', 'fiction'],
      isLiked: false,
      isSaved: false,
    },
  ];

  const [postsState, setPostsState] = useState(posts);

  const handleLike = (postId: number) => {
    setPostsState(
      postsState.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId: number) => {
    setPostsState(
      postsState.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post))
    );
  };

  const handleInteraction = () => {
    // Redirect to signup if not authenticated
    window.location.href = '/auth/signup';
  };

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
                  placeholder="Search posts, vendors..."
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
              className="text-[#FA3728] border-b-2 border-[#FA3728] font-semibold pb-1 whitespace-nowrap"
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feed Posts */}
          <div className="space-y-6">
            {postsState.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <Link href={`/vendors/${post.vendor.name}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                      <span className="text-white font-bold">{post.vendor.name[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{post.vendor.name}</h3>
                        {post.vendor.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                  </Link>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5"></div>
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-2 group"
                      >
                        <Heart
                          size={24}
                          className={`transition-all ${
                            post.isLiked
                              ? 'fill-[#FA3728] text-[#FA3728]'
                              : 'text-gray-700 group-hover:text-[#FA3728]'
                          }`}
                        />
                        <span className="font-semibold text-gray-900">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 group">
                        <MessageCircle
                          size={24}
                          className="text-gray-700 group-hover:text-[#FA3728] transition-colors"
                        />
                        <span className="font-semibold text-gray-900">{post.comments}</span>
                      </button>
                      <button className="group">
                        <Share2
                          size={24}
                          className="text-gray-700 group-hover:text-[#FA3728] transition-colors"
                        />
                      </button>
                    </div>
                    <button onClick={() => handleSave(post.id)}>
                      <Bookmark
                        size={24}
                        className={`transition-all ${
                          post.isSaved
                            ? 'fill-[#FA3728] text-[#FA3728]'
                            : 'text-gray-700 hover:text-[#FA3728]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-gray-900 mb-2">
                    <Link href={`/vendors/${post.vendor.name}`} className="font-semibold">
                      {post.vendor.name}
                    </Link>{' '}
                    {post.caption}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm text-[#FA3728] hover:underline cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* View Comments */}
                  {post.comments > 0 && (
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      View all {post.comments} comments
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all">
              Load More Posts
            </button>
          </div>
        </div>
      </div>

      {/* Sign Up Prompt (if not authenticated) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Join ShopAm Today</p>
            <p className="text-sm text-gray-600">Like, comment, and shop</p>
          </div>
          <Link
            href="/auth/signup"
            className="px-6 py-2 bg-[#FA3728] text-white rounded-full font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}