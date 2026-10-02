import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Sprout, Calendar, Droplets, Heart, ArrowRight, Sparkles } from 'lucide-react';

export const PlantProfile = () => {
  const { activePlant, setActiveTab } = usePlantiva();

  return (
    <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-3xl bg-[var(--color-emerald-subtle)] border border-[var(--color-border)] flex items-center justify-center text-3xl shadow-sm shrink-0">
          {activePlant?.iconEmoji || '🪴'}
        </div>
        <div>
          <span className="text-[10px] font-bold text-[var(--color-emerald-main)] uppercase tracking-wider">
            YOUR LIVING COMPANION
          </span>
          <h3 className="font-serif text-xl font-extrabold text-[var(--color-text-main)]">
            Meet {activePlant?.name || 'Sunny'} 🌿
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            {activePlant?.species}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 my-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">GROWING FOR</span>
          <span className="font-bold text-[var(--color-text-main)] font-mono">{activePlant?.ageDays} Days</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">CARE STREAK</span>
          <span className="font-bold text-emerald-500 font-mono">{activePlant?.careStreakDays || 14} Days 💚</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">STAGE</span>
          <span className="font-bold text-[var(--color-emerald-main)]">{activePlant?.growthStage}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">WELLNESS</span>
          <span className="font-bold text-[var(--color-text-main)] font-mono">{activePlant?.healthScore}% Thriving</span>
        </div>
      </div>

      {/* MILESTONES PREVIEW */}
      {activePlant?.milestones && (
        <div className="p-3 my-2 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)] space-y-1">
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase block">GROWTH MILESTONE</span>
          <p className="font-medium text-[11px] text-[var(--color-text-main)]">
            {activePlant.milestones[activePlant.milestones.length - 1]}
          </p>
        </div>
      )}

      <button
        onClick={() => setActiveTab('plant-health')}
        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] hover:bg-[var(--color-emerald-subtle)] text-[var(--color-text-main)] hover:text-[var(--color-emerald-main)] border border-[var(--color-border)] font-bold text-xs transition-all group"
      >
        <span>View Companion Wellness</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
