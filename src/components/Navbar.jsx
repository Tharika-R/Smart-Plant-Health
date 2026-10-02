import React, { useState } from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import {
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Wifi,
  User,
  Sparkles,
  Sprout
} from 'lucide-react';

const titles = {
  dashboard: 'Garden Overview',
  'plant-health': 'Plant Diagnostics & Condition',
  watering: 'Smart Irrigation Management',
  fertilizer: 'Precision Nutrient Dispenser',
  analytics: 'Environmental Telemetry & Curves',
  history: 'Timeline & Activity Logs',
  settings: 'System & Hardware Configuration'
};

export const Navbar = () => {
  const {
    activeTab,
    plants,
    selectedPlantId,
    setSelectedPlantId,
    activePlant,
    theme,
    toggleTheme,
    isDarkMode,
    alerts,
    esp32Status
  } = usePlantiva();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className="w-full bg-[var(--color-bg-surface-translucent)] backdrop-blur-md border-b border-[var(--color-border-subtle)] px-6 py-4 sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* PAGE TITLE */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[var(--color-text-main)]">
            {titles[activeTab] || 'Dashboard'}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] font-medium hidden sm:block">
            AI & ESP32 Precision Agriculture
          </p>
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3">
          {/* PLANT SELECTOR DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-main)] shadow-sm hover:border-[var(--color-emerald-main)] transition-all"
            >
              <span className="text-base">{activePlant?.iconEmoji || '🌿'}</span>
              <span>{activePlant?.name || 'Sunny'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-emerald-subtle)] text-[var(--color-emerald-main)] font-mono hidden md:inline">
                {activePlant?.plantType}
              </span>
              <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                <div className="text-[10px] font-bold text-[var(--color-text-subtle)] px-3 py-1.5 uppercase">
                  SELECT PLANT
                </div>
                {plants.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPlantId(p.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                      p.id === selectedPlantId
                        ? 'bg-[var(--color-emerald-subtle)] text-[var(--color-emerald-main)]'
                        : 'text-[var(--color-text-main)] hover:bg-[var(--color-bg-surface-elevated)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{p.iconEmoji}</span>
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] font-normal text-[var(--color-text-muted)]">
                      {p.growthStage}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ESP32 ONLINE INDICATOR */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-emerald-subtle)] border border-emerald-500/20 text-[11px] font-bold text-[var(--color-emerald-main)]">
            <span className="dot-pulse" />
            <span>{esp32Status.isConnected ? 'ESP32 Online' : 'Offline'}</span>
          </div>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-[var(--color-emerald-main)] transition-all"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* NOTIFICATION BELL */}
          <div className="relative">
            <button
              onClick={() => setActiveTab('history')}
              className="p-2.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all"
            >
              <Bell size={18} />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* USER AVATAR */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border-subtle)]">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              PP
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-[var(--color-text-main)]">Plant Parent</span>
              <span className="text-[10px] text-[var(--color-text-muted)]">Garden Owner</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
