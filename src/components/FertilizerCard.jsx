import React, { useState } from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { FertilizerAnimationModal } from './FertilizerAnimation';
import { FlaskConical, Sparkles, ShieldCheck, Heart, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export const FertilizerCard = () => {
  const { activePlant, handleDispenseFertilizer } = usePlantiva();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plantName = activePlant?.name || 'Sunny';
  const growthStage = activePlant?.growthStage || 'Flowering';
  const reason = activePlant?.fertilizerReason || 'These nutrients support healthy flowering and fruit development as your plant enters its bloom phase.';
  const doseMl = activePlant?.recommendedDoseMl || 5;

  const npk = activePlant?.npkBreakdown || { n: 65, p: 85, k: 90 };
  const currentMoisture = activePlant?.soilMoisture || 48;

  const handleCompleteDispense = async () => {
    setIsModalOpen(false);
    await handleDispenseFertilizer(doseMl);
  };

  return (
    <>
      <div className="glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* AMBIENT NOURISHMENT GLOW */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500">
              <Sprout size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
                Plant Nourishment 🌿
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Targeted organic feed tailored to growth stages
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
            <Sparkles size={12} />
            <span>ORGANIC NOURISHMENT</span>
          </span>
        </div>

        {/* PLANT & STAGE GUIDANCE */}
        <div className="p-4 mb-6 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Target Companion:</span>
            <span className="font-bold text-[var(--color-text-main)]">{plantName} ({activePlant?.plantType})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Growth Stage:</span>
            <span className="font-bold text-[var(--color-emerald-main)]">{growthStage}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-muted)]">Recommended Blend:</span>
            <span className="font-bold text-amber-500">Phosphorus + Potassium</span>
          </div>
          <div className="pt-2 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
            <strong>Why?</strong> "{reason}"
          </div>
        </div>

        {/* N - P - K NUTRIENT VISUALIZATION BARS */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider">
            🌱 RECOMMENDED NOURISHMENT BLEND
          </div>

          {/* NITROGEN (N) */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className="text-[var(--color-text-muted)]">N (Nitrogen - Leaf Canopy)</span>
              <span>{npk.n}%</span>
            </div>
            <div className="w-full h-3.5 bg-[var(--color-bg-surface-elevated)] rounded-full overflow-hidden border border-[var(--color-border-subtle)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${npk.n}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-blue-500/70 rounded-full"
              />
            </div>
          </div>

          {/* PHOSPHORUS (P) - HIGHLIGHTED */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold font-mono text-amber-500">
              <span className="flex items-center gap-1">
                <span>P (Phosphorus - Root & Flower)</span>
                <Sparkles size={12} />
              </span>
              <span>{npk.p}% ★</span>
            </div>
            <div className="w-full h-3.5 bg-[var(--color-bg-surface-elevated)] rounded-full overflow-hidden border border-amber-500/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${npk.p}%` }}
                transition={{ duration: 1, delay: 0.1 }}
                className="h-full bg-amber-500 rounded-full shadow-xs shadow-amber-500/30"
              />
            </div>
          </div>

          {/* POTASSIUM (K) - HIGHLIGHTED */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold font-mono text-emerald-500">
              <span className="flex items-center gap-1">
                <span>K (Potassium - Fruit Density)</span>
                <Sparkles size={12} />
              </span>
              <span>{npk.k}% ★</span>
            </div>
            <div className="w-full h-3.5 bg-[var(--color-bg-surface-elevated)] rounded-full overflow-hidden border border-emerald-500/40">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${npk.k}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-[var(--color-emerald-main)] rounded-full shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* SAFETY & DOSE METRICS */}
        <div className="flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs">
          <div>
            <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">RECOMMENDED DOSE</span>
            <div className="font-extrabold text-[var(--color-text-main)] font-mono text-base">{doseMl} mL</div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
            <ShieldCheck size={16} />
            <span>Suitable soil moisture ({currentMoisture}%)</span>
          </div>
        </div>

        {/* NOURISH BUTTON */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all"
        >
          <Sprout size={18} />
          <span>NOURISH PLANT 🌿</span>
        </button>
      </div>

      {/* DISPENSING STEP-BY-STEP ANIMATION MODAL */}
      <FertilizerAnimationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleCompleteDispense}
        doseMl={doseMl}
        plantName={plantName}
      />
    </>
  );
};
