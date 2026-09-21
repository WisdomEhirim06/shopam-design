import type { Order as APIOrder, OrderStatus as APIOrderStatus } from '@/lib/api/types';

/* ─────────────── UI Types ─────────────── */
export type UIOrderStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Declined';

export interface UIOrderItem {
  name: string;
  price: string;
  quantity: number;
}

export type ConvMsgType =
  | 'order_card'
  | 'text'
  | 'shipping_notification'
  | 'payment_success';

export interface ConversationMessage {
  id: string;
  type: ConvMsgType;
  timestamp: string;
  fromBuyer?: boolean;
  orderStatus?: 'Pending' | 'Accepted' | 'Declined' | 'Shipping Fee Set' | 'Shipped';
  buyerName?: string;
  items?: UIOrderItem[];
  total?: number;
  shippingFee?: number;
  address?: string;
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

export function orderCardStatus(status: APIOrderStatus): ConversationMessage['orderStatus'] {
  if (status === 'pending_vendor_review') return 'Pending';
  if (status === 'cancelled') return 'Declined';
  if (status === 'awaiting_payment' || status === 'paid') return 'Shipping Fee Set';
  if (status === 'shipped' || status === 'delivered' || status === 'completed') return 'Shipped';
  return 'Accepted';
}

export function transformOrder(order: APIOrder): UIOrder {
  const colorIndex = order.customer.charCodeAt(0) % AVATAR_COLORS.length;
  const shortId = order.customer.substring(0, 8).toUpperCase();
  const buyerName = `Buyer #${shortId}`;
  const avatar = shortId.substring(0, 2);

  const items: UIOrderItem[] = order.items.map((item) => ({
    name: item.product_details.title,
    price: `₦${parseFloat(item.product_details.price).toLocaleString('en-NG')}`,
    quantity: item.quantity,
  }));

  const firstItem = order.items[0];
  const itemSummary = firstItem
    ? `${firstItem.product_details.title} × ${firstItem.quantity}`
    : 'No items';

  const total = parseFloat(order.grand_total || '0');
  const shippingFee = order.shipping_fee ? parseFloat(order.shipping_fee) : undefined;
  const timestamp = new Date(order.created_at).toLocaleTimeString('en-NG', {
    hour: '2-digit', minute: '2-digit',
  });

  const orderCard: ConversationMessage = {
    id: `order-${order.id}`,
    type: 'order_card',
    timestamp,
    fromBuyer: true,
    orderStatus: orderCardStatus(order.status),
    buyerName,
    items,
    total,
    shippingFee,
    address: order.shipping_address ?? undefined,
  };

  // Add shipping notification message if fee is already set
  const messages: ConversationMessage[] = [orderCard];
  if (shippingFee && order.status !== 'pending_vendor_review') {
    messages.push({
      id: `shipping-${order.id}`,
      type: 'shipping_notification',
      timestamp,
      fromBuyer: false,
      shippingFee,
      total,
    });
  }

  return {
    id: order.id,
    name: buyerName,
    item: itemSummary,
    items,
    price: `₦${total.toLocaleString('en-NG')}`,
    time: timestamp,
    status: apiStatusToUI(order.status),
    apiStatus: order.status,
    avatar,
    avatarColor: AVATAR_COLORS[colorIndex],
    unreadCount: order.status === 'pending_vendor_review' ? 1 : undefined,
    messages,
  };
}
