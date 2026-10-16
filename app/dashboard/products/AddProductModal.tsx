'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, ChevronDown, Grid2x2, Loader2, X } from 'lucide-react';
import { productsService, categoriesService } from '@/lib/api/products';
import {
  flattenTaxonomy,
  INITIAL_PRODUCT_FORM,
  type ProductFormData,
  type TaxonomyOption,
  type UIProduct,
} from './product-form';
import Modal from '../components/Modal';
import Field from '../components/Field';
import Switch from '../components/Switch';

function SelectField({
  label,
  value,
  onChange,
  disabled,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl border-2 border-slate-200 bg-white transition-colors focus-within:border-ink">
      <span className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl bg-transparent px-4 pb-2 pt-6 text-[15px] text-ink outline-none disabled:opacity-50"
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );
}

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
    categoriesService
      .getCategories()
      .then((data) => setCategoryOptions(flattenTaxonomy(data)))
      .catch(() => {})
      .finally(() => setCategoriesLoaded(true));
  }, [open]);

  const close = () => {
    setFormData(INITIAL_PRODUCT_FORM);
    setSubmitError(null);
    onClose();
  };

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((f) => ({ ...f, mainImage: file, mainImagePreview: URL.createObjectURL(file) }));
  };

  const handleSubImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setFormData((f) => ({
      ...f,
      subImages: [...f.subImages, ...files].slice(0, 5),
      subImagePreviews: [...f.subImagePreviews, ...files.map((file) => URL.createObjectURL(file))].slice(0, 5),
    }));
  };

  const removeSubImage = (index: number) =>
    setFormData((f) => ({
      ...f,
      subImages: f.subImages.filter((_, i) => i !== index),
      subImagePreviews: f.subImagePreviews.filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    if (!formData.title || !formData.price) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const allImages = [...(formData.mainImage ? [formData.mainImage] : []), ...formData.subImages];
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

      onCreated({
        ...newProduct,
        localStock: formData.stock ? Number(formData.stock) : undefined,
        mainImagePreview: formData.mainImagePreview ?? undefined,
        subImagePreviews: formData.subImagePreviews,
      });
      setFormData(INITIAL_PRODUCT_FORM);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: Record<string, unknown> }; message?: string };
      const status = axiosErr?.response?.status;
      const data = axiosErr?.response?.data;
      const backendMsg = (data?.detail || data?.message || data?.error) as string | undefined;

      if (status === 403) {
        setSubmitError(
          backendMsg && backendMsg !== 'You do not have permission to perform this action.'
            ? backendMsg
            : 'Your vendor account is not fully set up yet. Complete your vendor profile or contact support.'
        );
      } else {
        setSubmitError(backendMsg || axiosErr?.message || 'Failed to create product.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add product"
      description="List a new product or service in your shop."
      onClose={close}
      footer={
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.title || !formData.price}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#FA3728] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Saving…' : 'Save product'}
        </button>
      }
    >
      <div className="space-y-5">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{submitError}</div>
        )}

        {/* Images */}
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">Product images</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => mainImageRef.current?.click()}
              className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#FA3728] hover:text-[#FA3728]"
            >
              {formData.mainImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.mainImagePreview} alt="Main" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <>
                  <Camera size={20} />
                  <span className="text-center text-[10px] font-medium leading-tight">Main<br />photo</span>
                </>
              )}
            </button>
            <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />

            <div className="flex flex-wrap gap-2">
              {formData.subImagePreviews.map((src, idx) => (
                <div key={idx} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Sub ${idx + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSubImage(idx)}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60"
                  >
                    <X size={10} className="text-white" strokeWidth={3} />
                  </button>
                </div>
              ))}
              {formData.subImagePreviews.length < 5 && (
                <button
                  type="button"
                  onClick={() => subImagesRef.current?.click()}
                  className="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#FA3728] hover:text-[#FA3728]"
                >
                  <Grid2x2 size={16} />
                  <span className="text-[9px] font-medium">Add</span>
                </button>
              )}
              <input ref={subImagesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSubImages} />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">1 main photo + up to 5 gallery images</p>
        </div>

        <Field label="Product name" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} />
        <Field label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} textarea rows={3} />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₦)" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} type="number" inputMode="decimal" />
          <SelectField label="Type" value={formData.item_type} onChange={(v) => setFormData({ ...formData, item_type: v as ProductFormData['item_type'] })}>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Stock qty" value={formData.stock} onChange={(v) => setFormData({ ...formData, stock: v })} type="number" inputMode="numeric" />
          <SelectField
            label="Category"
            value={formData.taxonomy_id}
            onChange={(v) => setFormData({ ...formData, taxonomy_id: v })}
            disabled={!categoriesLoaded}
          >
            <option value="">{!categoriesLoaded ? 'Loading…' : categoryOptions.length ? 'Select category' : 'No categories'}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.depth > 0 ? `${'  '.repeat(opt.depth)}↳ ` : ''}{opt.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Tax inclusive</p>
            <p className="mt-0.5 text-xs text-slate-600">Price already includes taxes</p>
          </div>
          <Switch checked={formData.tax_inclusive} onChange={() => setFormData({ ...formData, tax_inclusive: !formData.tax_inclusive })} />
        </div>
      </div>
    </Modal>
  );
}
