import type { Order } from '@/lib/api';

/* ─────────────── Types ─────────────── */
export interface ChatOrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  originalQuantity?: number;
  originalPrice?: number;
}

export type MessageKind =
  | 'order'
  | 'text'
  | 'changes'
  | 'accepted'
  | 'payment'
  | 'shipped'
  | 'delivered'
  | 'rejected'
  | 'disputed';

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
  awaiting?: 'vendor' | 'customer' | 'payment' | 'delivery' | 'post';
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

const PAID_STATUSES = ['paid', 'shipped', 'delivered', 'completed'];
const SHIPPED_STATUSES = ['shipped', 'delivered', 'completed'];
const DELIVERED_STATUSES = ['delivered', 'completed'];

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
  const extra = o as unknown as { rejection_reason?: string; dispute_reason?: string };
  const vendorName = o.vendor_name || 'Vendor';
  const deliveryFee = Number(o.shipping_fee) || 0;
  const total = Number(o.grand_total) || 0;
  const subtotal = Math.max(0, total - deliveryFee);
  const baseTime = new Date(o.created_at).getTime() || Date.now();

  // Synthetic, ascending timestamps so the timeline reads in order (the API
  // does not return per-event timestamps).
  let step = 0;
  const nextAt = () => {
    const at = baseTime + step * 60_000;
    step += 1;
    return new Date(at).toISOString();
  };
  const atTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const events: ChatMessage[] = [];
  const push = (msg: Omit<ChatMessage, 'time' | 'created_at'>) => {
    const created_at = nextAt();
    events.push({ ...msg, created_at, time: atTime(created_at) });
  };

  const totals = {
    subtotal,
    deliveryFee: deliveryFee || undefined,
    total,
    address: o.shipping_address || undefined,
  };

  // 1. Order request (immutable)
  push({
    id: 'order_card',
    kind: 'order',
    from: 'customer',
    items: toItems(o),
    ...totals,
    awaiting: o.status === 'pending_vendor_review' ? 'vendor' : undefined,
  });

  // 2. Vendor proposed changes
  if (o.status === 'pending_customer_approval') {
    push({ id: 'changes_card', kind: 'changes', from: 'vendor', items: toItems(o, true), ...totals, awaiting: 'customer' });
  }

  // 3. Vendor accepted
  if (ACCEPTED_STATUSES.includes(o.status)) {
    push({
      id: 'accepted_card',
      kind: 'accepted',
      from: 'vendor',
      items: toItems(o),
      ...totals,
      awaiting: ['awaiting_payment', 'awaiting_shipping_details', 'shipping_set'].includes(o.status)
        ? 'payment'
        : undefined,
    });
  }

  // 4. Payment received
  if (PAID_STATUSES.includes(o.status)) {
    push({ id: 'payment_card', kind: 'payment', from: 'system', total });
  }

  // 5. Shipped
  if (SHIPPED_STATUSES.includes(o.status)) {
    push({
      id: 'shipped_card',
      kind: 'shipped',
      from: 'vendor',
      awaiting: o.status === 'shipped' ? 'delivery' : undefined,
    });
  }

  // 6. Delivered
  if (DELIVERED_STATUSES.includes(o.status)) {
    push({
      id: 'delivered_card',
      kind: 'delivered',
      from: 'system',
      awaiting: o.status === 'disputed' ? undefined : 'post',
    });
  }

  // 7. Declined
  if (o.status === 'cancelled') {
    push({ id: 'rejected_card', kind: 'rejected', from: 'vendor', reason: extra.rejection_reason || 'This order could not be fulfilled.' });
  }

  // 8. Disputed
  if (o.status === 'disputed') {
    push({ id: 'disputed_card', kind: 'disputed', from: 'customer', reason: extra.dispute_reason || 'A dispute was raised for this order.' });
  }

  // Chat text interleaved by real time.
  const textMsgs: ChatMessage[] = textThreads.map((msg) => ({
    id: msg.id,
    kind: 'text' as const,
    from: msg.sender === currentUserId ? 'customer' : 'vendor',
    text: msg.content,
    time: atTime(new Date(msg.created_at).toISOString()),
    created_at: msg.created_at,
  }));

  return [...events, ...textMsgs].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}
