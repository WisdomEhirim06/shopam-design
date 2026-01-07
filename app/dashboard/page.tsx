'use client';

import MetricCard from '../components/MetricCard';
import SalesChart from '../components/SalesChart';
import ProductTable from '../components/ProductTable';
import { motion } from 'framer-motion';

// Sample data for sales charts
const salesData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 15000 },
  { name: 'Mar', value: 18000 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 25300 },
];

const revenueData = [
  { name: 'Jan', value: 8000 },
  { name: 'Feb', value: 11000 },
  { name: 'Mar', value: 14000 },
  { name: 'Apr', value: 19000 },
  { name: 'May', value: 23000 },
];

// Sample product data
const topProducts = [
  {
    id: '1',
    name: 'African Print Dress',
    image: '/products/dress.jpg',
    category: 'Dress',
    activeProducts: 10,
    sales: 380,
    stock: 15,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Pattern Basket Set',
    image: '/products/basket.jpg',
    category: 'Home Decor',
    activeProducts: 8,
    sales: 256,
    stock: 23,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Ankara Headwrap',
    image: '/products/headwrap.jpg',
    category: 'Accessories',
    activeProducts: 15,
    sales: 198,
    stock: 42,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Kente Cloth Scarf',
    image: '/products/scarf.jpg',
    category: 'Accessories',
    activeProducts: 12,
    sales: 167,
    stock: 18,
    status: 'Active',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Overview</h1>
        <p className="text-gray-400">Welcome back, Sarah! Here's what's happening with your store today.</p>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sales"
          value="$25,300"
          change="+12% this month"
          changeType="positive"
          subtitle="+106%"
          variant="crimson"
          delay={0}
        />
        
        <MetricCard
          title="Total Orders"
          value="458"
          change="+8% this month"
          changeType="positive"
          subtitle="+26"
          variant="dark"
          delay={0.1}
        />
        
        <MetricCard
          title="African Pattern Basket Set"
          value="120"
          subtitle="In sold"
          badge={{ text: 'Selling', variant: 'danger' }}
          variant="dark"
          delay={0.2}
        />
        
        <MetricCard
          title="Atinuke Cloth Scarf"
          value="$4,150"
          subtitle="Due Tomorrow"
          badge={{ text: 'Due Tomorrow', variant: 'danger' }}
          variant="dark"
          delay={0.3}
        />
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart
          title="Sales Over Time"
          data={salesData}
          delay={0.4}
        />
        
        <SalesChart
          title="Revenue Trend"
          data={revenueData}
          delay={0.5}
        />
      </div>

      {/* Top Performing Products Table */}
      <ProductTable products={topProducts} />

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="text-crimson hover:text-crimson/80 text-sm font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-crimson/20 to-orange-500/20"></div>
                <div>
                  <p className="font-medium">African Print Dress</p>
                  <p className="text-sm text-gray-400">Order #3609</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$78</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}