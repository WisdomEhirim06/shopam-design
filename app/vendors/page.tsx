'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Loader2, Check } from 'lucide-react';
import { vendorsService } from '@/lib/api';
import type { Vendor } from '@/lib/api';
import Navbar from '../components/home/Navbar';
import SearchBar from '../components/home/SearchBar';
import CategoryPills from '../components/home/CategoryPills';
import VendorCard from './components/VendorCard';
import { FALLBACK_VENDORS, VENDOR_SORTS, matchesCategory, type VendorSort } from './data';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<VendorSort>('top-rated');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    vendorsService
      .getVendors({ page_size: 50 })
      .then((res) => {
        if (active) setVendors(res.results.length > 0 ? res.results : FALLBACK_VENDORS);
      })
      .catch(() => {
        if (active) setVendors(FALLBACK_VENDORS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = vendors.filter((vendor) => {
      const haystack = `${vendor.name} ${vendor.category} ${vendor.location}`.toLowerCase();
      const matchQuery = !q || haystack.includes(q);
      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((slug) => matchesCategory(vendor, slug));
      const matchVerified = !verifiedOnly || vendor.verified;
      return matchQuery && matchCategory && matchVerified;
    });

    switch (sort) {
      case 'most-reviewed':
        return [...list].sort((a, b) => b.reviews - a.reviews);
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'top-rated':
      default:
        return [...list].sort((a, b) => b.rating - a.rating);
    }
  }, [vendors, query, selectedCategories, sort, verifiedOnly]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const hasActiveFilters =
    query.trim() !== '' || selectedCategories.length > 0 || verifiedOnly;

  const clearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSort('top-rated');
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <Navbar actions />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-bricolage text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Discover Shops
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base">
            Find and follow{' '}
            <strong className="font-semibold text-ink">verified vendors</strong> from across Nigeria.
          </p>
          <div className="mt-6">
            <SearchBar
              key={query}
              initialValue={query}
              onSubmit={setQuery}
              placeholder="Search shops by name, category, or city..."
            />
          </div>
        </div>

        {/* Category pills — same as the homepage */}
        <div className="mt-6">
          <CategoryPills
            selected={selectedCategories}
            onSelect={toggleCategory}
            spacing="compact"
          />
        </div>

        {/* Mobile sort */}
        <div className="mt-5 flex justify-end lg:hidden">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as VendorSort)}
            className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-ink"
          >
            {VENDOR_SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid + filter rail */}
        <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-8">
          <div>
            {hasActiveFilters && (
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-slate-500 transition-colors hover:text-[#FA3728]"
                >
                  Clear all
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200/70"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-24 text-center">
                <p className="text-lg font-semibold text-ink">No shops found</p>
                <p className="mt-1 text-sm text-slate-600">
                  Try a different search or clear your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((vendor, index) => (
                  <VendorCard key={vendor.id || vendor.name} vendor={vendor} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop filter rail */}
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                  <SlidersHorizontal size={14} />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[11px] font-bold uppercase tracking-wide text-[#FA3728] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="mb-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Sort by
                </h3>
                <div className="space-y-1">
                  {VENDOR_SORTS.map((option) => {
                    const active = sort === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSort(option.id)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                          active ? 'bg-slate-900/[0.04] text-ink' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                        {active && <Check size={13} className="shrink-0 text-ink" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                <span className="text-sm font-semibold text-slate-600">Verified only</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                    verifiedOnly ? 'border-ink bg-ink' : 'border-slate-300'
                  }`}
                >
                  {verifiedOnly && <Check size={12} className="text-white" strokeWidth={3} />}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={verifiedOnly}
                  onChange={() => setVerifiedOnly((v) => !v)}
                />
              </label>
            </div>
          </aside>
        </div>

        {/* Loading overlay for subsequent loads */}
        <AnimatePresence>
          {loading && vendors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 text-center"
            >
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
