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
   * Get cart items
   */
  async getCartItems(): Promise<CartItem[]> {
    const response = await apiClient.get<CartItem[]>(
      API_ENDPOINTS.CART_ITEMS.LIST
    );
    return response.data;
  },

  /**
   * Add item to cart
   */
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await apiClient.post<CartItem>(
      API_ENDPOINTS.CART_ITEMS.ADD,
      data
    );
    return response.data;
  },

  /**
   * Update cart item (quantity or add-ons)
   */
  async updateCartItem(
    id: number,
    data: UpdateCartItemRequest
  ): Promise<CartItem> {
    const response = await apiClient.patch<CartItem>(
      API_ENDPOINTS.CART_ITEMS.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CART_ITEMS.DELETE(id));
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const items = await this.getCartItems();
    await Promise.all(items.map((item) => this.removeFromCart(item.id)));
  },

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Update item quantity
   */
  async updateQuantity(id: number, quantity: number): Promise<CartItem> {
    return this.updateCartItem(id, { quantity });
  },
};