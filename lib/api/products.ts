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
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', data.price);
    formData.append('item_type', data.item_type);
    if (data.description) formData.append('description', data.description);
    if (data.tax_inclusive !== undefined) formData.append('tax_inclusive', String(data.tax_inclusive));
    // Extra fields: backend will accept when support is added
    if (data.stock !== undefined) formData.append('stock', String(data.stock));
    if (data.category) formData.append('category', data.category);
    if (data.images?.length) {
      data.images.forEach((file) => formData.append('images', file));
    }
    const response = await apiClient.post<ProductService>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /** Update product (vendor only) */
  async updateProduct(id: string, data: Partial<ProductServiceCreate>): Promise<ProductService> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.price) formData.append('price', data.price);
    if (data.item_type) formData.append('item_type', data.item_type);
    if (data.description) formData.append('description', data.description);
    if (data.tax_inclusive !== undefined) formData.append('tax_inclusive', String(data.tax_inclusive));
    if (data.stock !== undefined) formData.append('stock', String(data.stock));
    if (data.category) formData.append('category', data.category);
    if (data.images?.length) {
      data.images.forEach((file) => formData.append('images', file));
    }
    const response = await apiClient.patch<ProductService>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /** Delete product (vendor only) */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },

  /** Search products */
  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<ProductService>> {
    return this.getProducts({ ...filters, search: query });
  },
};

export const categoriesService = {
  /** Get all categories — returns [] if endpoint is not yet available (404/401) */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORIES.LIST);
      // API may return an array or a paginated { results: [] } shape
      const data = response.data;
      return Array.isArray(data) ? data : (data?.results ?? []);
    } catch {
      return [];
    }
  },

  /** Get single category */
  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(
      API_ENDPOINTS.CATEGORIES.DETAIL(id)
    );
    return response.data;
  },
};
