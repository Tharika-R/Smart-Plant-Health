import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const ActivityTimeline = () => {
  const { timeline } = usePlantiva();

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/15 flex items-center justify-center text-teal-500">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              Your Plant's Care Journal
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Loving care history and growth milestones
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-[var(--color-emerald-main)] uppercase bg-[var(--color-emerald-subtle)] px-3 py-1 rounded-full border border-emerald-500/20">
          TODAY
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border-subtle)]">
        {timeline.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="relative flex items-start gap-4"
          >
            {/* ORGANIC TIMELINE NODE ICON */}
            <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-[var(--color-bg-surface)] border-2 border-[var(--color-emerald-main)] flex items-center justify-center text-xs shadow-xs">
              <span>{node.icon}</span>
            </div>

            <div className="flex-1 p-3.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-text-main)]">{node.title}</span>
                <span className="text-[10px] font-mono font-bold text-[var(--color-text-subtle)]">{node.time}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">{node.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
