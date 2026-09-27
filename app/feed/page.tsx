'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Home,
  Users,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { authService } from '@/lib/api';
import Navbar from '../components/home/Navbar';
import { vendorCards, trendingProducts } from '../components/home/data';

export default function FeedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    setIsAuthenticated(!!authService.getCurrentUser());
  }, []);

  // Sample posts from vendors
  const posts = [
    {
      id: 1,
      vendor: {
        name: "Sarah's Fashion",
        verified: true,
        followers: 2340,
      },
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=900',
      caption: 'New collection alert! 🔥 African print dresses now available. Limited stock! These beautiful pieces celebrate African heritage with modern cuts and vibrant patterns. Perfect for any occasion from casual outings to special events. Get yours before they sell out!',
      likes: 234,
      comments: 45,
      timeAgo: '2h',
      tags: ['fashion', 'african', 'dress'],
      isLiked: false,
      isSaved: false,
    },
    {
      id: 2,
      vendor: {
        name: 'TechHub Nigeria',
        verified: true,
        followers: 5670,
      },
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900',
      caption: 'Premium wireless earbuds with noise cancellation. Get yours today! 🎧 Experience crystal clear sound quality with active noise cancellation technology. Long battery life, comfortable fit, and premium build quality make these a must-have.',
      likes: 567,
      comments: 89,
      timeAgo: '5h',
      tags: ['tech', 'earbuds', 'gadgets'],
      isLiked: true,
      isSaved: false,
    },
    {
      id: 3,
      vendor: {
        name: 'Kiara Takeaway',
        verified: true,
        followers: 12400,
      },
      image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=900',
      caption: 'Grilled chicken perfection! 🍗 Order now and get 20% off your first order.',
      likes: 1240,
      comments: 156,
      timeAgo: '1d',
      tags: ['food', 'chicken', 'delivery'],
      isLiked: false,
      isSaved: true,
    },
    {
      id: 4,
      vendor: {
        name: 'Book Zone',
        verified: false,
        followers: 890,
      },
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=900',
      caption: 'New arrivals in fiction! Add these titles to your reading list 📚',
      likes: 89,
      comments: 23,
      timeAgo: '3d',
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

  const tabs = [
    { id: 'for-you', label: 'For you', icon: Home },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const trendingTags = [
    'fashion',
    'african',
    'dress',
    'tech',
    'earbuds',
    'food',
    'beauty',
    'books',
  ];

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Navbar actions />

      <main className="mx-auto max-w-7xl px-4 pb-40 pt-28 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8">
        {/* Accessible page heading — visibly redundant with the navbar */}
        <h1 className="sr-only">Feed</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[200px_minmax(0,1fr)_200px] xl:grid-cols-[240px_minmax(0,1fr)_240px]">
          {/* Left rail — feed filters + trending tags */}
          <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-2">
              <nav className="space-y-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={17} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                Trending tags
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-[#FA3728]/10 hover:text-[#FA3728]"
                  >
                    <Hash size={10} />
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Center — the feed timeline */}
          <div className="mx-auto w-full max-w-xl">
            <div className="space-y-5">
              {postsState.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.4 }}
                  className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                >
                  {/* Header — vendor • date */}
                  <div className="flex items-center justify-between px-3.5 py-3">
                    <Link href={`/vendors/${post.vendor.name}`} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FA3728] to-[#E31B23] ring-1 ring-slate-900/5">
                        <span className="text-sm font-bold text-white">{post.vendor.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-ink">{post.vendor.name}</h3>
                          {post.vendor.verified && (
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-trust text-[8px] font-bold text-white">
                              ✓
                            </span>
                          )}
                          <span className="text-xs text-slate-400">· {post.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {post.vendor.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </Link>
                    <button className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* Post image — large rounded square */}
                  <Link href={`/vendors/${post.vendor.name}`} className="block px-3.5">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={`${post.vendor.name} post`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Actions + caption */}
                  <div className="px-3.5 pb-3.5 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          aria-label="Like"
                          className="group flex items-center gap-1.5"
                        >
                          <Heart
                            size={20}
                            className={`transition-colors ${
                              post.isLiked
                                ? 'fill-[#FA3728] text-[#FA3728]'
                                : 'text-slate-700 group-hover:text-[#FA3728]'
                            }`}
                          />
                          <span className="text-sm font-semibold text-ink">{post.likes}</span>
                        </button>
                        <button className="group flex items-center gap-1.5" aria-label="Comments">
                          <MessageCircle
                            size={20}
                            className="text-slate-700 transition-colors group-hover:text-[#FA3728]"
                          />
                          <span className="text-sm font-semibold text-ink">{post.comments}</span>
                        </button>
                        <button className="group" aria-label="Share">
                          <Share2
                            size={20}
                            className="text-slate-700 transition-colors group-hover:text-[#FA3728]"
                          />
                        </button>
                      </div>
                      <button onClick={() => handleSave(post.id)} aria-label="Save">
                        <Bookmark
                          size={20}
                          className={`transition-colors ${
                            post.isSaved
                              ? 'fill-[#FA3728] text-[#FA3728]'
                              : 'text-slate-700 hover:text-[#FA3728]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Caption */}
                    <div className="mt-2.5 text-sm leading-relaxed text-slate-700">
                      <Link href={`/vendors/${post.vendor.name}`} className="font-bold text-ink">
                        {post.vendor.name}
                      </Link>{' '}
                      {expandedPosts.includes(post.id) ? (
                        <>
                          {post.caption}{' '}
                          {post.caption.length > 100 && (
                            <button
                              onClick={() => toggleExpand(post.id)}
                              className="font-medium text-slate-400 hover:text-slate-600"
                            >
                              see less
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {post.caption.length > 100
                            ? `${post.caption.substring(0, 100)}… `
                            : post.caption}
                          {post.caption.length > 100 && (
                            <button
                              onClick={() => toggleExpand(post.id)}
                              className="font-medium text-slate-400 hover:text-slate-600"
                            >
                              more
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/explore?q=${encodeURIComponent(tag)}`}
                          className="text-[11px] font-medium text-[#FA3728] hover:underline"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <Link
                        href={`/chats/${post.vendor.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-50 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#FA3728] hover:text-white"
                      >
                        <MessageCircle size={16} />
                        Order via Chat
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <button
                disabled
                className="cursor-not-allowed rounded-full border border-slate-200 bg-white px-8 py-2.5 text-sm font-semibold text-slate-400 opacity-70"
              >
                Load More Posts
              </button>
            </div>
          </div>

          {/* Right rail — suggested vendors + trending products */}
          <aside className="hidden self-start lg:sticky lg:top-28 lg:block">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Suggested vendors
                </h2>
                <Link
                  href="/vendors"
                  className="text-[11px] font-bold text-ink transition-colors hover:text-[#FA3728]"
                >
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {vendorCards.map((vendor) => (
                  <Link
                    key={vendor.name}
                    href={`/vendors/${vendor.name}`}
                    className="group flex items-center gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-900/5"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-ink transition-colors group-hover:text-[#FA3728]">
                        {vendor.name}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">{vendor.tag}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Trending products
                </h2>
                <Link
                  href="/explore"
                  className="text-[11px] font-bold text-ink transition-colors hover:text-[#FA3728]"
                >
                  See all
                </Link>
              </div>
              <div className="space-y-3">
                {trendingProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/explore?q=${encodeURIComponent(product.name)}`}
                    className="group flex items-center gap-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-900/5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink transition-colors group-hover:text-[#FA3728]">
                        {product.name}
                      </p>
                      <p className="truncate text-[11px] font-bold text-ink">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/chats"
              className="mt-4 flex items-center justify-between rounded-2xl bg-ink p-4 text-white transition-colors hover:bg-[#FA3728]"
            >
              <div>
                <p className="text-sm font-bold">Order via chat</p>
                <p className="text-[11px] text-white/70">Chat directly with vendors</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </main>

      {/* Sign Up prompt (only for signed-out visitors) */}
      {!isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3.5 backdrop-blur-xl sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink">Join ShopAm Today</p>
              <p className="text-xs text-slate-500">Like, comment, and shop</p>
            </div>
            <Link
              href="/auth/signup"
              className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
