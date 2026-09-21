import type { ProductService, ItemType } from '@/lib/api/types';

export interface TaxonomyOption {
  id: string;
  name: string;
  depth: number;
}

export function flattenTaxonomy(items: any[], depth = 0): TaxonomyOption[] {
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
export interface UIProduct extends ProductService {
  localStock?: number;
  mainImagePreview?: string;
  subImagePreviews?: string[];
}

export interface ProductFormData {
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

export const INITIAL_PRODUCT_FORM: ProductFormData = {
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
