'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface SalesChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  delay?: number;
}

export default function SalesChart({ title, data, delay = 0 }: SalesChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass border-white/10 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E31B23" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#E31B23" stopOpacity={0.2} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <XAxis 
              dataKey="name" 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#333' }}
            />
            
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              axisLine={{ stroke: '#333' }}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(227, 27, 35, 0.3)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#E31B23' }}
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={false}
              filter="url(#glow)"
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}