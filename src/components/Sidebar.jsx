import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import {
  LayoutDashboard,
  HeartPulse,
  Camera,
  Droplets,
  FlaskConical,
  LineChart,
  History,
  Settings,
  Leaf
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, esp32Status } = usePlantiva();

  const navItems = [
    { id: 'dashboard', label: 'My Garden', icon: LayoutDashboard },
    { id: 'plant-vision', label: 'Plant Vision 📷', icon: Camera },
    { id: 'plant-health', label: 'Plant Wellness', icon: HeartPulse },
    { id: 'watering', label: 'Watering Care', icon: Droplets },
    { id: 'fertilizer', label: 'Nourishment', icon: FlaskConical },
    { id: 'analytics', label: 'Plant Insights', icon: LineChart },
    { id: 'history', label: 'Care Journal', icon: History },
    { id: 'settings', label: 'Garden Preferences', icon: Settings },
  ];

  return (
    <aside className="w-68 bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border-subtle)] h-screen sticky top-0 flex flex-col justify-between p-6 z-40 transition-colors duration-300 hidden md:flex">
      <div>
        {/* BRAND LOGO */}
        <div className="flex items-center gap-3 pb-6 border-b border-[var(--color-border-subtle)]">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-emerald-main)] flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
            <Leaf size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-extrabold tracking-tight text-[var(--color-text-main)]">
              Plantiva
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] font-medium tracking-wide">
              Your Digital Garden Companion
            </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="mt-6 flex flex-col gap-1.5">
          <div className="text-[10px] font-bold tracking-widest text-[var(--color-text-subtle)] uppercase px-3 mb-2">
            GARDEN COMPANION
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-[var(--color-bg-surface)] text-[var(--color-emerald-main)] shadow-sm font-bold border border-[var(--color-border)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-surface-elevated)] hover:text-[var(--color-text-main)]'
                }`}
              >
                <Icon size={19} className={isActive ? 'text-[var(--color-emerald-main)]' : 'text-[var(--color-text-subtle)]'} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[var(--color-emerald-main)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* FOOTER: EMOTIONAL STATUS */}
      <div className="pt-4 border-t border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xs">
          <div className="relative">
            <span className="dot-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--color-text-main)]">
              Your garden is being cared for 💚
            </span>
            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
              {esp32Status.deviceId} • Active & Healthy
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
