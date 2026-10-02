import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Sparkles, Heart, Sprout, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const MarketingBanner = () => {
  const { handleWaterNow, isWateringActive } = usePlantiva();

  const benefits = [
    { text: 'Healthier plants', icon: '🌱' },
    { text: 'Smarter watering', icon: '💧' },
    { text: 'Better nourishment', icon: '🧪' },
    { text: 'Understand your plant', icon: '📊' },
    { text: 'Less worry', icon: '💚' },
    { text: 'More beautiful growth', icon: '🌿' }
  ];

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[var(--color-bg-surface-elevated)] via-[var(--color-bg-surface)] to-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]">
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        <div className="lg:col-span-8 space-y-3">
          <span className="pulse-emerald">
            <Sparkles size={13} />
            <span>SMART PLANT CARE FOR PLANT LOVERS</span>
          </span>

          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--color-text-main)] leading-tight">
            Give your plants the care they deserve 💚
          </h2>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] font-medium max-w-xl">
            Smart technology designed with love for home gardeners. Keep your living companions comfortably hydrated and nourished every day.
          </p>

          {/* BENEFITS CHIPS */}
          <div className="flex flex-wrap gap-2 pt-2">
            {benefits.map((b) => (
              <span
                key={b.text}
                className="px-3 py-1.5 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] text-xs font-bold text-[var(--color-text-main)] shadow-xs flex items-center gap-1.5"
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
          <button
            onClick={() => handleWaterNow(5)}
            disabled={isWateringActive}
            className="px-6 py-3.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group"
          >
            <Heart size={16} />
            <span>CARE FOR MY PLANT</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
