import type { OrderStatus } from './api/types';

/** Customer-facing tracking steps, in order. */
export const ORDER_STEPS = [
  { key: 'accepted', label: 'Order accepted' },
  { key: 'paid', label: 'Payment received' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
] as const;

export type OrderStepKey = (typeof ORDER_STEPS)[number]['key'];

/**
 * Index of the *current* step for a status. Everything before it is complete.
 * -1 means the vendor hasn't accepted yet (or the order ended).
 */
export function currentStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'pending_vendor_review':
    case 'cancelled':
    case 'disputed':
      return -1;
    case 'pending_customer_approval':
    case 'awaiting_shipping_details':
    case 'shipping_set':
    case 'awaiting_payment':
      return 0;
    case 'paid':
      return 2;
    case 'shipped':
      return 3;
    case 'delivered':
    case 'completed':
      return 4;
    default:
      return -1;
  }
}

/** Short human label for an order status (customer-facing). */
export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending_vendor_review':
      return 'Waiting for vendor';
    case 'pending_customer_approval':
      return 'Review vendor changes';
    case 'awaiting_shipping_details':
      return 'Delivery details needed';
    case 'shipping_set':
      return 'Delivery fee set';
    case 'awaiting_payment':
      return 'Ready to pay';
    case 'paid':
      return 'Paid — processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'disputed':
      return 'Under dispute';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

/** Vendor rejection reasons offered in the Reject sheet. */
export const REJECTION_REASONS = [
  'Out of stock',
  'Price changed',
  'Delivery unavailable',
  'Cannot fulfill request',
  'Other',
] as const;

export type RejectionReason = (typeof REJECTION_REASONS)[number];

/** Default delivery fee suggested to the vendor (they can change it). */
export const SUGGESTED_SHIPPING_FEE = 1500;

export const money = (value: number) => `₦${Math.max(0, Math.round(value)).toLocaleString('en-NG')}`;
