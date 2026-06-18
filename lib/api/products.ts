import apiClient, { API_ENDPOINTS } from './config';
import type {
  ProductService,
  ProductServiceCreate,
  ProductFilters,
  PaginatedResponse,
  Category,
} from './types';

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
    const hasImages = !!data.images?.length;

    if (hasImages) {
      const form = new FormData();
      form.append('title', data.title);
      form.append('price', data.price);
      form.append('item_type', data.item_type);
      if (data.description) form.append('description', data.description);
      if (data.tax_inclusive !== undefined) form.append('tax_inclusive', String(data.tax_inclusive));
      if (data.taxonomy_id) form.append('taxonomy_id', data.taxonomy_id);
      data.images!.forEach((img) => form.append('images', img));
      const response = await apiClient.post<ProductService>(API_ENDPOINTS.PRODUCTS.CREATE, form);
      return response.data;
    }

    // No files — send plain JSON so DRF parses types correctly
    const payload: Record<string, unknown> = {
      title: data.title,
      price: data.price,
      item_type: data.item_type,
    };
    if (data.description) payload.description = data.description;
    if (data.tax_inclusive !== undefined) payload.tax_inclusive = data.tax_inclusive;
    if (data.taxonomy_id) payload.taxonomy_id = data.taxonomy_id;

    const response = await apiClient.post<ProductService>(API_ENDPOINTS.PRODUCTS.CREATE, payload);
    console.log('RESPONSE', response.data);
    return response.data;
  },

  /** Update product (vendor only) */
  async updateProduct(id: string, data: Partial<ProductServiceCreate>): Promise<ProductService> {
    const hasImages = !!data.images?.length;

    if (hasImages) {
      const form = new FormData();
      if (data.title) form.append('title', data.title);
      if (data.price) form.append('price', data.price);
      if (data.item_type) form.append('item_type', data.item_type);
      if (data.description) form.append('description', data.description);
      if (data.tax_inclusive !== undefined) form.append('tax_inclusive', String(data.tax_inclusive));
      if (data.taxonomy_id) form.append('taxonomy_id', data.taxonomy_id);
      data.images!.forEach((img) => form.append('uploaded_images', img));
      const response = await apiClient.patch<ProductService>(API_ENDPOINTS.PRODUCTS.UPDATE(id), form);
      return response.data;
    }

    const payload: Record<string, unknown> = {};
    if (data.title) payload.title = data.title;
    if (data.price) payload.price = data.price;
    if (data.item_type) payload.item_type = data.item_type;
    if (data.description) payload.description = data.description;
    if (data.tax_inclusive !== undefined) payload.tax_inclusive = data.tax_inclusive;
    if (data.taxonomy_id) payload.taxonomy_id = data.taxonomy_id;

    const response = await apiClient.patch<ProductService>(API_ENDPOINTS.PRODUCTS.UPDATE(id), payload);
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
