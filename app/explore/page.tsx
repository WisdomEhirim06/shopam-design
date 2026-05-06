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

/* ── Dummy products shown while real vendor listings are pending ── */
const DUMMY_PRODUCTS: Product[] = [
  { id: 'd1', owner: 'vendor1', owner_name: 'Adaeze Couture', title: 'African Print Wrap Dress', description: 'Vibrant Ankara wrap dress, available in M/L/XL', price: '28000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.8', review_count: '124' },
  { id: 'd2', owner: 'vendor2', owner_name: "Mama Nkechi's Kitchen", title: 'Jollof Rice Family Platter', description: 'Party-size smoky Jollof for 5–6 people', price: '8500', tax_inclusive: false, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '5.0', review_count: '87' },
  { id: 'd3', owner: 'vendor3', owner_name: 'Lagos Craft House', title: 'Handwoven Rattan Basket Set', description: 'Set of 3 handcrafted storage baskets', price: '12500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.6', review_count: '52' },
  { id: 'd4', owner: 'vendor4', owner_name: 'Tunde Skincare', title: 'Shea Butter Body Cream 250ml', description: 'Cold-pressed natural shea butter, unscented', price: '5500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.9', review_count: '210' },
  { id: 'd5', owner: 'vendor5', owner_name: 'Chioma Tech Hub', title: 'Phone Screen Repair (Any Model)', description: 'Same-day screen replacement service, warranty included', price: '15000', tax_inclusive: true, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.7', review_count: '63' },
  { id: 'd6', owner: 'vendor6', owner_name: 'Eko Fabrics', title: 'Aso-Oke Head Tie Set', description: 'Premium woven aso-oke, 3-piece gele set', price: '35000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.5', review_count: '39' },
  { id: 'd7', owner: 'vendor1', owner_name: 'Adaeze Couture', title: 'Beaded Ankara Clutch Bag', description: 'Hand-beaded evening clutch, various colours', price: '9500', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.4', review_count: '28' },
  { id: 'd8', owner: 'vendor7', owner_name: 'Naija Fresh Farm', title: 'Organic Ofada Rice 5kg', description: 'Stone-free, sun-dried local Ofada variety', price: '7200', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.8', review_count: '156' },
  { id: 'd9', owner: 'vendor8', owner_name: 'Kemi Beauty Bar', title: 'Lace Front Wig 20" Natural', description: 'Brazilian hair lace front, natural black', price: '85000', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.9', review_count: '72' },
  { id: 'd10', owner: 'vendor9', owner_name: 'IbadanWood Works', title: 'Custom Wooden Photo Frame', description: 'Personalized engraved hardwood frame, 8×10"', price: '6800', tax_inclusive: false, item_type: 'product', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.7', review_count: '44' },
  { id: 'd11', owner: 'vendor2', owner_name: "Mama Nkechi's Kitchen", title: 'Egusi Soup + Fufu Combo', description: 'Rich egusi soup with goat meat, served with fufu', price: '4500', tax_inclusive: false, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '5.0', review_count: '198' },
  { id: 'd12', owner: 'vendor5', owner_name: 'Chioma Tech Hub', title: 'Laptop Battery Replacement', description: 'Genuine replacement batteries, all laptop brands', price: '25000', tax_inclusive: true, item_type: 'service', addons: [], images: [], taxonomy_path: '', created_at: '', updated_at: '', average_rating: '4.6', review_count: '31' },
];
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
        // Pass category slugs (comma-joined) to the API
        filters.category = selectedCategories.join(',');
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

      // Use API results when available, fall back to dummy data on first page
      const results = response.results.length > 0 ? response.results : (page === 1 ? DUMMY_PRODUCTS : []);

      if (page === 1) {
        setProducts(results);
      } else {
        setProducts((prev) => [...prev, ...results]);
      }

      setTotalProducts(response.count || DUMMY_PRODUCTS.length);
      setHasMore(!!response.next);
    } catch {
      // On any network error, show dummy products
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
                        { label: "Food and Drinks",               slug: 'food_drinks' },
                        { label: "Home and Living",               slug: 'home_living' },
                        { label: "Beauty, Hair and Personal Care", slug: 'beauty_hair_personal_care' },
                        { label: "Accessories",                   slug: 'accessories' },
                        { label: "Women's Fashion",               slug: 'womens_fashion' },
                        { label: "Men's Fashion",                 slug: 'mens_fashion' },
                        { label: "Baby and Kids",                 slug: 'baby_kids' },
                      ].map(({ label, slug }) => (
                        <label
                                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${selectedCategories.includes(slug)
                              ? 'bg-[#FA3728]/5 text-[#FA3728]'
                              : 'hover:bg-gray-50 text-gray-600'
                            }`}
                         >
                          <span className="text-xs font-semibold">{label}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(slug)
                              ? 'bg-[#FA3728] border-[#FA3728]'
                              : 'border-gray-300'
                            }`}>
                            {selectedCategories.includes(slug) && <Check size={10} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedCategories.includes(slug)}
                            onChange={() => toggleCategory(slug)}
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer p-2.5 sm:p-3 rounded-2xl border border-gray-100/80 hover:border-[#FA3728]/20 transition-all hover:bg-white hover:shadow-xl shadow-sm bg-white"
                >
                  <Link href={`/products/${product.id}`}>
                    {/* Product Image Area (STRICT SQUARE) */}
                    <div className="relative aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm border border-gray-100 overflow-hidden mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FA3728]/5 to-transparent flex items-center justify-center text-gray-300">
                        <ShoppingCart size={32} className="opacity-40" />
                      </div>

                      {/* Rating Badge */}
                      {parseFloat(product.average_rating) > 0 && (
                        <div className="absolute bottom-2 left-2">
                          <div className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-gray-50">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            {parseFloat(product.average_rating).toFixed(1)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info Section */}
                    <div className="px-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate group-hover:text-[#FA3728] transition-colors">
                          {product.title}
                        </h3>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2 truncate">
                        {product.owner_name || 'ShopAm Vendor'}
                      </p>

                      <div className="flex items-center justify-between gap-1">
                        <p className="text-sm sm:text-base font-black text-[#FA3728]">
                          ₦{parseFloat(product.price).toLocaleString()}
                        </p>

                        {/* Small Add to Cart Icon Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          className="p-1.5 bg-[#FA3728]/10 hover:bg-[#FA3728] text-[#FA3728] hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
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