'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Star,
  X,
  ChevronDown,
  Loader2,
  MessageCircle,
  Check,
} from 'lucide-react';
import { productsService, categoriesService, cartService, authService } from '@/lib/api';
import type { Product, Category } from '@/lib/api';
import ProfileButton from '../components/ProfileButton';

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
      const filters: any = {
        page,
        page_size: 20,
      };

      if (selectedCategories.length > 0) {
        filters.categories = selectedCategories.join(',');
      }

      if (searchQuery) {
        filters.search = searchQuery;
      }

      // Map sortBy to API ordering
      switch (sortBy) {
        case 'price-low':
          filters.ordering = 'price';
          break;
        case 'price-high':
          filters.ordering = '-price';
          break;
        case 'newest':
          filters.ordering = '-created_at';
          break;
        default:
          filters.ordering = '-created_at';
      }

      const response = await productsService.getProducts(filters);

      if (page === 1) {
        setProducts(response.results);
      } else {
        setProducts([...products, ...response.results]);
      }

      setTotalProducts(response.count);
      setHasMore(!!response.next);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
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
    setPage(1); // Reset to first page
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
    setPage(1); // Reset to first page
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(page + 1);
    }
  };

  const addToCart = async (productId: string) => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/auth/user-signin';
      return;
    }

    try {
      await cartService.addToCart({
        product_id: productId,
        quantity: 1,
      });

      // Update cart count
      loadCartCount();

      // Show success feedback (you can add a toast notification here)
      alert('Product added to cart!');
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  style={{ border: '2px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
                  className="w-full pl-12 pr-4 py-2.5 text-sm rounded-full outline-none transition-all focus:!border-[#FA3728]"
                />
              </div>
            </div>
          </div>

          {/* Secondary Nav - Explore Tabs */}
          <div className="flex items-center gap-4 sm:gap-8 pb-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/explore"
              className="text-[#FA3728] border-b-2 border-[#FA3728] font-semibold pb-1 whitespace-nowrap text-sm sm:text-base"
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${
                  showFilters 
                    ? 'border-[#FA3728] bg-[#FA3728]/5 text-[#FA3728] shadow-sm' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#FA3728]/30'
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="font-bold text-sm">Filters</span>
              </button>

              {/* FLOATING DROPDOWN FILTERS */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Categories</h3>
                      <button 
                        onClick={() => setSelectedCategories([])}
                        className="text-[10px] font-bold text-[#FA3728] hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                      {[
                        "Food and Drinks",
                        "Home and Living",
                        "Beauty, Hair and Personal Care",
                        "Accessories",
                        "Women's Fashion",
                        "Men's Fashion",
                        "Baby and Kids"
                      ].map((cat) => (
                        <label 
                          key={cat} 
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                            selectedCategories.includes(cat)
                              ? 'bg-[#FA3728]/5 text-[#FA3728]'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="text-xs font-semibold">{cat}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selectedCategories.includes(cat)
                              ? 'bg-[#FA3728] border-[#FA3728]'
                              : 'border-gray-300'
                          }`}>
                            {selectedCategories.includes(cat) && <Check size={10} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                        </label>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                      >
                        Show Results
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <Link href={`/products/${product.id}`}>
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-[#E31B23]/5 flex items-center justify-center">
                          <ShoppingCart size={40} className="text-gray-300" />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.stock === 0 && (
                          <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Rating Badge */}
                      {product.rating && (
                        <div className="absolute bottom-2 right-2">
                          <div className="px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            {product.rating.toFixed(1)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      <p className="text-xs text-gray-500 mb-1 truncate">
                        {product.vendor || 'ShopAm Vendor'}
                      </p>
                      <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FA3728] transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-lg md:text-xl font-bold text-[#FA3728]">
                          ₦{parseFloat(product.price).toLocaleString()}
                        </p>
                      </div>

                      {product.reviews_count !== undefined && (
                        <p className="text-xs text-gray-500">
                          ({product.reviews_count} reviews)
                        </p>
                      )}
                    </div>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                      className="w-full py-2 bg-[#FA3728] hover:bg-[#E31B23] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </motion.div>
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