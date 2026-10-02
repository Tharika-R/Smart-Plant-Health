import React from 'react';
import { PlantHealthCard } from '../components/PlantHealthCard';
import { LiveSensorCards } from '../components/LiveSensorCards';
import { AlertPanel } from '../components/AlertPanel';

export const PlantHealth = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">Plant Health Diagnostics</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">Real-time physiological condition and vital sign breakdown</p>
      </div>

      <LiveSensorCards />
      <PlantHealthCard />
      <AlertPanel />
    </div>
  );
};
