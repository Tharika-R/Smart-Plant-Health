import React from 'react';
import { Camera, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlantVisionHero = ({ onStartScan }) => {
  const benefits = [
    { text: 'Understand visible plant stress', icon: '🌿' },
    { text: 'Check your plant anytime', icon: '📷' },
    { text: 'Combine image insights with soil conditions', icon: '💧' },
    { text: 'Make better care decisions', icon: '🧪' },
    { text: 'Track plant health over time', icon: '📈' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[var(--color-bg-surface-elevated)] via-[var(--color-bg-surface)] to-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]"
    >
      <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        <div className="lg:col-span-8 space-y-3">
          <span className="pulse-emerald">
            <Sparkles size={13} />
            <span>AI PLANT VISION DOCTOR</span>
          </span>

          <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[var(--color-text-main)] leading-tight">
            Your plant can't tell you what's wrong. Now it can show you. 🌿
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)] font-medium max-w-xl">
            Use AI-powered visual analysis together with real sensor data to understand your plant better. Give your companion a quick health check anytime!
          </p>

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
            onClick={onStartScan}
            className="px-6 py-3.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group"
          >
            <Camera size={18} />
            <span>CHECK MY PLANT</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
