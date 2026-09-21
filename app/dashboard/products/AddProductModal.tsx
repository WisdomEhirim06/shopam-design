'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Grid2x2, Loader2 } from 'lucide-react';
import { productsService, categoriesService } from '@/lib/api/products';
import { flattenTaxonomy, INITIAL_PRODUCT_FORM, type ProductFormData, type TaxonomyOption, type UIProduct } from './product-form';

export default function AddProductModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (product: UIProduct) => void;
}) {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_PRODUCT_FORM);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyOption[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const subImagesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    categoriesService.getCategories()
      .then((data) => setCategoryOptions(flattenTaxonomy(data)))
      .catch(() => { /* leave options empty */ })
      .finally(() => setCategoriesLoaded(true));
  }, [open]);

  const close = () => {
    setFormData(INITIAL_PRODUCT_FORM);
    setSubmitError(null);
    onClose();
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

      onCreated(uiProduct);
      setFormData(INITIAL_PRODUCT_FORM);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as any;
      const status = axiosErr?.response?.status;
      const data = axiosErr?.response?.data;

      if (status === 403) {
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

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrops */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
          />
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
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
                onClick={close}
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
                        onChange={(e) => setFormData({ ...formData, item_type: e.target.value as any })}
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
                        {categoryOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.depth > 0 ? `${'  '.repeat(opt.depth)}↳ ` : ''}{opt.name}
                          </option>
                        ))}
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
  );
}
