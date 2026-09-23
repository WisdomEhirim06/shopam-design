'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { productsService, cartService, authService } from '@/lib/api';
import type { Product } from '@/lib/api';
import Navbar from '../components/home/Navbar';
import SearchBar from '../components/home/SearchBar';
import CategoryPills from '../components/home/CategoryPills';
import { DUMMY_PRODUCTS } from './data';
import ProductCard from './components/ProductCard';
import FilterDropdown from './components/FilterDropdown';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // API State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Pick up deep-link params from the homepage: ?q= (search) and ?category= (category slug)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const category = params.get('category');
    if (q) setSearchQuery(q);
    if (category) setSelectedCategories([category]);
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, sortBy, searchQuery, page]);

  const loadProducts = async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (searchQuery) {
        response = await productsService.searchProducts(searchQuery, {
          page,
          page_size: 20,
        } as any);
      } else {
        const filters: any = {
          page,
          page_size: 20,
        };

        if (selectedCategories.length > 0) {
          filters.category = selectedCategories.join(',');
        }

        switch (sortBy) {
          case 'price-low':
            filters.ordering = 'price';
            break;
          case 'price-high':
            filters.ordering = '-price';
            break;
          case 'newest':
          default:
            filters.ordering = '-created_at';
        }

        response = await productsService.getProducts(filters);
      }

      const results = response.results.length > 0 ? response.results : (page === 1 ? DUMMY_PRODUCTS : []);

      if (page === 1) {
        setProducts(results);
      } else {
        setProducts((prev) => [...prev, ...results]);
      }

      setTotalProducts(response.count || DUMMY_PRODUCTS.length);
      setHasMore(!!response.next);
    } catch {
      if (page === 1) setProducts(DUMMY_PRODUCTS);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
    setPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(page + 1);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (productId: string) => {
    if (!authService.isAuthenticated()) {
      window.location.href = `/auth/signin?redirect=${encodeURIComponent('/explore')}`;
      return;
    }

    try {
      await cartService.addToCart({
        product_id: productId,
        quantity: 1,
      });
      window.dispatchEvent(new Event('shopam:cart-updated'));
      showToast('Added to cart!', 'success');
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      showToast('Failed to add to cart. Please try again.', 'error');
    }
  };

  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 top-20 z-[200] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg ${
              toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar actions />

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 sm:pt-40 lg:px-8 lg:pt-44">
        {/* Hero: heading + centered search */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-bricolage text-3xl font-black tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Discover Products
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 sm:text-base">
            Quality products and services from{' '}
            <strong className="font-semibold text-slate-800">verified vendors</strong> across Nigeria.
          </p>

          <div className="mt-5 sm:mt-7">
            <SearchBar
              key={searchQuery}
              initialValue={searchQuery}
              onSubmit={handleSearch}
              placeholder="Search products, brands, or vendors..."
            />
          </div>
        </div>

        {/* Category pills — same as the homepage */}
        <div className="mt-5 sm:mt-7">
          <CategoryPills
            selected={selectedCategories}
            onSelect={toggleCategory}
            spacing="compact"
          />
        </div>

        {/* Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  showFilters || hasActiveFilters
                    ? 'border-ink bg-ink text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] font-bold">
                    {selectedCategories.length}
                  </span>
                )}
              </button>

              <FilterDropdown
                showFilters={showFilters}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={() => {
                  setSelectedCategories([]);
                  setPage(1);
                }}
                onClose={() => setShowFilters(false)}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setPage(1);
                }}
                className="hidden text-xs font-semibold text-slate-400 transition-colors hover:text-[#FA3728] sm:block"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-medium text-slate-400 sm:block">
              {loading && products.length === 0 ? 'Loading…' : `${totalProducts} products`}
            </span>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-ink sm:text-xs"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
                  <div className="aspect-square bg-slate-100" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-100" />
                    <div className="h-2.5 w-full rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 text-slate-500">{error}</p>
              <button
                onClick={() => loadProducts()}
                className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg font-semibold text-ink">No products found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search or clear your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && !loading && products.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-ink transition-all hover:border-ink"
            >
              Load More Products
            </button>
          </div>
        )}

        {loading && products.length > 0 && (
          <div className="mt-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-ink" />
          </div>
        )}
      </main>
    </div>
  );
}
