import type { Order } from '@/lib/api';

/* ─────────────── Types ─────────────── */
export interface MessageItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Message {
  id: string | number;
  type: 'order' | 'text' | 'shipping_notification' | 'payment_success';
  sender: 'user' | 'vendor';
  vendor: string;
  status: string;
  items: MessageItem[];
  total: number;
  shippingFee?: number;
  deliveryOption?: string;
  address?: string;
  time: string;
  text?: string;
  created_at?: string;
}

/* ─────────────── Card Input Helpers ─────────────── */
export function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

/* ─────────────── Message builder ─────────────── */
export function buildMessagesUI(
  o: Order,
  textThreads: { id: string; sender: string; content: string; created_at: string }[],
  currentUserId: string | undefined,
): Message[] {
  const systemMsgs: Message[] = [];
  const vName = o.vendor_name || 'Vendor';

  // Evaluate logic for status
  let card1Status = 'Pending'; // 'pending_vendor_review'
  if (['pending_customer_approval', 'awaiting_shipping_details', 'awaiting_payment', 'paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
    card1Status = 'Accepted';
  }
  if (o.shipping_address) {
    card1Status = 'Delivery Details Set';
  }
  if (o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered') {
    card1Status = 'Paid';
  }

  // Card 1: Order summary
  systemMsgs.push({
    id: 'order_card',
    type: 'order',
    sender: 'user', // customer sent
    vendor: vName,
    status: card1Status,
    items: o.items.map(i => ({
      name: i.product_details.title,
      price: Number(i.product_details.price),
      quantity: i.quantity,
      image: (i.product_details as any).images?.[0]?.image,
    })),
    total: Number(o.grand_total) - Number(o.shipping_fee || 0),
    shippingFee: o.shipping_fee ? Number(o.shipping_fee) : undefined,
    time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    address: o.shipping_address || undefined,
    created_at: o.created_at,
  });

  // Card 2: Shipping Notification
  if (o.shipping_fee && Number(o.shipping_fee) > 0) {
    let shipStatus = 'Awaiting Payment';
    if (['paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
      shipStatus = 'Paid';
    }
    systemMsgs.push({
      id: 'shipping_card',
      type: 'shipping_notification',
      sender: 'vendor',
      vendor: vName,
      status: shipStatus,
      items: [],
      total: Number(o.grand_total),
      shippingFee: Number(o.shipping_fee),
      time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: o.created_at,
    });
  }

  // Card 3: Payment Success
  if (['paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
    systemMsgs.push({
      id: 'payment_success_card',
      type: 'payment_success',
      sender: 'user',
      vendor: vName,
      status: 'Paid',
      items: [],
      total: 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      created_at: new Date().toISOString(),
    });
  }

  // Append Text Threads
  const textMsgs: Message[] = textThreads.map(msg => ({
    id: msg.id,
    type: 'text' as const,
    sender: msg.sender === currentUserId ? 'user' : 'vendor',
    vendor: vName,
    status: '',
    items: [],
    total: 0,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: msg.content,
    created_at: msg.created_at,
  }));

  // Sort all by time
  return [...systemMsgs, ...textMsgs].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}
