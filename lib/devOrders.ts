import { DEV_AUTH_BYPASS } from './devAuth';
import type { Order, OrderItem, SubCart } from './api/types';

/**
 * Development-only order/message mocks.
 *
 * When the dev auth bypass is on (see `lib/devAuth.ts`) there is no real backend
 * session, so server calls like `POST /api/commerce/orders/place` fail. This
 * module keeps a local copy of orders and chat messages in localStorage so the
 * ENTIRE order flow — create → chat → vendor accept/modify/reject → checkout →
 * pay → tracking — can be exercised in development.
 *
 * It is impossible to activate in a production build: `DEV_AUTH_BYPASS` is
 * always false when NODE_ENV === 'production'.
 */
export const devMockEnabled = () => DEV_AUTH_BYPASS;

const ORDERS_KEY = 'shopam_dev_orders';
const MESSAGES_KEY = 'shopam_dev_messages';

const isBrowser = () => typeof window !== 'undefined';

interface DevTextMessage {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

function readMap<T>(key: string): Record<string, T> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function writeMap<T>(key: string, map: Record<string, T>) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(map));
}

export const isDevOrderId = (id: string) => id.startsWith('dev-order-');

const lineTotal = (price: string | number, quantity: number) =>
  (Number(price) || 0) * quantity;

/* ───────────────────────── Orders ───────────────────────── */

export function createDevOrderFromSubcart(subcart: SubCart): Order {
  const items: OrderItem[] = subcart.items.map((item, index) => ({
    id: `dev-item-${index}-${item.product}`,
    product: item.product,
    product_details: item.product_details,
    quantity: item.quantity,
    vendor_proposed_quantity: null,
    active_quantity: String(item.quantity),
    variant: item.variant ?? null,
    selected_addons: item.selected_addons ?? [],
    addon_details: item.addon_details ?? [],
    total_price: String(lineTotal(item.product_details.price, item.quantity)),
  }));

  const total = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);

  const order: Order = {
    id: `dev-order-${Date.now()}`,
    customer: 'dev-customer',
    vendor: subcart.vendor_id,
    vendor_name: subcart.vendor_name,
    status: 'pending_vendor_review',
    shipping_type: null,
    shipping_address: null,
    shipping_fee: '0.00',
    grand_total: String(total),
    items,
    confirmation_code: 'DEV-1234',
    delivery_proof_image: null,
    delivered_at: null,
    created_at: new Date().toISOString(),
  };

  const map = readMap<Order>(ORDERS_KEY);
  map[order.id] = order;
  writeMap(ORDERS_KEY, map);
  return order;
}

export function getDevOrder(id: string): Order | null {
  return readMap<Order>(ORDERS_KEY)[id] ?? null;
}

export function listDevOrders(): Order[] {
  return Object.values(readMap<Order>(ORDERS_KEY)).sort((a, b) =>
    (b.created_at || '').localeCompare(a.created_at || '')
  );
}

export function updateDevOrder(id: string, patch: Partial<Order>): Order | null {
  const map = readMap<Order>(ORDERS_KEY);
  const existing = map[id];
  if (!existing) return null;
  const next = { ...existing, ...patch };
  map[id] = next;
  writeMap(ORDERS_KEY, map);
  return next;
}

/** Apply a vendor's proposed item/price/delivery changes and move to review. */
export function applyDevOrderModification(
  id: string,
  changes: { items: { name: string; quantity: number; price: number; variant?: string }[]; delivery_fee: number }
): Order | null {
  const map = readMap<Order>(ORDERS_KEY);
  const order = map[id];
  if (!order) return null;

  const items: OrderItem[] = order.items.map((item) => {
    const proposed = changes.items.find((c) => c.name === item.product_details.title);
    if (!proposed) return item;
    return {
      ...item,
      quantity: proposed.quantity,
      vendor_proposed_quantity: proposed.quantity,
      variant: proposed.variant || item.variant,
      total_price: String(lineTotal(proposed.price, proposed.quantity)),
      product_details: { ...item.product_details, price: String(proposed.price) },
    };
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const next: Order = {
    ...order,
    items,
    shipping_fee: String(changes.delivery_fee || 0),
    grand_total: String(subtotal + (changes.delivery_fee || 0)),
    status: 'pending_customer_approval',
  };
  map[id] = next;
  writeMap(ORDERS_KEY, map);
  return next;
}

/** Set/replace the delivery fee and recompute the grand total. */
export function setDevShippingFee(id: string, fee: number): Order | null {
  const map = readMap<Order>(ORDERS_KEY);
  const order = map[id];
  if (!order) return null;
  const subtotal = order.items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const next: Order = {
    ...order,
    shipping_fee: String(fee || 0),
    grand_total: String(subtotal + (fee || 0)),
    status: 'awaiting_payment',
  };
  map[id] = next;
  writeMap(ORDERS_KEY, map);
  return next;
}

/* ───────────────────────── Messages ───────────────────────── */

export function getDevMessages(otherUserId: string): DevTextMessage[] {
  return readMap<DevTextMessage[]>(MESSAGES_KEY)[otherUserId] ?? [];
}

export function addDevMessage(otherUserId: string, sender: string, content: string): DevTextMessage {
  const map = readMap<DevTextMessage[]>(MESSAGES_KEY);
  const list = map[otherUserId] ?? [];
  const message: DevTextMessage = {
    id: `dev-msg-${Date.now()}`,
    sender,
    content,
    created_at: new Date().toISOString(),
  };
  list.push(message);
  map[otherUserId] = list;
  writeMap(MESSAGES_KEY, map);
  return message;
}
