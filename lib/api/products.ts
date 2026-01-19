import apiClient, { API_ENDPOINTS } from './config';
import type {
  Product,
  ProductCreate,
  ProductFilters,
  PaginatedResponse,
  Category,
} from './types';

export const productsService = {
  /**
   * Get list of products with filters
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data;
  },

  /**
   * Create a new product (vendor only)
   */
  async createProduct(data: ProductCreate): Promise<Product> {
    // Handle file uploads if images exist
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && value) {
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.post<Product>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update product
   */
  async updateProduct(id: string, data: Partial<ProductCreate>): Promise<Product> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && value) {
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await apiClient.patch<Product>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },

  /**
   * Search products
   */
  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return this.getProducts({
      ...filters,
      search: query,
    });
  },
};

export const categoriesService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      API_ENDPOINTS.CATEGORIES.LIST
    );
    return response.data;
  },

  /**
   * Get single category
   */
  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(
      API_ENDPOINTS.CATEGORIES.DETAIL(id)
    );
    return response.data;
  },
};