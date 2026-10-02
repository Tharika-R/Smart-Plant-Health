import React from 'react';
import { MoistureChart } from '../components/MoistureChart';
import { LiveSensorCards } from '../components/LiveSensorCards';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">Environmental Telemetry & Analytics</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">Historical sensor trends and plant microclimate analytics</p>
      </div>

      <LiveSensorCards />
      <MoistureChart />
    </div>
  );
};
