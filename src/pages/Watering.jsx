import React from 'react';
import { WateringCard } from '../components/WateringCard';
import { MoistureChart } from '../components/MoistureChart';

export const Watering = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">Smart Irrigation Management</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">ESP32 submersible water pump automation and soil moisture threshold control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <WateringCard />
        </div>
        <div className="lg:col-span-7">
          <MoistureChart />
        </div>
      </div>
    </div>
  );
};
