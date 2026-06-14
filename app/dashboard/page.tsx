'use client';

import { motion } from 'framer-motion';
import { Wallet, ShoppingBag, Package } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleCookie } from '@/lib/api/auth';
import { authService } from '@/lib/api';

export default function DashboardHome() {
  const [userName, setUserName] = useState('User');
  const router = useRouter();
  const role = getRoleCookie();

  if (role !== 'vendor') {
    router.push('/explore');
  }

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && user.first_name) {
      setUserName(user.first_name);
    }
  }, []);

  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Hello, {userName}
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">Here's your store overview</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Total Sales */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 flex-1"
        >
          <div className="w-12 h-12 bg-red-50 text-[#FA3728] rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Total Sales</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-400">—</p>
            </div>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 flex-1"
        >
          <div className="w-12 h-12 bg-red-50 text-[#FA3728] rounded-xl flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Orders</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-400">—</p>
            </div>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 flex-1"
        >
          <div className="w-12 h-12 bg-red-50 text-[#FA3728] rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={24} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-0.5">Products</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-400">—</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-[#FA3728] text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {/* Order 1 */}
          <Link href="/dashboard/orders" className="block bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FA3728] text-white flex items-center justify-center font-bold flex-shrink-0">
                M
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-gray-900 truncate pr-4 text-sm md:text-base">Mama Nkechi Kitchen</h3>
                  <span className="font-bold text-gray-900 text-sm md:text-base">₦3,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">Jollof Rice Platter × 1</p>
                  <span className="text-[10px] font-bold text-[#FA3728] bg-red-50 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Order 2 */}
          <Link href="/dashboard/orders" className="block bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-gray-900 truncate pr-4 text-sm md:text-base">Adaeze M.</h3>
                  <span className="font-bold text-gray-900 text-sm md:text-base">₦28,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">African Print Dress × 1</p>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Order 3 */}
          <Link href="/dashboard/orders" className="block bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-red-100 hover:shadow-md transition-all">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                T
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-gray-900 truncate pr-4 text-sm md:text-base">Tunde K.</h3>
                  <span className="font-bold text-gray-900 text-sm md:text-base">₦25,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">Basket Set × 2</p>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}