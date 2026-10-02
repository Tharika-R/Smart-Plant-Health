import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Droplets, FlaskConical, TrendingUp, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatCard = () => {
  const { stats } = usePlantiva();

  const metrics = [
    { label: 'Water Used (Week)', val: stats.waterUsedWeekLiters, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Fertilizer Dosed', val: stats.fertilizerUsedMl, icon: FlaskConical, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Water Savings', val: stats.waterSavingsPct, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Health Average', val: stats.healthAvgPct, icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="glass-card p-4 flex items-center gap-3.5 hover:border-[var(--color-border-active)] transition-all"
          >
            <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={item.color} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                {item.label}
              </span>
              <div className="font-serif text-lg font-extrabold text-[var(--color-text-main)] font-mono">
                {item.val}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
