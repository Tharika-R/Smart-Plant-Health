import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { WifiOff, RefreshCw, Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

export const OfflineOverlay = () => {
  const { esp32Status, setEsp32Status, showToast } = usePlantiva();

  if (esp32Status.isConnected) return null;

  const handleReconnect = () => {
    showToast('Re-establishing garden connection...', 'info');
    setTimeout(() => {
      setEsp32Status((prev) => ({
        ...prev,
        isConnected: true,
        lastCommunication: 'Just now',
        statusMessage: 'ESP32 Connected'
      }));
      showToast('✓ Your garden connection is restored 🌿', 'success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 max-w-md w-full border border-amber-500/40 text-center flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500 flex items-center justify-center mb-4 animate-bounce">
          <WifiOff size={32} />
        </div>

        <h3 className="font-serif text-2xl font-extrabold text-[var(--color-text-main)] mb-2">
          Your garden connection needs a little attention 🌿
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs mb-6 font-medium">
          Your plant data isn't reaching us right now. Make sure your gateway is powered on.
        </p>

        <button
          onClick={handleReconnect}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg transition-all"
        >
          <RefreshCw size={16} />
          <span>RECONNECT</span>
        </button>
      </motion.div>
    </div>
  );
};
