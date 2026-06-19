import apiClient, { API_ENDPOINTS } from './config';
import type {
  ProductService,
  ProductServiceCreate,
  ProductFilters,
  PaginatedResponse,
  Category,
} from './types';
export function objectToFormData(data: Record<string, any>): FormData {
  const form = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    // Skip null/undefined values so we don't accidentally overwrite data with blanks
    if (value === null || value === undefined) return;

    // Handle ANY Array (e.g., uploaded_images [files] OR deleted_image_ids [numbers])
    if (Array.isArray(value)) {
      value.forEach((item) => form.append(key, item));
    } 
    // Handle simple values (strings, booleans, numbers)
    else {
      form.append(key, value);
    }
  });
  
  return form;
}
export const productsService = {
  /** Get all products on the platform (public) */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<ProductService>> {
    const response = await apiClient.get<PaginatedResponse<ProductService>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: filters }
    );
    return response.data;
  },

  /** Get the logged-in vendor's own products */
  async getMyProducts(): Promise<ProductService[]> {
    const response = await apiClient.get<ProductService[]>(
      API_ENDPOINTS.PRODUCTS.MY_PRODUCTS
    );
    return response.data;
  },

  /** Get single product by ID */
  async getProduct(id: string): Promise<ProductService> {
    const response = await apiClient.get<ProductService>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data;
  },

  /** Create a new product (vendor only) */
  async createProduct(data: ProductServiceCreate): Promise<ProductService> {

  // If you have images, use FormData. 
  // If not, you can still use FormData! DRF handles it perfectly 
  // as long as you aren't sending files that aren't there.
  const form = objectToFormData({
    title: data.title,
    price: data.price,
    item_type: data.item_type,
    description: data.description,
    tax_inclusive: data.tax_inclusive,
    taxonomy_id: data.taxonomy_id,
    uploaded_images: data.images, // If this is empty, the helper skips it
  });

  const response = await apiClient.post<ProductService>(
    API_ENDPOINTS.PRODUCTS.CREATE, 
    form,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  return response.data;
  },

  /** Update product (vendor only) */
  async updateProduct(
  id: string, 
  data: Partial<ProductServiceCreate> & { deleted_image_ids?: string[], uploaded_images?: File[] }
): Promise<ProductService> {
  
  // The helper automatically strips out any fields that are undefined,
  // so it will only send the exact fields you are trying to update!
  const form = objectToFormData({
    title: data.title,
    price: data.price,
    item_type: data.item_type,
    description: data.description,
    tax_inclusive: data.tax_inclusive,
    taxonomy_id: data.taxonomy_id,
    uploaded_images: data.uploaded_images || data.images, // Supports both naming conventions
    deleted_image_ids: data.deleted_image_ids,
  });

  const response = await apiClient.patch<ProductService>(
    API_ENDPOINTS.PRODUCTS.UPDATE(id), 
    form
  );
  
  return response.data;
},
  /** Delete product (vendor only) */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },

  /**
   * Search products and vendors.
   * Uses /api/commerce/search/?q= (the dedicated search endpoint) which also
   * returns matching vendors. The products list endpoint does NOT support ?search.
   */
  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<ProductService>> {
    const response = await apiClient.get<any>(API_ENDPOINTS.SEARCH, {
      params: {
        q: query,
        ...(filters?.item_type && { item_type: filters.item_type }),
        ...(filters?.min_price && { min_price: filters.min_price }),
        ...(filters?.max_price && { max_price: filters.max_price }),
      },
    });
    // /search/ returns { products: { results, count, ... }, vendors: [...] }
    const data = response.data;
    const products = data?.products ?? data;
    return {
      results: Array.isArray(products) ? products : (products?.results ?? []),
      count: products?.count ?? 0,
      next: products?.next ?? null,
      previous: products?.previous ?? null,
    };
  },
};

export const categoriesService = {
  /** Get the full taxonomy tree — returns [] on error */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORIES.LIST);
      const data = response.data;
      return Array.isArray(data) ? data : (data?.results ?? []);
    } catch {
      return [];
    }
  },

  /** Get a single taxonomy node by UUID */
  async getCategory(id: string): Promise<Category> {
    const response = await apiClient.get<Category>(
      API_ENDPOINTS.CATEGORIES.DETAIL(id)
    );
    return response.data;
  },
};
