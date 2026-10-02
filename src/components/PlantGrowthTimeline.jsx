import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Sprout, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlantGrowthTimeline = () => {
  const { activePlant } = usePlantiva();

  const stages = [
    { label: 'Seedling', icon: '🌱', desc: 'Sprout & Root Base' },
    { label: 'Vegetative', icon: '🌿', desc: 'Canopy & Leaf Expansion' },
    { label: 'Flowering', icon: '🌼', desc: 'Bud Bloom & Nectar' },
    { label: 'Fruiting', icon: '🍅', desc: 'Fruit Set & Ripening' }
  ];

  const currentIdx = activePlant?.growthStageIndex !== undefined ? activePlant.growthStageIndex : 2;

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-[var(--color-emerald-main)]">
            <Sprout size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              Plant Growth Journey
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Growing for {activePlant?.ageDays || 55} days • {activePlant?.careStreakDays || 14}-day thriving streak 💚
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-emerald-subtle)] text-[var(--color-emerald-main)] text-xs font-bold font-mono">
          <Sparkles size={12} />
          <span>Stage: {stages[currentIdx]?.label}</span>
        </span>
      </div>

      {/* STAGE CONNECTOR PIPELINE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4 relative">
        {stages.map((stg, idx) => {
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <motion.div
              key={stg.label}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isCurrent
                  ? 'bg-[var(--color-emerald-subtle)] border-[var(--color-emerald-main)] shadow-md shadow-emerald-500/10 scale-102'
                  : isPassed
                  ? 'bg-[var(--color-bg-surface-elevated)] border-[var(--color-border-subtle)] opacity-80'
                  : 'bg-[var(--color-bg-surface-elevated)] border-[var(--color-border-subtle)] opacity-40'
              }`}
            >
              <div className="text-3xl mb-2">{stg.icon}</div>
              <div className="flex items-center gap-1 text-xs font-extrabold text-[var(--color-text-main)]">
                <span>{stg.label}</span>
                {isPassed && <CheckCircle2 size={13} className="text-emerald-500" />}
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)] font-medium mt-1">
                {stg.desc}
              </span>
              {isCurrent && (
                <span className="mt-2 px-2 py-0.5 rounded-full bg-[var(--color-emerald-main)] text-white text-[9px] font-bold uppercase tracking-wider">
                  ACTIVE NOW
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* MILESTONES FOOTER */}
      {activePlant?.milestones && (
        <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" />
            <span>Latest Milestone: <strong>{activePlant.milestones[activePlant.milestones.length - 1]}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
