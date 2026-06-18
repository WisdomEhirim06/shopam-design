'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, X, ImageIcon, Package, Loader2, Camera, Grid2x2, Puzzle } from 'lucide-react';
import { productsService, categoriesService } from '../../../lib/api/products';
import type { ProductService, ItemType } from '../../../lib/api/types';
import { authService } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Taxonomy helpers
// ─────────────────────────────────────────────────────────────────────────────

interface TaxonomyOption {
  id: string;
  name: string;
  depth: number;
}

/**
 * Maps a vendor's business_category slug (e.g. "fashion") to the exact
 * top-level Taxonomy node name the backend uses (e.g. "Fashion").
 */
const CATEGORY_MAP: Record<string, string> = {
  fashion: 'Fashion',
  beauty_hair: 'Beauty, Hair & Personal Care',
  home_living: 'Home & Living',
  food_drinks: 'Food & Drinks',
  baby_kids: 'Baby & Kids',
  books_stationery: 'Books & Stationery',
  health_wellness: 'Health & Wellness',
};

/** Returns only the taxonomy branch that matches the vendor's category. */
const getRelevantTaxonomy = (data: any[], categoryId: string) => {
  const targetName = CATEGORY_MAP[categoryId];
  if (!targetName) return data;
  const branch = data.find((c) => c.name === targetName);
  return branch ? [branch] : data;
};

/** Flattens a nested taxonomy tree into a depth-annotated list for <select>. */
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extends the API ProductService type with local-only preview fields.
 * NOTE: There is no "stock" field on the backend model — do not add one here.
 */
interface UIProduct extends ProductService {
  /** Blob URLs for images uploaded in this session (before reload). */
  imagePreviews?: string[];
}

/** All fields collected by the Add / Edit form. */
interface FormData {
  title: string;
  description: string;
  price: string;
  item_type: ItemType;
  tax_inclusive: boolean;
  taxonomy_id: string;
  /** All images to upload. Backend accepts up to 10 via `uploaded_images`. */
  images: File[];
  imagePreviews: string[];
}

const INITIAL_FORM: FormData = {
  title: '',
  description: '',
  price: '',
  item_type: 'product',
  tax_inclusive: false,
  taxonomy_id: '',
  images: [],
  imagePreviews: [],
};

/** Maximum images the backend serializer allows (projected_count > 10 → 400). */
const MAX_IMAGES = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [venProfile, setVenProfile] = useState<any>(null);
  const router = useRouter();

  // Hidden file inputs
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  // ── 1. Load vendor profile ──────────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getVendorProfile();
        if (user) {
          setVenProfile(user);
        } else {
          router.push('/explore');
        }
      } catch (error) {
        console.error('Failed to fetch vendor profile:', error);
      }
    };
    fetchUser();
  }, [router]);

  // ── 2. Load products (independent of vendor profile) ───────────────────
  useEffect(() => {
    loadProducts();
  }, []);

  // ── 3. Load taxonomy categories once vendor profile is available ────────
  useEffect(() => {
    if (venProfile) loadCategories();
  }, [venProfile]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getCategories();
      const branch = getRelevantTaxonomy(data, venProfile.business_category);
      setCategoryOptions(flattenTaxonomy(branch));
    } catch {
      // leave options empty silently
    } finally {
      setCategoriesLoaded(true);
    }
  };

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

  // ── Image handlers ───────────────────────────────────────────────────────

  /** Replaces the first (main) image slot. */
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setFormData((f) => {
      // Replace index 0, keep the rest
      const newImages = [file, ...f.images.slice(1)];
      const newPreviews = [preview, ...f.imagePreviews.slice(1)];
      return { ...f, images: newImages, imagePreviews: newPreviews };
    });
  };

  /** Appends additional gallery images (slot 1–9, total cap = MAX_IMAGES). */
  const handleGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setFormData((f) => {
      const remaining = MAX_IMAGES - f.images.length;
      const toAdd = files.slice(0, remaining);
      const previews = toAdd.map((file) => URL.createObjectURL(file));
      return {
        ...f,
        images: [...f.images, ...toAdd],
        imagePreviews: [...f.imagePreviews, ...previews],
      };
    });
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  /** Removes an image by index (0 = main image). */
  const removeImage = (index: number) => {
    setFormData((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
      imagePreviews: f.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      /**
       * The backend serializer field is `uploaded_images` (a ListField of
       * ImageField). We pass all images in a single array — no distinction
       * between "main" and "gallery" on the server side.
       */
      const newProduct = await productsService.createProduct({
        title: formData.title,
        description: formData.description || undefined,
        price: formData.price,
        item_type: formData.item_type,
        tax_inclusive: formData.tax_inclusive,
        taxonomy_id: formData.taxonomy_id || undefined,
        images: formData.images.length ? formData.images : undefined,
      });

      // Attach local preview URLs so the card looks right before a page reload
      const uiProduct: UIProduct = {
        ...newProduct,
        imagePreviews: formData.imagePreviews,
      };

      setProducts((prev) => [uiProduct, ...prev]);
      setFormData(INITIAL_FORM);
      setIsAddModalOpen(false);
    } catch (err: unknown) {
      const axiosErr = err as any;
      const status = axiosErr?.response?.status;
      const data = axiosErr?.response?.data;
      console.error('Failed to create product:', axiosErr);

      if (status === 403) {
        const backendMsg = data?.detail || data?.message || data?.error;
        setSubmitError(
          backendMsg && backendMsg !== 'You do not have permission to perform this action.'
            ? backendMsg
            : 'Your vendor account is not fully set up yet. Please complete your vendor profile or contact support.'
        );
      } else {
        const msg =
          data?.detail ||
          data?.message ||
          data?.error ||
          (typeof data === 'object' ? JSON.stringify(data) : null) ||
          axiosErr?.message ||
          'Failed to create listing';
        setSubmitError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: string) =>
    `₦${parseFloat(price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

  const modalTitle =
    formData.item_type === 'service' ? 'Add New Service' : 'Add New Product';

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none relative min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            Products &amp; Services
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-0.5">
            {isLoading ? 'Loading…' : `${products.length} listing${products.length !== 1 ? 's' : ''}`}
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

      {/* Product / Service List */}
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
            <p className="text-gray-500 font-medium">No listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap "Add New" to create your first product or service</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              formatPrice={formatPrice}
              onEdit={(p) => router.push(`/dashboard/products/${p.id}/edit`)}
              onDelete={async (id: string) => {
                // Optimistic removal — revert on failure
                const snapshot = products;
                setProducts((prev) => prev.filter((x) => x.id !== id));
                try {
                  await productsService.deleteProduct(id);
                } catch (err) {
                  setProducts(snapshot);
                  throw err;
                }
              }}
            />
          ))
        )}
      </motion.div>

      {/* ── Add Listing Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            {/* Desktop backdrop */}
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
              className="fixed bottom-0 left-0 right-0 md:absolute md:bottom-0 z-[70] bg-white rounded-t-3xl md:rounded-b-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] max-h-[96dvh] md:max-h-[92dvh] flex flex-col"
            >
              {/* Drag handle (mobile only) */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 md:hidden flex-shrink-0" />

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-2 pb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
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

                  {/* Error banner */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg mb-4">
                      {submitError}
                    </div>
                  )}

                  <div className="space-y-5">

                    {/* ── Images ─────────────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Photos <span className="text-gray-400 font-normal">(optional)</span>
                      </label>

                      <div className="flex gap-3 flex-wrap">
                        {/* Main image slot (index 0) */}
                        <button
                          type="button"
                          onClick={() => mainImageRef.current?.click()}
                          className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FA3728] flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden flex-shrink-0 relative"
                        >
                          {formData.imagePreviews[0] ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={formData.imagePreviews[0]}
                                alt="Main"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center z-10"
                              >
                                <X size={10} className="text-white" strokeWidth={3} />
                              </button>
                            </>
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

                        {/* Gallery image slots (index 1–9) */}
                        <div className="flex gap-2 flex-wrap">
                          {formData.imagePreviews.slice(1).map((src, idx) => (
                            <div
                              key={idx + 1}
                              className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`Photo ${idx + 2}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx + 1)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
                              >
                                <X size={10} className="text-white" strokeWidth={3} />
                              </button>
                            </div>
                          ))}

                          {/* Add-more slot (shown when under MAX_IMAGES) */}
                          {formData.images.length < MAX_IMAGES && (
                            <button
                              type="button"
                              onClick={() => galleryImagesRef.current?.click()}
                              className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#FA3728] flex flex-col items-center justify-center gap-0.5 transition-colors flex-shrink-0"
                            >
                              <Grid2x2 size={16} className="text-gray-400" />
                              <span className="text-[9px] text-gray-400 font-medium">Add</span>
                            </button>
                          )}
                          <input
                            ref={galleryImagesRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleGalleryImages}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 mt-1.5">
                        Photos help buyers trust your listing, but you can save without one —
                        up to {MAX_IMAGES} allowed ({formData.images.length}/{MAX_IMAGES} added)
                      </p>
                    </div>

                    {/* ── Title ──────────────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name <span className="text-[#FA3728]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={formData.item_type === 'service' ? 'e.g. Hair Braiding Session' : 'e.g. African Print Dress'}
                        required
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                      />
                    </div>

                    {/* ── Description ────────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder={
                          formData.item_type === 'service'
                            ? 'Describe your service — what it includes, duration, requirements'
                            : 'Describe your product — material, size, use case'
                        }
                        rows={3}
                        maxLength={2000}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* ── Price + Type ────────────────────────────────── */}
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
                          onChange={(e) =>
                            setFormData({ ...formData, item_type: e.target.value as ItemType })
                          }
                          className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all"
                        >
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                    </div>

                    {/* ── Category ───────────────────────────────────── */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <select
                        value={formData.taxonomy_id}
                        onChange={(e) => setFormData({ ...formData, taxonomy_id: e.target.value })}
                        disabled={!categoriesLoaded}
                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none transition-all disabled:opacity-50"
                      >
                        <option value="">
                          {!categoriesLoaded
                            ? 'Loading…'
                            : categoryOptions.length
                              ? 'Select category'
                              : 'No categories available'}
                        </option>
                        {categoryOptions.map((option) => {
                          const isParent = option.depth === 0;
                          return (
                            <option
                              key={option.id}
                              value={option.id}
                              disabled={isParent}
                              className={isParent ? 'font-bold text-gray-400 bg-gray-100' : 'pl-4'}
                            >
                              {'—'.repeat(option.depth)} {option.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* ── Tax inclusive toggle ─────────────────────────── */}
                    <div
                      onClick={() =>
                        setFormData({ ...formData, tax_inclusive: !formData.tax_inclusive })
                      }
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-colors hover:border-gray-300"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tax Inclusive</p>
                        <p className="text-xs text-gray-500 mt-0.5">Price already includes taxes</p>
                      </div>
                      <div
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          formData.tax_inclusive ? 'bg-[#FA3728]' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            formData.tax_inclusive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sticky footer */}
                <div
                  className="p-4 md:p-6 border-t border-gray-100 bg-white flex-shrink-0 md:rounded-b-2xl"
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
                      `Save ${formData.item_type === 'service' ? 'Service' : 'Product'}`
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

// ─────────────────────────────────────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────────────────────────────────────

function ProductCard({
  product,
  formatPrice,
  onEdit,
  onDelete,
}: {
  product: UIProduct;
  formatPrice: (p: string) => string;
  onEdit: (product: UIProduct) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Primary image: use local preview (if just created) or the first stored
   * image from the backend (images[0].image_url).
   */
  const primaryImage = product.imagePreviews?.[0] ?? product.images?.[0]?.image_url;
  const hasImage = !!primaryImage;
  const categoryLabel = product.taxonomy_path || '';
  const hasDescription = !!product.description;

  /**
   * Additional thumbnails: local previews beyond index 0, or backend images
   * beyond index 0.
   */
  const galleryImages: string[] =
    product.imagePreviews && product.imagePreviews.length > 1
      ? product.imagePreviews.slice(1)
      : (product.images?.slice(1).map((i) => i.image_url) ?? []);

  const addonCount = product.addons?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all relative">

      {/* Active badge */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
        <span className="text-[10px] md:text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {/* Context menu */}
      <div className="absolute bottom-3 right-3 z-20">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden">
              <button
                onClick={() => { setIsMenuOpen(false); onEdit(product); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Edit
              </button>
              <div className="h-px bg-gray-100 w-full" />
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onDelete(product.id);
                    setIsMenuOpen(false);
                  } catch {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-0">
        {/* Cover image */}
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
              <span className="text-[9px] text-gray-300 font-medium">No photo</span>
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

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 font-medium flex-wrap">
            <span className="capitalize text-gray-400">{product.item_type}</span>
            {parseFloat(product.average_rating) > 0 && (
              <span>★ {parseFloat(product.average_rating).toFixed(1)}</span>
            )}
            {parseInt(product.review_count) > 0 && (
              <span>{product.review_count} review{parseInt(product.review_count) !== 1 ? 's' : ''}</span>
            )}
            {/* Add-ons count (data comes from backend via addons[] on the product) */}
            {addonCount > 0 && (
              <span className="flex items-center gap-1 text-violet-500">
                <Puzzle size={11} />
                {addonCount} add-on{addonCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Gallery thumbnails */}
          {galleryImages.length > 0 && (
            <div className="flex gap-1.5 mt-2.5">
              {galleryImages.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Photo ${i + 2}`}
                  className="w-8 h-8 rounded-md object-cover border border-gray-100"
                />
              ))}
              {galleryImages.length > 4 && (
                <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                  +{galleryImages.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}