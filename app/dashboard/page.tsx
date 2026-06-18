'use client';

import { motion } from 'framer-motion';
import { Wallet, ShoppingBag, Package, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRoleCookie } from '@/lib/api/auth';
import { authService } from '@/lib/api';

export default function DashboardHome() {
  const [userName, setUserName] = useState('Vendor');
  const router = useRouter();

  useEffect(() => {
    // Check the role only when mounted in the browser
    const role = getRoleCookie();
    console.log('[DASHBOARD PAGE] User role from cookie:', role);
    
    if (role !== 'vendor') {
      router.push('/explore');
    }
  }, [router]);

  useEffect(() => {
    // Fetch the user's name to personalize the dashboard
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.first_name) {
          setUserName(user.first_name);
        } else if (user?.username) {
          setUserName(user.username);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="px-4 py-2 md:p-8 space-y-6 max-w-lg mx-auto md:max-w-none">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Hello, {userName}
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">Here is what is happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-gray-700">Store Active</span>
        </div>
      </motion.div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Sales */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-red-50 text-[#FA3728] rounded-xl flex items-center justify-center flex-shrink-0">
              <Wallet size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
              <TrendingUp size={14} /> +12.5%
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Sales</p>
            <p className="text-2xl font-black text-gray-900">₦0.00</p>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
              <TrendingUp size={14} /> +5.2%
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Orders</p>
            <p className="text-2xl font-black text-gray-900">0</p>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={20} />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Products</p>
            <p className="text-2xl font-black text-gray-900">0</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Your earnings over the last 7 days</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-3 py-1.5 outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 min-h-[200px] text-gray-400">
            <BarChart3 size={40} className="mb-2 opacity-50" />
            <p className="font-medium text-sm">Not enough data to display chart</p>
            <p className="text-xs mt-1">Share your store link to get your first sale!</p>
          </div>
        </motion.div>

        {/* Recent Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="flex items-center gap-1 text-[#FA3728] text-sm font-semibold hover:text-[#E31B23] transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {/* Order 1 */}
            <Link href="/dashboard/orders" className="block bg-gray-50 rounded-xl p-3 border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FA3728] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  M
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate pr-2 text-sm group-hover:text-[#FA3728] transition-colors">Mama Nkechi</h3>
                    <span className="font-bold text-gray-900 text-sm">₦3,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500 truncate">Jollof Rice Platter × 1</p>
                    <span className="text-[9px] font-bold text-[#FA3728] bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Order 2 */}
            <Link href="/dashboard/orders" className="block bg-gray-50 rounded-xl p-3 border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  A
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate pr-2 text-sm group-hover:text-[#FA3728] transition-colors">Adaeze M.</h3>
                    <span className="font-bold text-gray-900 text-sm">₦28,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500 truncate">African Print Dress × 1</p>
                    <span className="text-[9px] font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Order 3 */}
            <Link href="/dashboard/orders" className="block bg-gray-50 rounded-xl p-3 border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  T
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate pr-2 text-sm group-hover:text-[#FA3728] transition-colors">Tunde K.</h3>
                    <span className="font-bold text-gray-900 text-sm">₦25,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-500 truncate">Basket Set × 2</p>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}