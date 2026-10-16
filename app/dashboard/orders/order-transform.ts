import type { Order as APIOrder, OrderStatus as APIOrderStatus } from '@/lib/api/types';

/* ─────────────── UI Types ─────────────── */
export type UIOrderStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Declined';

export interface UIOrderItem {
  name: string;
  price: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export type ConvMsgType =
  | 'order_card'
  | 'accepted'
  | 'shipping_notification'
  | 'payment_success'
  | 'shipped'
  | 'delivered'
  | 'declined'
  | 'disputed'
  | 'text';

export interface ConversationMessage {
  id: string;
  type: ConvMsgType;
  timestamp: string;
  fromBuyer?: boolean;
  items?: UIOrderItem[];
  subtotal?: number;
  total?: number;
  shippingFee?: number;
  address?: string;
  reason?: string;
  content?: string;
}

export interface UIOrder {
  id: string;
  name: string;
  item: string;
  items: UIOrderItem[];
  price: string;
  time: string;
  status: Exclude<UIOrderStatus, 'All'>;
  apiStatus: APIOrderStatus;
  avatar: string;
  avatarColor: string;
  unreadCount?: number;
  messages: ConversationMessage[];
}

/* ─────────────── Status mapping ─────────────── */
export const AVATAR_COLORS = [
  'bg-[#FA3728]', 'bg-emerald-500', 'bg-blue-500',
  'bg-amber-500', 'bg-purple-500', 'bg-teal-500',
];

export function apiStatusToUI(status: APIOrderStatus): Exclude<UIOrderStatus, 'All'> {
  switch (status) {
    case 'pending_vendor_review':
    case 'pending_customer_approval':
      return 'Pending';
    case 'awaiting_shipping_details':
    case 'shipping_set':
    case 'awaiting_payment':
    case 'paid':
    case 'shipped':
    case 'delivered':
    case 'disputed':
      return 'Confirmed';
    case 'completed':
    case 'cancelled':
      return 'Completed';
  }
}

const PAID = ['paid', 'shipped', 'delivered', 'completed'];
const SHIPPED = ['shipped', 'delivered', 'completed'];
const DELIVERED = ['delivered', 'completed'];
const ACCEPTED = [
  'pending_customer_approval', 'awaiting_shipping_details', 'shipping_set',
  'awaiting_payment', 'paid', 'shipped', 'delivered', 'completed',
];

/**
 * Builds an append-only event timeline for the vendor conversation. Each status
 * milestone is its own message, so the thread reads chronologically instead of
 * one card whose badge mutates.
 */
export function transformOrder(order: APIOrder): UIOrder {
  const extra = order as unknown as { rejection_reason?: string; dispute_reason?: string };
  const colorIndex = order.customer.charCodeAt(0) % AVATAR_COLORS.length;
  const shortId = order.customer.substring(0, 8).toUpperCase();
  const buyerName = `Buyer #${shortId}`;
  const avatar = shortId.substring(0, 2);
  const time = new Date(order.created_at).toLocaleTimeString('en-NG', {
    hour: '2-digit', minute: '2-digit',
  });

  const items: UIOrderItem[] = order.items.map((item) => ({
    name: item.product_details.title,
    unitPrice: parseFloat(item.product_details.price) || 0,
    price: `₦${(parseFloat(item.product_details.price) || 0).toLocaleString('en-NG')}`,
    quantity: item.quantity,
    image: item.product_details.images?.[0]?.image_url,
  }));

  const deliveryFee = order.shipping_fee ? parseFloat(order.shipping_fee) : 0;
  const grandTotal = parseFloat(order.grand_total || '0') || 0;
  const subtotal = Math.max(0, grandTotal - deliveryFee);

  const messages: ConversationMessage[] = [];

  // 1. Order request (immutable)
  messages.push({
    id: `order-${order.id}`,
    type: 'order_card',
    timestamp: time,
    fromBuyer: true,
    items,
    subtotal,
    shippingFee: deliveryFee || undefined,
    total: grandTotal,
    address: order.shipping_address ?? undefined,
  });

  // 2. Changes proposed (awaiting buyer)
  if (order.status === 'pending_customer_approval') {
    messages.push({ id: `changes-${order.id}`, type: 'shipping_notification', timestamp: time, items, subtotal, shippingFee: deliveryFee || undefined, total: grandTotal });
  }

  // 3. Vendor accepted
  if (ACCEPTED.includes(order.status)) {
    messages.push({ id: `accepted-${order.id}`, type: 'accepted', timestamp: time, total: grandTotal });
  }

  // 4. Delivery fee set
  if (deliveryFee > 0 && ACCEPTED.includes(order.status)) {
    messages.push({ id: `shipping-${order.id}`, type: 'shipping_notification', timestamp: time, shippingFee: deliveryFee, subtotal, total: grandTotal });
  }

  // 5. Payment received
  if (PAID.includes(order.status)) {
    messages.push({ id: `payment-${order.id}`, type: 'payment_success', timestamp: time, total: grandTotal });
  }

  // 6. Shipped
  if (SHIPPED.includes(order.status)) {
    messages.push({ id: `shipped-${order.id}`, type: 'shipped', timestamp: time });
  }

  // 7. Delivered
  if (DELIVERED.includes(order.status)) {
    messages.push({ id: `delivered-${order.id}`, type: 'delivered', timestamp: time });
  }

  // 8. Declined
  if (order.status === 'cancelled') {
    messages.push({ id: `declined-${order.id}`, type: 'declined', timestamp: time, reason: extra.rejection_reason || 'Order declined' });
  }

  // 9. Disputed
  if (order.status === 'disputed') {
    messages.push({ id: `disputed-${order.id}`, type: 'disputed', timestamp: time, reason: extra.dispute_reason || 'Buyer raised a dispute' });
  }

  const firstItem = order.items[0];
  const itemSummary = firstItem
    ? `${firstItem.product_details.title} × ${firstItem.quantity}`
    : 'No items';

  return {
    id: order.id,
    name: buyerName,
    item: itemSummary,
    items,
    price: `₦${grandTotal.toLocaleString('en-NG')}`,
    time,
    status: apiStatusToUI(order.status),
    apiStatus: order.status,
    avatar,
    avatarColor: AVATAR_COLORS[colorIndex],
    unreadCount: order.status === 'pending_vendor_review' ? 1 : undefined,
    messages,
  };
}
