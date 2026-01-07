'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">View detailed insights and performance metrics</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass border-white/10 rounded-xl p-12 text-center"
      >
        <div className="inline-flex p-6 bg-crimson/20 rounded-2xl mb-6">
          <BarChart3 size={48} className="text-crimson" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Analytics Dashboard</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          COMING SOON:
          This page will provide comprehensive analytics with charts, graphs, and key performance indicators.
        </p>
      </motion.div>
    </div>
  );
}