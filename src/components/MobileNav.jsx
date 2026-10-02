import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { LayoutDashboard, HeartPulse, Droplets, FlaskConical, Settings } from 'lucide-react';

export const MobileNav = () => {
  const { activeTab, setActiveTab } = usePlantiva();

  const navs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plant-health', label: 'Health', icon: HeartPulse },
    { id: 'watering', label: 'Watering', icon: Droplets },
    { id: 'fertilizer', label: 'Feed', icon: FlaskConical },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-bg-surface-translucent)] backdrop-blur-lg border-t border-[var(--color-border-subtle)] px-2 flex items-center justify-around z-40 md:hidden shadow-lg">
      {navs.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${
              isActive
                ? 'text-[var(--color-emerald-main)] font-extrabold scale-105'
                : 'text-[var(--color-text-muted)] font-medium'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
