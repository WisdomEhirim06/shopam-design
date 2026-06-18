'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, X, ImageIcon, Package, Loader2, Camera, Grid2x2 } from 'lucide-react';
import { productsService, categoriesService } from '../../../lib/api/products';
import type { ProductService, ItemType } from '../../../lib/api/types';
import {authService} from '@/lib/api';

interface TaxonomyOption {
  id: string;
  name: string;
  depth: number;
}

const CATEGORY_MAP: Record<string, string> = {
  'fashion': 'Fashion',
  'beauty_hair': 'Beauty, Hair & Personal Care',
  'home_living': 'Home & Living',
  'food_drinks': 'Food & Drinks',
  'baby_kids': 'Baby & Kids',
  'books_stationery': 'Books & Stationery',
  'health_wellness': 'Health & Wellness'
};
const getRelevantTaxonomy = (data: any[], categoryId: string) => {
  // 1. Get the exact taxonomy name (e.g., "Home & Living")
  const targetName = CATEGORY_MAP[categoryId];
  console.log('Mapping category ID to name:', categoryId, '→', targetName? targetName : 'Unknown');
  
  

  // 2. Find the top-level node in the API response that matches
  const relevantBranch = data.find(category => category.name === targetName);
  console.log('Found relevant taxonomy branch:', relevantBranch ? relevantBranch.name : 'None');

  // 3. Return it as an array (so flattenTaxonomy can process it consistently)
  return relevantBranch ? [relevantBranch] : data;
};

function flattenTaxonomy(items: any[], depth = 0): TaxonomyOption[] {
  
  const result: TaxonomyOption[] = [];
  for (const item of items) {
    result.push({ id: item.id, name: item.name, depth });
    if (Array.isArray(item.subcategories)) {
      result.push(...flattenTaxonomy(item.subcategories, depth + 1));
    }
  }
  return result;
}

/* ── Extended UI product type (includes local-only preview fields) ── */
interface UIProduct extends ProductService {
  localStock?: number;
  mainImagePreview?: string;
  subImagePreviews?: string[];
}

interface FormData {
  title: string;
  description: string;
  price: string;
  item_type: ItemType;
  tax_inclusive: boolean;
  stock: string;
  taxonomy_id: string;
  mainImage: File | null;
  subImages: File[];
  mainImagePreview: string | null;
  subImagePreviews: string[];
}

const INITIAL_FORM: FormData = {
  title: '',
  description: '',
  price: '',
  item_type: 'product',
  tax_inclusive: false,
  stock: '',
  taxonomy_id: '',
  mainImage: null,
  subImages: [],
  mainImagePreview: null,
  subImagePreviews: [],
};

export default function ProductsPage() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [ven_profile, setVen_profile] = useState<any>(null);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const subImagesRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
      // 1. Define an async function inside the effect
      const fetchUser = async () => {
        try {
          const user = await authService.getFullProfile();
          
          // Using optional chaining (?.) is a safe way to check if user exists
          if (user?.vendor_profile) {
            setVen_profile(user.vendor_profile);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
  
      // 2. Call the function immediately
      fetchUser();
    }, []);

  useEffect(() => { loadProducts(); loadCategories(); }, []);


  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      const relevantBranch = ven_profile?.business_category
      ? getRelevantTaxonomy(data, ven_profile.business_category) 
      : data;
    console.log(relevantBranch);
      setCategoryOptions(flattenTaxonomy(relevantBranch));
    } catch {
      // leave options empty
    } finally {
      setCategoriesLoaded(true);
    }
  };
 ;
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getMyProducts();
      setProducts(data);
    } catch {
      // keep empty list silently
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Image handlers ── */
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((f) => ({ ...f, mainImage: file, mainImagePreview: preview }));
  };

  const handleSubImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setFormData((f) => ({
      ...f,
      subImages: [...f.subImages, ...files].slice(0, 5),
      subImagePreviews: [...f.subImagePreviews, ...previews].slice(0, 5),
    }));
  };

  const removeSubImage = (index: number) => {
    setFormData((f) => ({
      ...f,
      subImages: f.subImages.filter((_, i) => i !== index),
      subImagePreviews: f.subImagePreviews.filter((_, i) => i !== index),
    }));
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const allImages = [
        ...(formData.mainImage ? [formData.mainImage] : []),
        ...formData.subImages,
      ];
      const newProduct = await productsService.createProduct({
        title: formData.title,
        description: formData.description || undefined,
        price: formData.price,
        item_type: formData.item_type,
        tax_inclusive: formData.tax_inclusive,
        stock: formData.stock ? Number(formData.stock) : undefined,
        taxonomy_id: formData.taxonomy_id || undefined,
        images: allImages.length ? allImages : undefined,
      });

      // Merge local preview data into the returned product
      const uiProduct: UIProduct = {
        ...newProduct,
        localStock: formData.stock ? Number(formData.stock) : undefined,
        mainImagePreview: formData.mainImagePreview ?? undefined,
        subImagePreviews: formData.subImagePreviews,
      };

      setProducts((prev) => [uiProduct, ...prev]);
      setFormData(INITIAL_FORM);
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const status = axiosErr?.response?.status;
      const data = axiosErr?.response?.data;

      if (status === 403) {
        // Backend returns 403 when the authenticated user lacks a VendorProfile
        // (i.e. the account is registered as a vendor but the profile record was
        // not created by the backend). This is a backend setup issue — the vendor
        // profile needs to exist before products can be created.
        const backendMsg = data?.detail || data?.message || data?.error;
        setSubmitError(
          backendMsg && backendMsg !== 'You do not have permission to perform this action.'
            ? backendMsg
            : 'Your vendor account is not fully set up yet. Please complete your vendor profile or contact support.'
        );
      } else {
        const msg = data?.detail || data?.message || data?.error
          || (typeof data === 'object' ? JSON.stringify(data) : null)
          || axiosErr?.message
          || 'Failed to create product';
        setSubmitError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: string) =>
    `₦${parseFloat(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none relative min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Products</h1>
          <p className="text-gray-500 text-sm md:text-base mt-0.5">
            {isLoading ? 'Loading…' : `${products.length} item${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#FA3728] hover:bg-[#E31B23] text-white px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add New
        </button>
      </motion.div>

      {/* Product List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 pb-8"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#FA3728]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No products yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap "Add New" to create your first listing</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} formatPrice={formatPrice} />
          ))
        )}
      </motion.div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Backdrops */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="hidden md:block absolute inset-0 bg-black/5 backdrop-blur-[2px] z-[60] rounded-2xl"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-0 z-[60] bg-white rounded-t-3xl md:rounded-b-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-h-[96dvh] md:max-h-[92dvh] flex flex-col"
            >
              {/* Drag handle */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 md:hidden flex-shrink-0" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-2 pb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable form body */}
              <form className="flex flex-col flex-1 min-h-0 overflow-hidden" onSubmit={handleSubmit}>
                <div className="overflow-y-auto flex-1 min-h-0 px-6 pb-28 md:pb-8">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-5">

                    {/* ── Images Section ── */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Product Images
                      </label>

                      <div className="flex gap-3">
                        {/* Main image */}
                        <button
                          type="button"
                          onClick={() => mainImageRef.current?.click()}
                          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FA3728] flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden flex-shrink-0 relative"
                        >
                          {formData.mainImagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={formData.mainImagePreview}
                              alt="Main"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <Camera size={20} className="text-gray-400" />
                              <span className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                                Main<br />Photo
                              </span>
                            </>
                          )}
                        </button>
                        <input
                          ref={mainImageRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleMainImage}
                        />

                        {/* Sub-images row */}
                        <div className="flex gap-2 flex-wrap">
                          {formData.subImagePreviews.map((src, idx) => (
                            <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`Sub ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeSubImage(idx)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
                              >
                                <X size={10} className="text-white" strokeWidth={3} />
                              </button>
                            </div>
                          ))}
                          {formData.subImagePreviews.length < 5 && (
                            <button
                              type="button"
                              onClick={() => subImagesRef.current?.click()}
                              className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FA3728] flex flex-col items-center justify-center gap-0.5 transition-colors flex-shrink-0"
                            >
                              <Grid2x2 size={16} className="text-gray-400" />
                              <span className="text-[9px] text-gray-400 font-medium">Add</span>
                            </button>
                          )}
                          <input
                            ref={subImagesRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleSubImages}
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        1 main photo + up to 5 gallery images
                      </p>
                    </div>

                    {/* ── Title ── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Product Name <span className="text-[#FA3728]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. African Print Dress"
                        required
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                      />
                    </div>

                    {/* ── Description ── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your product - material, size, use case"
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* ── Price + Type ── */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Price (₦) <span className="text-[#FA3728]">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          required
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Type <span className="text-[#FA3728]">*</span>
                        </label>
                        <select
                          value={formData.item_type}
                          onChange={(e) => setFormData({ ...formData, item_type: e.target.value as ItemType })}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all"
                        >
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                    </div>

                    {/* ── Stock + Category ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Qty</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="e.g. 50"
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 placeholder:text-[11px] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <select
                          value={formData.taxonomy_id}
                          onChange={(e) => setFormData({ ...formData, taxonomy_id: e.target.value })}
                          disabled={!categoriesLoaded}
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="">
                            {!categoriesLoaded ? 'Loading…' : categoryOptions.length ? 'Select category' : 'No categories'}
                          </option>
                          {categoryOptions.map((option) => {
                            // A parent node is any node that is at depth 0
                            // OR if you want to allow parents to be headers only, 
                            // you check if it has subcategories (or depth === 0)
                            const isParent = option.depth === 0;

                            return (
                              <option 
                                key={option.id} 
                                value={option.id} 
                                disabled={isParent} // 👈 This makes the parent unselectable
                                className={isParent ? "font-bold text-gray-400 bg-gray-100" : "pl-4"}
                              >
                                {/* Adds indentation based on depth to show hierarchy visually */}
                                {"--".repeat(option.depth)} {option.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* ── Tax inclusive ── */}
                    <div
                      onClick={() => setFormData({ ...formData, tax_inclusive: !formData.tax_inclusive })}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-colors hover:border-gray-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tax Inclusive</p>
                        <p className="text-xs text-gray-500 mt-0.5">Price already includes taxes</p>
                      </div>
                      <div
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${formData.tax_inclusive ? 'bg-[#FA3728]' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${formData.tax_inclusive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex-shrink-0 md:rounded-b-2xl"
                  style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.title || !formData.price}
                    className="w-full py-3.5 bg-[#FA3728] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#E31B23] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving…</>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({
  product,
  formatPrice,
}: {
  product: UIProduct;
  formatPrice: (p: string) => string;
}) {
  const primaryImage = product.mainImagePreview || product.images?.[0]?.image_url;
  const hasImage = !!primaryImage;
  const hasStock = product.localStock !== undefined;
  const categoryLabel = product.taxonomy_path || '';
  const hasDescription = !!product.description;

  // Sub-images: prefer local previews (freshly created), fall back to API images[1+]
  const subImages: string[] =
    product.subImagePreviews && product.subImagePreviews.length > 0
      ? product.subImagePreviews
      : (product.images?.slice(1).map((i) => i.image_url) ?? []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all relative overflow-hidden">
      {/* Status + menu */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>
      <button className="absolute bottom-3 right-3 z-10 text-gray-400 hover:text-gray-900 transition-colors">
        <MoreVertical size={20} />
      </button>

      <div className="flex gap-0">
        {/* Image area */}
        <div className="w-24 md:w-32 flex-shrink-0 bg-gray-50 flex items-center justify-center self-stretch rounded-l-2xl overflow-hidden">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-gray-300 p-4">
              <ImageIcon size={28} />
              <span className="text-[9px] text-gray-300 font-medium">No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-4 pr-10">
          {/* Category */}
          {categoryLabel && (
            <span className="text-[10px] font-semibold text-[#FA3728] bg-red-50 px-2 py-0.5 rounded-full mb-1.5 inline-block">
              {categoryLabel}
            </span>
          )}

          <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight mb-0.5 truncate pr-8">
            {product.title}
          </h3>

          {hasDescription && (
            <p className="text-xs text-gray-400 line-clamp-1 mb-1.5">
              {product.description}
            </p>
          )}

          <p className="font-bold text-gray-900 text-sm md:text-base mb-2">
            {formatPrice(product.price)}
            {product.tax_inclusive && (
              <span className="text-[10px] font-normal text-gray-400 ml-1">incl. tax</span>
            )}
          </p>

          <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 font-medium flex-wrap">
            {hasStock && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {product.localStock} in stock
              </span>
            )}
            {parseFloat(product.average_rating) > 0 && (
              <span>★ {parseFloat(product.average_rating).toFixed(1)}</span>
            )}
            {parseInt(product.review_count) > 0 && (
              <span>{product.review_count} reviews</span>
            )}
            <span className="text-gray-400 capitalize">{product.item_type}</span>
          </div>

          {/* Sub-image thumbnails */}
          {subImages.length > 0 && (
            <div className="flex gap-1.5 mt-2.5">
              {subImages.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`img ${i + 1}`}
                  className="w-8 h-8 rounded-md object-cover border border-gray-100"
                />
              ))}
              {subImages.length > 4 && (
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                  +{subImages.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
