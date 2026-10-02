import React, { useState, useEffect } from 'react';
import { Sparkles, Leaf, ShieldCheck, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const ScanningOverlay = ({ imagePreview, isAnalyzing }) => {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'Looking at your plant... 🌿',
    'Examining the leaves... 🍃',
    'Checking for visible stress... 🔍',
    'Understanding the plant... 💡',
    'Preparing your care recommendations... ✨'
  ];

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % stages.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 max-w-md w-full border border-emerald-500/40 text-center flex flex-col items-center relative overflow-hidden"
      >
        {/* PREVIEW IMAGE WITH AI BEAM SCANNER */}
        <div className="relative w-48 h-48 rounded-3xl overflow-hidden mb-6 border-2 border-emerald-500/50 shadow-2xl">
          <img src={imagePreview} alt="AI Scanning" className="w-full h-full object-cover" />

          {/* LASER SCANNING BEAM */}
          <motion.div
            animate={{ y: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34D399]"
          />

          {/* AMBIENT SCAN GLOW */}
          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
        </div>

        {/* ROTATING STAGE TEXT */}
        <motion.div
          key={stageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2 min-h-16"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-500 font-extrabold text-sm">
            <Sparkles size={16} className="animate-spin" />
            <span>AI VISION SCANNING</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
            {stages[stageIndex]}
          </h3>
        </motion.div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-[var(--color-bg-surface-elevated)] h-2 rounded-full overflow-hidden mt-4 border border-[var(--color-border-subtle)]">
          <motion.div
            animate={{ width: ['5%', '95%'] }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>

        <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-3">
          Evaluating leaf pixels & cross-referencing telemetry...
        </p>
      </motion.div>
    </div>
  );
};
