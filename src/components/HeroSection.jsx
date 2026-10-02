import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Sparkles, Heart, Sprout, Calendar, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  const { activePlant, handleWaterNow, isWateringActive } = usePlantiva();

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[var(--color-bg-surface)] via-[var(--color-bg-surface-elevated)] to-[var(--color-bg-surface)] border border-[var(--color-border)]"
    >
      {/* FLOATING BOTANICAL PARTICLES & SUNLIGHT */}
      <div className="absolute -right-6 -bottom-6 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 top-0 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* LEFT GREETING TEXT */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="pulse-emerald">
              <span className="dot-pulse" />
              <span>🌱 Thriving & Healthy</span>
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)] flex items-center gap-1.5 font-mono">
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>{activePlant?.careStreakDays || 14}-day care streak!</span>
            </span>
          </div>

          <div>
            <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[var(--color-text-main)] leading-tight">
              Good morning, Plant Parent 🌿
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-1 font-medium">
              Your little garden is growing beautifully.
            </p>
          </div>

          {/* ACTIVE PLANT SUMMARY TAGS */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs">
              <span className="text-2xl">{activePlant?.iconEmoji || '🍅'}</span>
              <div>
                <div className="text-xs font-extrabold text-[var(--color-text-main)]">
                  {activePlant?.nickname || activePlant?.name}
                </div>
                <div className="text-[10px] text-[var(--color-text-muted)]">
                  {activePlant?.species}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--color-emerald-subtle)] border border-emerald-500/20">
              <Sprout size={16} className="text-[var(--color-emerald-main)]" />
              <div>
                <div className="text-[9px] uppercase font-bold tracking-wider text-[var(--color-text-subtle)]">
                  GROWTH STAGE
                </div>
                <div className="text-xs font-bold text-[var(--color-emerald-main)]">
                  {activePlant?.growthStage}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleWaterNow(5)}
              disabled={isWateringActive}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white text-xs font-extrabold shadow-md transition-all ml-auto sm:ml-0"
            >
              <Droplets size={15} />
              <span>{isWateringActive ? 'Watering...' : 'Give Morning Drink 💧'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT BREATHING PLANT VISUAL */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 1.5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative w-44 h-44 md:w-48 md:h-48 rounded-3xl bg-gradient-to-tr from-[var(--color-emerald-subtle)] via-[var(--color-bg-surface-elevated)] to-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center shadow-lg group"
          >
            <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
              {activePlant?.iconEmoji || '🪴'}
            </span>
            <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs">
              <Sparkles size={14} className="text-amber-500 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
