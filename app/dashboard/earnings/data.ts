export const BALANCE = { available: 182500, pending: 93500, total: 452000 };

export interface Transaction {
  id: number;
  label: string;
  amount: number;
  date: string;
}

export const TRANSACTIONS: Transaction[] = [
  { id: 1, label: 'Order #101 settled', amount: 8400, date: 'Today, 14:20' },
  { id: 2, label: 'Order #98 settled', amount: 12500, date: 'Yesterday' },
  { id: 3, label: 'Platform fee', amount: -900, date: 'Yesterday' },
  { id: 4, label: 'Payout to bank', amount: -40000, date: 'Oct 12' },
  { id: 5, label: 'Order #91 settled', amount: 22000, date: 'Oct 10' },
  { id: 6, label: 'Order #88 settled', amount: 15600, date: 'Oct 8' },
  { id: 7, label: 'Order #84 settled', amount: 7300, date: 'Oct 5' },
  { id: 8, label: 'Platform fee', amount: -1100, date: 'Oct 4' },
];
