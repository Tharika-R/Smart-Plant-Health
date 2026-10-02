import React, { useState, useEffect } from 'react';
import { FlaskConical, CheckCircle2, Sparkles, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const FertilizerAnimationModal = ({ isOpen, onClose, onComplete, doseMl = 5, plantName = 'Sunny' }) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('confirm'); // 'confirm' | 'dispensing' | 'success'

  useEffect(() => {
    if (step === 'dispensing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('success');
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 2000);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, onComplete]);

  if (!isOpen) return null;

  const startDispensing = () => {
    setStep('dispensing');
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 md:p-8 max-w-lg w-full border border-[var(--color-border)] shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface-elevated)]"
        >
          <X size={18} />
        </button>

        {/* STEP 1: CONFIRMATION PROMPT */}
        {step === 'confirm' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-3xl bg-[var(--color-emerald-subtle)] text-[var(--color-emerald-main)] flex items-center justify-center mb-4 shadow-md">
              <FlaskConical size={28} className="animate-pulse" />
            </div>

            <h3 className="font-serif text-xl font-extrabold text-[var(--color-text-main)] mb-2">
              Ready to nourish {plantName}? 🌿
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] max-w-sm mb-6 font-medium">
              Your flowering plant is ready for a little extra nourishment ({doseMl} mL Phosphorus & Potassium boost).
            </p>

            <div className="w-full p-4 mb-6 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs text-left font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-subtle)]">Recommended Dose:</span>
                <span className="font-bold text-[var(--color-emerald-main)]">{doseMl} mL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-subtle)]">Nutrient Blend:</span>
                <span className="font-bold text-[var(--color-text-main)]">Phosphorus + Potassium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-subtle)]">Hydration Check:</span>
                <span className="font-bold text-emerald-500">Suitable Soil Hydration (48%)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 w-full">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] font-bold text-xs hover:text-[var(--color-text-main)]"
              >
                Cancel
              </button>
              <button
                onClick={startDispensing}
                className="px-6 py-2.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg transition-all"
              >
                NOURISH PLANT ({doseMl} mL)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: NOURISHMENT FLOW ANIMATION */}
        {step === 'dispensing' && (
          <div className="flex flex-col items-center text-center my-2">
            <h4 className="font-serif text-lg font-bold text-[var(--color-text-main)] mb-2">
              Preparing nourishment...
            </h4>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Giving your plant what it needs 💚
            </p>

            {/* FLOW SCHEMATIC */}
            <div className="w-full flex items-center justify-between gap-2 px-2 my-4 relative">
              <div className="flex flex-col items-center">
                <div className="w-12 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-sm">
                  🧪
                </div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] mt-1">Blend</span>
              </div>

              <div className="flex-1 h-3 bg-[var(--color-bg-surface-elevated)] rounded-full overflow-hidden relative border border-[var(--color-border-subtle)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-12 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shadow-sm"
                >
                  🌱
                </motion.div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] mt-1">Doser</span>
              </div>

              <div className="flex-1 h-3 bg-[var(--color-bg-surface-elevated)] rounded-full overflow-hidden relative border border-[var(--color-border-subtle)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="w-12 h-14 rounded-2xl bg-emerald-500/30 border border-emerald-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20"
                >
                  🍅
                </motion.div>
                <span className="text-[10px] font-bold text-[var(--color-emerald-main)] mt-1">{plantName}</span>
              </div>
            </div>

            <div className="w-full bg-[var(--color-bg-surface-elevated)] rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-[var(--color-emerald-main)] h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-[var(--color-text-main)] mt-2">
              {progress}% Delivered ({Math.round((progress / 100) * doseMl * 10) / 10} / {doseMl} mL)
            </span>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="flex flex-col items-center text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500 flex items-center justify-center mb-4"
            >
              <CheckCircle2 size={36} />
            </motion.div>

            <h3 className="font-serif text-xl font-extrabold text-[var(--color-text-main)] mb-1">
              Nourishment Delivered 💚
            </h3>
            <p className="text-xs text-[var(--color-emerald-main)] font-bold mb-4 font-mono">
              ✓ {doseMl} mL delivered successfully.
            </p>

            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              {plantName}'s roots have received their phosphorus & potassium bloom booster.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
