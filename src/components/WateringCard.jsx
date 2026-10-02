import React, { useState } from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Droplets, Play, RotateCcw, AlertTriangle, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const WateringCard = () => {
  const {
    activePlant,
    handleWaterNow,
    isWateringActive,
    wateringMode,
    setWateringMode
  } = usePlantiva();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [durationSec, setDurationSec] = useState(5);

  const isMoistureHigh = activePlant?.soilMoisture > 75;

  const triggerWatering = async () => {
    setShowConfirmModal(false);
    await handleWaterNow(durationSec);
  };

  return (
    <>
      <div className="glass-card p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-500">
              <Droplets size={20} className={isWateringActive ? 'animate-bounce' : ''} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
                Watering Care
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Keep your plant comfortably hydrated
              </p>
            </div>
          </div>

          <button
            onClick={() => setWateringMode(wateringMode === 'AUTO' ? 'MANUAL' : 'AUTO')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs font-bold text-[var(--color-text-main)] hover:border-[var(--color-emerald-main)] transition-all"
          >
            <span className={`w-2 h-2 rounded-full ${wateringMode === 'AUTO' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{wateringMode === 'AUTO' ? 'AUTO CARE' : 'MANUAL CARE'}</span>
            <RotateCcw size={12} className="text-[var(--color-text-muted)] ml-1" />
          </button>
        </div>

        {/* ANIMATED WATER DROPLET VISUAL & HUMAN STATUS */}
        <div className="flex flex-col items-center justify-center my-4 py-2">
          <motion.div
            animate={
              isWateringActive
                ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                : { y: [0, -4, 0] }
            }
            transition={{ duration: isWateringActive ? 0.6 : 3, repeat: Infinity }}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center border ${
              isWateringActive
                ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/30'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}
          >
            <Droplets size={44} className={isWateringActive ? 'text-blue-500 animate-pulse' : 'text-blue-400'} />

            {isWateringActive && (
              <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-extrabold tracking-wider uppercase animate-pulse">
                GIVING DRINK 💧
              </span>
            )}
          </motion.div>

          <p className="text-xs font-bold text-[var(--color-text-main)] mt-4 text-center">
            {isWateringActive ? (
              <span className="text-blue-500 font-extrabold">Giving your plant a little drink 💧</span>
            ) : (
              <span>Your plant is comfortably hydrated 💙</span>
            )}
          </p>
        </div>

        {/* STATUS METRICS */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs">
            <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">LAST WATERED</span>
            <div className="font-bold text-[var(--color-text-main)] mt-0.5">{activePlant?.lastWatered || 'Today, 10:32 AM'}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs">
            <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">LAST REFRESHMENT</span>
            <div className="font-bold text-[var(--color-text-main)] font-mono mt-0.5">120 mL</div>
          </div>
        </div>

        {/* CONTROLS BUTTON */}
        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={isWateringActive}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
        >
          <Droplets size={16} />
          <span>{isWateringActive ? 'Watering your plant...' : 'GIVE A DRINK 💧'}</span>
        </button>
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-md w-full border border-[var(--color-border)] shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center">
                <Droplets size={20} />
              </div>
              <h4 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
                Give {activePlant?.name} a drink? 💧
              </h4>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              This will gently hydrate <strong>{activePlant?.name}</strong> with fresh water.
            </p>

            {isMoistureHigh && (
              <div className="p-3 mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>Your plant already has enough water ({activePlant?.soilMoisture}%). Hydrate with care.</span>
              </div>
            )}

            <div className="mb-6">
              <label className="text-xs font-bold text-[var(--color-text-subtle)] uppercase block mb-2">
                Select Amount:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 10, 15].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setDurationSec(sec)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      durationSec === sec
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]'
                    }`}
                  >
                    {sec * 15} mL ({sec}s)
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-[var(--color-bg-surface-elevated)] text-[var(--color-text-muted)] font-bold text-xs hover:text-[var(--color-text-main)]"
              >
                Cancel
              </button>
              <button
                onClick={triggerWatering}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Hydrate Plant ({durationSec * 15} mL)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
