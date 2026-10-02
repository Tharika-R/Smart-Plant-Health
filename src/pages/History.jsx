import React from 'react';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { AlertPanel } from '../components/AlertPanel';

export const History = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">Timeline & Activity Logs</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">Historical record of pump cycles, fertilizer dosing, and telemetry events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6">
          <ActivityTimeline />
        </div>
        <div className="md:col-span-6">
          <AlertPanel />
        </div>
      </div>
    </div>
  );
};
