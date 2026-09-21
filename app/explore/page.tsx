'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { productsService, categoriesService, cartService, authService } from '@/lib/api';
import type { Product, Category } from '@/lib/api';
import ProfileButton from '../components/ProfileButton';
import { DUMMY_PRODUCTS } from './data';
import ProductCard from './components/ProductCard';
import FilterDropdown from './components/FilterDropdown';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // API State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
    loadCartCount();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    loadProducts();
  }, [selectedCategories, sortBy, searchQuery, page]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

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

  const loadCartCount = async () => {
    try {
      if (authService.isAuthenticated()) {
        const count = await cartService.getCartItemCount();
        setCartCount(count);
      }
    } catch (err) {
      console.error('Failed to load cart count:', err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
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
      window.location.href = '/auth/signin';
      return;
    }

    try {
      await cartService.addToCart({
        product_id: productId,
        quantity: 1,
      });
      loadCartCount();
      showToast('Added to cart!', 'success');
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      showToast('Failed to add to cart. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Top Navigation - IMPROVED */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[#FA3728] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
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
                  placeholder="Search Products"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  style={{ border: '1px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
                  className="w-full pl-12 pr-4 py-2.5 text-sm rounded-full outline-none transition-all focus:!border-[#FA3728] placeholder:text-gray-400/60"
                />
              </div>
            </div>
          </div>

          {/* Secondary Nav - Explore Tabs */}
          <div className="flex items-center gap-4 sm:gap-8 pb-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/explore"
              className="text-[#FA3728] border-b border-[#FA3728]/70 font-semibold pb-1 whitespace-nowrap text-sm sm:text-base"
            >
              Products
            </Link>
            <Link
              href="/feed"
              className="text-gray-600 hover:text-[#FA3728] font-medium pb-1 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Feed
            </Link>
            <Link
              href="/vendors"
              className="text-gray-600 hover:text-[#FA3728] font-medium pb-1 transition-colors whitespace-nowrap text-sm sm:text-base"
            >
              Vendors
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content - PADDING BALANCED */}
      <div className="pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${showFilters
                    ? 'border-[#FA3728] bg-[#FA3728]/5 text-[#FA3728] shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#FA3728]/30'
                  }`}
              >
                <SlidersHorizontal size={18} />
                <span className="font-bold text-sm">Filters</span>
              </button>

              <FilterDropdown
                showFilters={showFilters}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={() => setSelectedCategories([])}
                onClose={() => setShowFilters(false)}
              />
            </div>

            <p className="text-gray-600 text-sm hidden sm:block">
              {loading ? 'Loading...' : `${totalProducts} products`}
            </p>
          </div>

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-[#FA3728] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => loadProducts()}
                className="px-6 py-3 bg-[#FA3728] text-white rounded-lg hover:bg-[#E31B23]"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onAddToCart={addToCart} />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && !loading && products.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-white border border-gray-200 hover:border-[#FA3728] rounded-full font-semibold transition-all"
              >
                Load More Products
              </button>
            </div>
          )}

          {loading && products.length > 0 && (
            <div className="text-center mt-8">
              <Loader2 className="w-6 h-6 text-[#FA3728] animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
