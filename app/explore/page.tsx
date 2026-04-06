'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { productsService, categoriesService, cartService, authService } from '@/lib/api';
import type { Product, Category } from '@/lib/api';
import ProfileButton from '../components/ProfileButton';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'products'>('home');

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
  }, [selectedCategory, sortBy, searchQuery, page]);

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

      if (selectedCategory) {
        filters.category = selectedCategory;
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
          filters.ordering = '-created_at'; // Default to newest
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
        const cart = await cartService.getCart();
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
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

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset to first page
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
        product: productId,
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
      {/* Fixed Top Navigation - IMPROVED RESPONSIVE */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            {/* Logo - Larger */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="relative flex items-center justify-center">
                <img src="/images/black-logo.png" alt="ShopAm Logo" width={100} height={100} />
              </div>
            </Link>

            {/* Search Bar - BETTER MOBILE */}
            <div className="flex-1 min-w-0 mx-2 sm:mx-4">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Products"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Debounce search - you can add lodash debounce here
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                  style={{ border: '2px solid #D1D5DB', backgroundColor: '#fff', color: '#111827' }}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm rounded-full outline-none transition-all focus:!border-[#FA3728]"
                />
              </div>
            </div>

            {/* Action Buttons - RESPONSIVE */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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

          {/* Secondary Nav - Explore Tabs - BETTER MOBILE */}
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

      {/* Main Content - MORE TOP SPACE */}
      <div className="pt-36 sm:pt-40 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#FA3728] transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal size={18} />
                <span className="font-medium">Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium outline-none hover:border-[#FA3728] transition-colors"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <p className="text-gray-600 text-sm hidden sm:block">
              {loading ? 'Loading...' : `${totalProducts} products`}
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all ${selectedCategory === category.id
                  ? 'bg-[#FA3728] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
                  }`}
              >
                <p className="font-semibold text-sm">{category.name}</p>
              </button>
            ))}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 mb-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block font-semibold mb-3">Price Range</label>
                  <div className="space-y-2">
                    {['All', 'Under ₦10,000', '₦10,000 - ₦30,000', '₦30,000 - ₦50,000', 'Over ₦50,000'].map(
                      (range) => (
                        <label key={range} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={priceRange === range}
                            onChange={() => setPriceRange(range)}
                            className="w-4 h-4 text-[#FA3728] focus:ring-[#FA3728]"
                          />
                          <span className="text-gray-700">{range}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block font-semibold mb-3">Rating</label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                          ))}
                          <span className="text-gray-700 ml-1">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block font-semibold mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                      />
                      <span className="text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-[#FA3728] rounded focus:ring-[#FA3728]"
                      />
                      <span className="text-gray-700">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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