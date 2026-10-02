import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { HeartPulse, CheckCircle2, ShieldCheck, Sparkles, Droplets, Thermometer, Sun, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlantHealthCard = () => {
  const { activePlant } = usePlantiva();
  const score = activePlant?.healthScore || 92;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const indicators = [
    { label: '💧 Hydration', value: 'Comfortably Hydrated (48%)', status: 'Optimal', icon: Droplets },
    { label: '🌡 Comfort', value: 'Perfect Temperature (27.4°C)', status: 'Cozy', icon: Thermometer },
    { label: '☀️ Environment', value: 'Airflow & Light Balanced', status: 'Healthy', icon: Sun },
    { label: '🌿 Nutrition', value: 'Nourished & Feeding', status: 'Balanced', icon: Sprout }
  ];

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between">
      {/* AMBIENT BOTANICAL GLOW */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-[var(--color-emerald-main)]">
            <HeartPulse size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              Plant Wellness & Vitality
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Your {activePlant?.name || 'tomato'} plant is growing beautifully 🌿
            </p>
          </div>
        </div>

        <span className="pulse-emerald">
          <ShieldCheck size={14} />
          <span>THRIVING</span>
        </span>
      </div>

      {/* CENTRAL WELLNESS SCORE RING */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-2">
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 md:w-40 md:h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-[var(--color-border-subtle)] fill-none"
                strokeWidth="10"
              />
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center text-center">
              <span className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--color-text-main)]">
                {score}%
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-emerald-main)] mt-0.5">
                THRIVING
              </span>
            </div>
          </div>

          <p className="text-xs font-bold text-[var(--color-text-muted)] mt-3 text-center">
            "{activePlant?.name || 'Sunny'} is feeling fantastic today 💚"
          </p>
        </div>

        {/* WELLNESS INDICATORS */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {indicators.map((ind, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] flex flex-col gap-1 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[var(--color-text-subtle)]">
                <span>{ind.label}</span>
                <CheckCircle2 size={13} className="text-[var(--color-emerald-main)]" />
              </div>
              <div className="text-xs font-bold text-[var(--color-text-main)]">
                {ind.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium">
        <Sparkles size={14} className="text-[var(--color-emerald-main)]" />
        <span>Root hydration and leaf vitality are in perfect equilibrium. You're doing a great job, Plant Parent 💚</span>
      </div>
    </div>
  );
};
