import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { AlertTriangle, CheckCircle2, AlertCircle, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AlertPanel = () => {
  const { alerts, dismissAlert } = usePlantiva();

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-[var(--color-emerald-main)]">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              Garden Nudges & Alerts
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] font-medium">
              Friendly reminders for your plants' well-being
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-[var(--color-text-muted)] font-mono">
          {alerts.length} active
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => {
            const isWarning = alert.severity === 'warning';
            const isCritical = alert.severity === 'critical';

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className={`p-3.5 rounded-2xl border flex items-start gap-3 relative transition-all ${
                  isCritical
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {isCritical ? (
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                )}

                <div className="flex-1 pr-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{alert.title}</span>
                    <span className="text-[10px] opacity-75 font-mono">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs opacity-90 mt-0.5 font-medium">{alert.description}</p>
                </div>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-3 right-3 opacity-60 hover:opacity-100 p-0.5"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && (
          <div className="p-8 text-center text-xs text-[var(--color-text-muted)] font-medium">
            🌱 All your plant companions are happy and cared for!
          </div>
        )}
      </div>
    </div>
  );
};
