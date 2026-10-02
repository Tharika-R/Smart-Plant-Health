import React from 'react';
import { FertilizerCard } from '../components/FertilizerCard';
import { PlantProfile } from '../components/PlantProfile';

export const Fertilizer = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">Precision Nutrient Dispenser</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">AI N-P-K recommendation engine and peristaltic pump dosing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <FertilizerCard />
        </div>
        <div className="lg:col-span-5">
          <PlantProfile />
        </div>
      </div>
    </div>
  );
};
