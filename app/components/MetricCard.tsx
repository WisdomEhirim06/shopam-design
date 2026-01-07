'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'success' | 'danger' | 'warning';
  };
  variant?: 'default' | 'crimson' | 'dark';
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  badge,
  variant = 'default',
  delay = 0,
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'crimson':
        return {
          background: 'var(--primary-red-light)',
          borderColor: 'var(--primary-red)',
        };
      case 'dark':
        return {
          background: 'var(--card-bg)',
          borderColor: 'var(--border-primary)',
        };
      default:
        return {
          background: 'var(--card-bg)',
          borderColor: 'var(--border-primary)',
        };
    }
  };

  const getBadgeStyles = (badgeVariant: 'success' | 'danger' | 'warning') => {
    switch (badgeVariant) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'danger':
        return {
          backgroundColor: 'var(--primary-red-light)',
          color: 'var(--primary-red)',
          borderColor: 'var(--primary-red)',
        };
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 rounded-xl border transition-all hover:scale-[1.02]"
      style={{
        ...getVariantStyles(),
        boxShadow: variant === 'crimson' ? 'var(--primary-red-glow)' : 'none'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
        {badge && (
          <span 
            className={`px-2 py-1 rounded text-xs font-medium border ${
              badge.variant === 'success' || badge.variant === 'warning' ? getBadgeStyles(badge.variant) as string : ''
            }`}
            style={badge.variant === 'danger' ? getBadgeStyles(badge.variant) as React.CSSProperties : {}}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <p 
          className="text-3xl font-bold" 
          style={{ color: variant === 'crimson' ? 'var(--primary-red)' : 'var(--text-primary)' }}
        >
          {value}
        </p>
        
        {(change || subtitle) && (
          <div className="flex items-center gap-2">
            {change && (
              <span className={`
                text-sm font-medium
                ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}
              `}>
                {change}
              </span>
            )}
            {subtitle && (
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}