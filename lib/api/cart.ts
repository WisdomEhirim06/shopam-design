import apiClient, { API_ENDPOINTS } from './config';
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from './types';

export const cartService = {
  /**
   * Get user's cart (auto-created if doesn't exist)
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  /**
   * Helper to get all cart items as a flat list if needed
   */
  async getCartItems(): Promise<CartItem[]> {
    const cart = await this.getCart();
    return cart.subcarts.flatMap(subcart => subcart.items);
  },

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await apiClient.post<CartItem>(
      API_ENDPOINTS.CART.ADD,
      data
    );
    return response.data;
  },

  /**
   * Update cart item (quantity or add-ons)
   */
  async updateCartItem(
    id: string,
    data: UpdateCartItemRequest
  ): Promise<CartItem> {
    const response = await apiClient.patch<CartItem>(
      API_ENDPOINTS.CART.ITEM_DETAIL(id),
      data
    );
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.ITEM_DETAIL(id));
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
  },

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    return cart.subcarts.reduce(
      (total, subcart) => 
        total + subcart.items.reduce((sum, item) => sum + item.quantity, 0), 
      0
    );
  },

  /**
   * Update item quantity
   */
  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    return this.updateCartItem(id, { quantity });
  },
};