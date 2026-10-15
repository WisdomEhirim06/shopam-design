'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { authService, ordersService, productsService } from '@/lib/api';
import type { Order, ProductService } from '@/lib/api';
import { money } from '@/lib/order-steps';
import BalanceCard from './components/BalanceCard';
import { TRANSACTIONS } from './earnings/data';

function statusLabel(s: string) {
  switch (s) {
    case 'pending_vendor_review': return 'New request';
    case 'pending_customer_approval': return 'Changes sent';
    case 'awaiting_shipping_details': return 'Awaiting details';
    case 'shipping_set': return 'Fee set';
    case 'awaiting_payment': return 'Awaiting payment';
    case 'paid': return 'Paid';
    case 'shipped': return 'Shipped';
    case 'disputed': return 'Disputed';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Declined';
    default: return s;
  }
}

export default function VendorHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ProductService[]>([]);

  useEffect(() => {
    ordersService.getVendorOrders().then((r) => setOrders(r.results.slice(0, 3))).catch(() => {});
    productsService.getMyProducts().then((r) => setProducts(Array.isArray(r) ? r : [])).catch(() => {});
  }, []);

  const user = authService.getCurrentUser();
  const firstName = user?.first_name || 'Vendor';
  const lowStock = products.filter((p) => Number((p as unknown as { stock?: number }).stock ?? 0) <= 5).length;
  const hasProducts = products.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight text-ink">Welcome back, {firstName}</h2>
        <Link href="/dashboard/products" className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FA3728] sm:flex">
          <Package size={15} /> Add product
        </Link>
      </div>

      {/* Balance */}
      <BalanceCard />

      {/* Inventory */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Inventory</h3>
          {hasProducts && (
            <Link href="/dashboard/products" className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#FA3728]">
              Manage <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {!hasProducts ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <Package size={22} />
            </span>
            <p className="text-sm font-bold text-ink">Add your first product to start selling</p>
            <p className="text-xs text-slate-600">Create a listing and it&rsquo;ll appear on your shop instantly.</p>
            <Link href="/dashboard/products" className="mt-1 rounded-full bg-[#FA3728] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E31B23]">
              Add product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-2xl font-black text-ink">{products.length}</p>
              <p className="mt-0.5 text-xs text-slate-600">Total products</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <p className="text-2xl font-black text-ink">{lowStock}</p>
              <p className="mt-0.5 text-xs text-slate-600">Low stock</p>
            </div>
          </div>
        )}
      </section>

      {/* Recent orders */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Recent orders</h3>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#FA3728]">
            All orders <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {orders.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-600">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <Link key={order.id} href="/dashboard/orders" className="flex items-center justify-between border-b border-slate-50 px-4 py-3.5 last:border-0 hover:bg-slate-50/60">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-ink">{order.vendor_name || 'Buyer'}</p>
                  <p className="text-[11px] text-slate-600">{statusLabel(order.status)}</p>
                </div>
                <span className="text-[13px] font-bold text-ink">{money(Number(order.grand_total) || 0)}</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Recent transactions</h3>
          <Link href="/dashboard/earnings/transactions" className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#FA3728]">
            See more <ArrowRight size={13} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          {TRANSACTIONS.slice(0, 4).map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-slate-50 px-4 py-3.5 last:border-0">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{t.label}</p>
                <p className="text-[11px] text-slate-600">{t.date}</p>
              </div>
              <span className={`text-[13px] font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                {t.amount >= 0 ? '+' : ''}{money(Math.abs(t.amount))}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
