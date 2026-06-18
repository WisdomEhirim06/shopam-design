'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  X, 
  ImageIcon, 
  Camera, 
  Grid2x2,
  AlertCircle
} from 'lucide-react';
import { authService } from '@/lib/api';
// Note: Adjust the import path for your services based on your folder structure
import { productsService, categoriesService } from '@/lib/api/products';
import type { ItemType } from '@/lib/api/types';

// ─────────────────────────────────────────────────────────────────────────────
// Taxonomy helpers
// ─────────────────────────────────────────────────────────────────────────────

interface TaxonomyOption {
  id: string;
  name: string;
  depth: number;
}

const CATEGORY_MAP: Record<string, string> = {
  fashion: 'Fashion',
  beauty_hair: 'Beauty, Hair & Personal Care',
  home_living: 'Home & Living',
  food_drinks: 'Food & Drinks',
  baby_kids: 'Baby & Kids',
  books_stationery: 'Books & Stationery',
  health_wellness: 'Health & Wellness',
};

const getRelevantTaxonomy = (data: any[], categoryId: string) => {
  const targetName = CATEGORY_MAP[categoryId];
  if (!targetName) return data;
  const branch = data.find((c: any) => c.name === targetName);
  return branch ? [branch] : data;
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

const MAX_IMAGES = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // ── State ────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [venProfile, setVenProfile] = useState<any>(null);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    item_type: 'product' as ItemType,
    tax_inclusive: false,
    taxonomy_id: '',
  });

  // Image Management
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Initialization ───────────────────────────────────────────────────────
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Fetch Vendor Profile (needed for taxonomy mapping)
        const user = await authService.getVendorProfile();
        if (!user) {
          router.push('/explore');
          return;
        }
        setVenProfile(user);

        // 2. Fetch Taxonomy Categories
        const catData = await categoriesService.getCategories();
        const branch = getRelevantTaxonomy(catData, user.business_category);
        setCategoryOptions(flattenTaxonomy(branch));
        setCategoriesLoaded(true);

        // 3. Fetch Product Details
        // Ensure your productsService has a `getProduct(id)` method
        const product = await productsService.getProduct(productId);
        
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: product.price ? product.price.toString() : '',
          item_type: product.item_type || 'product',
          tax_inclusive: product.tax_inclusive || false,
          taxonomy_id: product.taxonomy_path || '',
        });

        // Set existing images
        if (product.images && Array.isArray(product.images)) {
          setExistingImages(product.images);
        }

      } catch (err: any) {
        console.error('Failed to initialize edit page:', err);
        setError('Failed to load product details. It may have been deleted or you do not have permission.');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      initData();
    }
  }, [productId, router]);

  // ── Image Handlers ───────────────────────────────────────────────────────
  
  const totalActiveImages = existingImages.length + newImages.length;

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setNewImages((prevFiles) => {
      const remainingSlots = MAX_IMAGES - totalActiveImages;
      const filesToAdd = files.slice(0, remainingSlots);
      
      // Generate previews
      const previewsToAdd = filesToAdd.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prevPreviews) => [...prevPreviews, ...previewsToAdd]);

      return [...prevFiles, ...filesToAdd];
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Form Submission ──────────────────────────────────────────────────────
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    setIsSaving(true);
    setError(null);

    try {
      // The backend accepts `uploaded_images` and `deleted_image_ids` for updates
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        price: formData.price,
        item_type: formData.item_type,
        tax_inclusive: formData.tax_inclusive,
        taxonomy_id: formData.taxonomy_id || undefined,
        uploaded_images: newImages.length > 0 ? newImages : undefined,
        deleted_image_ids: deletedImageIds.length > 0 ? deletedImageIds.map(id => Number(id)) : undefined,
      };

      await productsService.updateProduct(productId, payload);
      
      // Navigate back to products list on success
      router.push('/dashboard/products');
      
    } catch (err: any) {
      const axiosErr = err;
      const data = axiosErr?.response?.data;
      
      const msg =
        data?.detail ||
        data?.message ||
        data?.error ||
        data?.uploaded_images || // Catch the >10 images error explicitly
        (typeof data === 'object' ? JSON.stringify(data) : null) ||
        axiosErr?.message ||
        'Failed to update listing';
        
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-[#FA3728] mb-4" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 md:p-8 max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/dashboard/products')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Edit {formData.item_type === 'service' ? 'Service' : 'Product'}</h1>
          <p className="text-sm text-gray-500">Update your listing details and images</p>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ── Images Section ── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Photos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload up to {MAX_IMAGES} images. First image will be the cover. ({totalActiveImages}/{MAX_IMAGES})
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Existing Images */}
            {existingImages.map((img, idx) => (
              <div key={`existing-${img.id}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="Existing" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">
                  {idx === 0 ? 'Cover' : 'Saved'}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* New Images */}
            {newImagePreviews.map((preview, idx) => (
              <div key={`new-${idx}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#FA3728]/30 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="New" className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-[#FA3728] text-white text-[9px] px-1.5 py-0.5 rounded font-medium shadow-sm">
                  New
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(idx)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            {totalActiveImages < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FA3728] hover:bg-red-50/50 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Camera size={20} className="text-gray-400" />
                <span className="text-[10px] text-gray-500 font-medium text-center">Add Photo</span>
              </button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImages}
            />
          </div>
        </div>

        {/* ── Details Section ── */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Basic Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-[#FA3728]">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              maxLength={2000}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price */}
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
                required
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Listing Type <span className="text-[#FA3728]">*</span>
              </label>
              <select
                value={formData.item_type}
                onChange={(e) => setFormData({ ...formData, item_type: e.target.value as ItemType })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={formData.taxonomy_id}
              onChange={(e) => setFormData({ ...formData, taxonomy_id: e.target.value })}
              disabled={!categoriesLoaded}
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#FA3728] focus:bg-white focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 transition-all disabled:opacity-50"
            >
              <option value="">
                {!categoriesLoaded ? 'Loading categories...' : 'Select a category'}
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

          {/* Tax inclusive toggle */}
          <div
            onClick={() => setFormData({ ...formData, tax_inclusive: !formData.tax_inclusive })}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-colors hover:border-gray-300 mt-2"
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.push('/dashboard/products')}
            disabled={isSaving}
            className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !formData.title || !formData.price}
            className="flex-1 py-3.5 bg-[#FA3728] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#E31B23] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving Changes...</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}