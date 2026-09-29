import apiClient, { API_ENDPOINTS } from './config';
import { authService } from './auth';
import { DEV_AUTH_BYPASS } from '../devAuth';
import type {
  Cart,
  CartItem,
  SubCart,
  Product,
  AddToCartRequest,
  UpdateCartItemRequest,
} from './types';

/**
 * Auth-aware cart.
 *
 * - Signed out → a localStorage "guest cart" so people can add items and review
 *   them before signing in. Nothing here requires an account.
 * - Signed in  → the server cart, and any pending guest cart is merged first.
 *
 * Authentication is only enforced later (checkout, follow, vendor dashboard).
 */

const GUEST_CART_KEY = 'shopam_guest_cart';

type GuestLine = { product: Product; quantity: number };

const isBrowser = () => typeof window !== 'undefined';
const isAuthed = () => {
  try {
    return authService.isAuthenticated();
  } catch {
    return false;
  }
};

/**
 * Whether to talk to the server cart. In dev bypass there is no real session
 * cookie, so we keep using the local cart even though `isAuthenticated()` is
 * forced true for the route guards.
 */
const serverCartEnabled = () => isAuthed() && !DEV_AUTH_BYPASS;

function readGuest(): GuestLine[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuestLine[]) : [];
  } catch {
    return [];
  }
}

function writeGuest(lines: GuestLine[]) {
  if (!isBrowser()) return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event('shopam:cart-updated'));
}

function buildGuestItem(product: Product, quantity: number): CartItem {
  const vendorId = product.owner || 'vendor';
  return {
    id: `guest-item-${product.id}`,
    subcart: `guest-subcart-${vendorId}`,
    product: product.id,
    product_details: product,
    quantity,
    variant: null,
    selected_addons: [],
    addon_details: [],
    total_price: String((parseFloat(product.price) || 0) * quantity),
  };
}

function toGuestCart(lines: GuestLine[]): Cart {
  const groups = new Map<string, { vendorName: string; items: CartItem[] }>();

  for (const line of lines) {
    const vendorId = line.product.owner || 'vendor';
    const vendorName = line.product.owner_name || 'ShopAm Vendor';
    if (!groups.has(vendorId)) groups.set(vendorId, { vendorName, items: [] });
    groups.get(vendorId)!.items.push(buildGuestItem(line.product, line.quantity));
  }

  const subcarts: SubCart[] = [...groups.entries()].map(([vendorId, group]) => ({
    id: `guest-subcart-${vendorId}`,
    vendor_id: vendorId,
    vendor_name: group.vendorName,
    items: group.items,
  }));

  return { id: 'guest-cart', user: 'guest', subcarts };
}

/** Push any guest-cart lines to the server cart once the user signs in. */
let _merging = false;
async function mergeGuestCart(): Promise<void> {
  if (_merging) return;
  const lines = readGuest();
  if (lines.length === 0) return;

  _merging = true;
  try {
    for (const line of lines) {
      await apiClient.post(API_ENDPOINTS.CART.ADD, {
        product_id: line.product.id,
        quantity: line.quantity,
      });
    }
    writeGuest([]);
  } catch {
    // Keep the guest cart intact so nothing is lost; it will retry next time.
  } finally {
    _merging = false;
  }
}

export const cartService = {
  /** Current cart — the local guest cart when signed out, else the server cart. */
  async getCart(): Promise<Cart> {
    if (!serverCartEnabled()) return toGuestCart(readGuest());

    await mergeGuestCart();
    const response = await apiClient.get<Cart>(API_ENDPOINTS.CART.GET);
    return response.data;
  },

  async getCartItems(): Promise<CartItem[]> {
    const cart = await this.getCart();
    return cart.subcarts.flatMap((subcart) => subcart.items);
  },

  /**
   * Add an item. Pass `product` so the guest cart can render without a server
   * round-trip; signed-in users only need `product_id`.
   */
  async addToCart(data: AddToCartRequest & { product?: Product }): Promise<CartItem | void> {
    if (!serverCartEnabled()) {
      if (!data.product) return; // nothing to snapshot — ignore for guests
      const quantity = data.quantity ?? 1;
      const lines = readGuest();
      const existing = lines.find((line) => line.product.id === data.product!.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        lines.push({ product: data.product, quantity });
      }
      writeGuest(lines);
      return;
    }

    const response = await apiClient.post<CartItem>(API_ENDPOINTS.CART.ADD, {
      product_id: data.product_id,
      quantity: data.quantity ?? 1,
      variant: data.variant ?? null,
      addon_ids: data.addon_ids,
    });
    return response.data;
  },

  async updateCartItem(id: string, data: UpdateCartItemRequest): Promise<CartItem> {
    if (!serverCartEnabled()) {
      const productId = id.replace('guest-item-', '');
      const lines = readGuest();
      const line = lines.find((entry) => entry.product.id === productId);
      if (line && typeof data.quantity === 'number') {
        line.quantity = Math.max(1, data.quantity);
        writeGuest(lines);
      }
      const item = toGuestCart(lines)
        .subcarts.flatMap((subcart) => subcart.items)
        .find((entry) => entry.id === id);
      if (!item) throw new Error('Cart item not found');
      return item;
    }

    const response = await apiClient.patch<CartItem>(
      API_ENDPOINTS.CART.ITEM_DETAIL(id),
      data
    );
    return response.data;
  },

  async removeFromCart(id: string): Promise<void> {
    if (!serverCartEnabled()) {
      const productId = id.replace('guest-item-', '');
      writeGuest(readGuest().filter((line) => line.product.id !== productId));
      return;
    }
    await apiClient.delete(API_ENDPOINTS.CART.ITEM_DETAIL(id));
  },

  async clearCart(): Promise<void> {
    if (!serverCartEnabled()) {
      writeGuest([]);
      return;
    }
    await apiClient.delete(API_ENDPOINTS.CART.CLEAR);
  },

  async getCartItemCount(): Promise<number> {
    const cart = await this.getCart();
    return cart.subcarts.reduce(
      (total, subcart) =>
        total + subcart.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
  },

  async updateQuantity(id: string, quantity: number): Promise<CartItem> {
    return this.updateCartItem(id, { quantity });
  },
};
