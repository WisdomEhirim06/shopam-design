'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Users, Bookmark, Hash, ArrowRight } from 'lucide-react';
import { authService } from '@/lib/api';
import Navbar from '../components/home/Navbar';
import PostCard from '../components/feed/PostCard';
import { FEED_POSTS } from '../components/feed/data';
import { vendorCards, trendingProducts } from '../components/home/data';

export default function FeedPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    setIsAuthenticated(!!authService.getCurrentUser());
  }, []);

  const tabs = [
    { id: 'for-you', label: 'For you', icon: Home },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  const trendingTags = ['fashion', 'african', 'dress', 'tech', 'earbuds', 'food', 'beauty', 'books'];

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
              {FEED_POSTS.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>

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
                    href={`/vendors/${encodeURIComponent(vendor.name)}`}
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
