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
  MoreVertical,
  Star,
  ShoppingCart,
} from 'lucide-react';
import ProfileButton from '../components/ProfileButton';

export default function FeedPage() {
  const isComingSoon = true; // Feature flag

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

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
      caption: 'New collection alert! 🔥 African print dresses now available. Limited stock! These beautiful pieces celebrate African heritage with modern cuts and vibrant patterns. Perfect for any occasion from casual outings to special events. Get yours before they sell out!',
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
      caption: 'Premium wireless earbuds with noise cancellation. Get yours today! 🎧 Experience crystal clear sound quality with active noise cancellation technology. Long battery life, comfortable fit, and premium build quality make these a must-have.',
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

  const toggleExpand = (postId: number) => {
    setExpandedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
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
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative flex items-center justify-center">
                <img src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} />
              </div>
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
        {isComingSoon ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-[#FA3728]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark size={32} className="text-[#FA3728]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Feed Coming Soon!</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                We're building an exciting new way for you to discover posts, updates, and offers directly from your favorite vendors. Stay tuned!
              </p>
              <Link
                href="/explore"
                className="px-8 py-3 bg-[#FA3728] text-white rounded-full font-semibold transition-colors hover:bg-[#E31B23]"
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Feed Posts */}
            <div className="space-y-4">
              {postsState.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Post Header - REDUCED */}
                  <div className="p-3 flex items-center justify-between">
                    <Link href={`/vendors/${post.vendor.name}`} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{post.vendor.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-gray-900 text-sm">{post.vendor.name}</h3>
                          {post.vendor.verified && (
                            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-[10px]">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{post.timeAgo}</p>
                      </div>
                    </Link>
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Post Image - REDUCED */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5"></div>
                  </div>

                  {/* Post Actions - REDUCED */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1.5 group"
                        >
                          <Heart
                            size={20}
                            className={`transition-all ${post.isLiked
                                ? 'fill-[#FA3728] text-[#FA3728]'
                                : 'text-gray-700 group-hover:text-[#FA3728]'
                              }`}
                          />
                          <span className="font-semibold text-gray-900 text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 group">
                          <MessageCircle
                            size={20}
                            className="text-gray-700 group-hover:text-[#FA3728] transition-colors"
                          />
                          <span className="font-semibold text-gray-900 text-sm">{post.comments}</span>
                        </button>
                        <button className="group">
                          <Share2
                            size={20}
                            className="text-gray-700 group-hover:text-[#FA3728] transition-colors"
                          />
                        </button>
                      </div>
                      <button onClick={() => handleSave(post.id)}>
                        <Bookmark
                          size={20}
                          className={`transition-all ${post.isSaved
                              ? 'fill-[#FA3728] text-[#FA3728]'
                              : 'text-gray-700 hover:text-[#FA3728]'
                            }`}
                        />
                      </button>
                    </div>

                    {/* Caption with See More - IMPROVED */}
                    <div className="text-sm text-gray-900 mb-2">
                      <Link href={`/vendors/${post.vendor.name}`} className="font-semibold">
                        {post.vendor.name}
                      </Link>{' '}
                      {expandedPosts.includes(post.id) ? (
                        <>
                          {post.caption}{' '}
                          {post.caption.length > 100 && (
                            <button
                              onClick={() => toggleExpand(post.id)}
                              className="text-gray-500 font-medium hover:text-gray-700"
                            >
                              see less
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {post.caption.length > 100
                            ? `${post.caption.substring(0, 100)}... `
                            : post.caption}
                          {post.caption.length > 100 && (
                            <button
                              onClick={() => toggleExpand(post.id)}
                              className="text-gray-500 font-medium hover:text-gray-700"
                            >
                              more
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tags - REDUCED */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-[#FA3728] hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* View Comments */}
                    {post.comments > 0 && (
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        View all {post.comments} comments
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-6">
              <button className="px-8 py-2.5 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold text-sm transition-all">
                Load More Posts
              </button>
            </div>
          </div>
        )}
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