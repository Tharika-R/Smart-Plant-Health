import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { LiveSensorCards } from '../components/LiveSensorCards';
import { PlantHealthCard } from '../components/PlantHealthCard';
import { PlantGrowthTimeline } from '../components/PlantGrowthTimeline';
import { MoistureChart } from '../components/MoistureChart';
import { WateringCard } from '../components/WateringCard';
import { FertilizerCard } from '../components/FertilizerCard';
import { AlertPanel } from '../components/AlertPanel';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { StatCard } from '../components/StatCard';
import { PlantProfile } from '../components/PlantProfile';
import { MarketingBanner } from '../components/MarketingBanner';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* HERO SECTION */}
      <HeroSection />

      {/* COMPACT GARDEN STATS */}
      <StatCard />

      {/* LIVE SENSOR INSIGHT CARDS */}
      <LiveSensorCards />

      {/* PLANT GROWTH JOURNEY STAGE PIPELINE */}
      <PlantGrowthTimeline />

      {/* CENTRAL DIAGNOSTICS & ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <MoistureChart />
          <PlantHealthCard />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <WateringCard />
          <FertilizerCard />
        </div>
      </div>

      {/* MARKETING CTA BANNER */}
      <MarketingBanner />

      {/* ALERTS, TIMELINE & PLANT PROFILE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <PlantProfile />
        </div>
        <div className="md:col-span-4">
          <AlertPanel />
        </div>
        <div className="md:col-span-4">
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
};
