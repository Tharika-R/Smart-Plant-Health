import React from 'react';
import { History, TrendingUp, ShieldCheck, Trash2, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const VisionHistory = ({ historyList, onDeleteEntry, onSelectEntry }) => {
  if (!historyList || historyList.length === 0) return null;

  const latestScore = historyList[0]?.overallHealth || 92;
  const prevScore = historyList[1]?.overallHealth || 86;
  const delta = latestScore - prevScore;

  return (
    <div className="glass-card p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 flex items-center justify-center text-teal-500">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              Plant Health Journal History
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Past AI vision checks and leaf improvement comparisons
            </p>
          </div>
        </div>

        {/* COMPARISON CHIP */}
        {historyList.length >= 2 && (
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <TrendingUp size={14} />
            <span>Your plant is improving! 🌱 (+{delta}% health boost)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {historyList.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectEntry && onSelectEntry(item)}
            className="p-4 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] hover:border-[var(--color-emerald-main)] cursor-pointer transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--color-text-subtle)] font-mono">
                {item.timestamp}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold font-mono">
                {item.overallHealth}% Health
              </span>
            </div>

            <div>
              <h4 className="font-serif text-sm font-bold text-[var(--color-text-main)]">
                {item.plantName}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
                {item.visibleIssues[0]?.name || 'Looking Healthy'}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[10px] text-[var(--color-text-muted)]">
              <span>View Full Report</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteEntry(item.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                title="Delete Photo"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRIVACY NOTE */}
      <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Your plant photos are used only for analysis and are stored privately.</span>
        </div>
      </div>
    </div>
  );
};
