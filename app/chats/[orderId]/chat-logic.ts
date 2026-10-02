import type { Order } from '@/lib/api';

/* ─────────────── Types ─────────────── */
export interface ChatOrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  /** Vendor-proposed values, when a modification is pending review. */
  originalQuantity?: number;
  originalPrice?: number;
}

export type MessageKind =
  | 'order'
  | 'text'
  | 'changes'
  | 'rejected'
  | 'accepted'
  | 'payment';

export interface ChatMessage {
  id: string | number;
  kind: MessageKind;
  from: 'customer' | 'vendor' | 'system';
  time: string;
  created_at?: string;
  text?: string;
  items?: ChatOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  address?: string;
  reason?: string;
  /** What the viewer is waiting on, used to render the right call-to-action. */
  awaiting?: 'vendor' | 'customer' | 'payment';
}

/* ─────────────── Helpers ─────────────── */
const ACCEPTED_STATUSES = [
  'pending_customer_approval',
  'awaiting_shipping_details',
  'shipping_set',
  'awaiting_payment',
  'paid',
  'shipped',
  'delivered',
  'completed',
];

function toItems(order: Order, useProposal = false): ChatOrderItem[] {
  return order.items.map((item) => {
    const unit = Number(item.product_details.price) || 0;
    const proposedQty = useProposal ? item.vendor_proposed_quantity ?? undefined : undefined;
    return {
      name: item.product_details.title,
      price: unit,
      quantity: useProposal && proposedQty ? proposedQty : item.quantity,
      image: item.product_details.images?.[0]?.image_url,
      variant: item.variant ?? undefined,
      originalQuantity: proposedQty ? item.quantity : undefined,
      originalPrice: proposedQty ? unit : undefined,
    };
  });
}

/* ─────────────── Message builder ─────────────── */
export function buildMessagesUI(
  o: Order,
  textThreads: { id: string; sender: string; content: string; created_at: string }[],
  currentUserId: string | undefined
): ChatMessage[] {
  const vName = o.vendor_name || 'Vendor';
  const deliveryFee = Number(o.shipping_fee) || 0;
  const total = Number(o.grand_total) || 0;
  const subtotal = Math.max(0, total - deliveryFee);
  const stamp = new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const systemMsgs: ChatMessage[] = [];

  const base = {
    time: stamp,
    created_at: o.created_at,
    subtotal,
    deliveryFee: deliveryFee || undefined,
    total,
    address: o.shipping_address || undefined,
  };

  // The order proposal card (always present).
  systemMsgs.push({
    id: 'order_card',
    kind: 'order',
    from: 'customer',
    items: toItems(o),
    ...base,
    awaiting: o.status === 'pending_vendor_review' ? 'vendor' : undefined,
  });

  // Vendor proposed changes — waiting on the customer.
  if (o.status === 'pending_customer_approval') {
    systemMsgs.push({
      id: 'changes_card',
      kind: 'changes',
      from: 'vendor',
      items: toItems(o, true),
      ...base,
      awaiting: 'customer',
    });
  }

  // Vendor accepted the order.
  if (ACCEPTED_STATUSES.includes(o.status)) {
    systemMsgs.push({
      id: 'accepted_card',
      kind: 'accepted',
      from: 'vendor',
      items: toItems(o),
      ...base,
      awaiting: ['awaiting_payment', 'awaiting_shipping_details', 'shipping_set'].includes(o.status)
        ? 'payment'
        : undefined,
    });
  }

  // Rejected / cancelled.
  if (o.status === 'cancelled') {
    systemMsgs.push({
      id: 'rejected_card',
      kind: 'rejected',
      from: 'vendor',
      ...base,
      reason: (o as unknown as { rejection_reason?: string }).rejection_reason || 'This order could not be fulfilled.',
    });
  }

  // Payment received.
  if (['paid', 'shipped', 'delivered', 'completed'].includes(o.status)) {
    systemMsgs.push({
      id: 'payment_card',
      kind: 'payment',
      from: 'system',
      time: stamp,
      created_at: o.created_at,
      total,
    });
  }

  // Append the text thread.
  const textMsgs: ChatMessage[] = textThreads.map((msg) => ({
    id: msg.id,
    kind: 'text' as const,
    from: msg.sender === currentUserId ? 'customer' : 'vendor',
    text: msg.content,
    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    created_at: msg.created_at,
  }));

  return [...systemMsgs, ...textMsgs].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}
