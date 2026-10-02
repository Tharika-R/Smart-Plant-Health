import React, { useState } from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Settings as SettingsIcon, Sprout, Droplets, FlaskConical, Wifi, Save, RefreshCcw } from 'lucide-react';

export const Settings = () => {
  const { activePlant, setPlants, esp32Status, setEsp32Status, showToast } = usePlantiva();

  const [plantName, setPlantName] = useState(activePlant?.name || 'Sunny');
  const [plantType, setPlantType] = useState(activePlant?.plantType || 'Tomato');
  const [ageDays, setAgeDays] = useState(activePlant?.ageDays || 55);
  const [growthStage, setGrowthStage] = useState(activePlant?.growthStage || 'Flowering');

  const [moistureThreshold, setMoistureThreshold] = useState(activePlant?.moistureThreshold || 45);
  const [maxWaterSec, setMaxWaterSec] = useState(15);
  const [autoWater, setAutoWater] = useState(true);

  const [doseMl, setDoseMl] = useState(activePlant?.recommendedDoseMl || 5);
  const [autoFertilizer, setAutoFertilizer] = useState(false);

  const [ipAddress, setIpAddress] = useState('127.0.0.1:8000');

  const handleSave = (e) => {
    e.preventDefault();
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === activePlant.id) {
          return {
            ...p,
            name: plantName,
            plantType,
            ageDays: Number(ageDays),
            growthStage,
            moistureThreshold: Number(moistureThreshold),
            recommendedDoseMl: Number(doseMl)
          };
        }
        return p;
      })
    );
    showToast('✓ Plantiva system configuration saved!', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[var(--color-text-main)]">System & Hardware Configuration ⚙</h2>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">Fine-tune plant thresholds, irrigation timing, and ESP32 REST server parameters</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PLANT SETTINGS CARD */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
            <Sprout size={20} className="text-[var(--color-emerald-main)]" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">Plant Profile Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Plant Name</label>
              <input
                type="text"
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none focus:border-[var(--color-emerald-main)]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Plant Variety / Type</label>
              <input
                type="text"
                value={plantType}
                onChange={(e) => setPlantType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none focus:border-[var(--color-emerald-main)]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Plant Age (Days)</label>
              <input
                type="number"
                value={ageDays}
                onChange={(e) => setAgeDays(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none focus:border-[var(--color-emerald-main)]"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none focus:border-[var(--color-emerald-main)]"
              >
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruiting">Fruiting</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>
          </div>
        </div>

        {/* WATERING SETTINGS CARD */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
            <Droplets size={20} className="text-blue-500" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">Smart Watering Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Soil Moisture Threshold (%)</label>
              <input
                type="number"
                value={moistureThreshold}
                onChange={(e) => setMoistureThreshold(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Max Duration (Sec)</label>
              <input
                type="number"
                value={maxWaterSec}
                onChange={(e) => setMaxWaterSec(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div>
                <span className="font-bold text-[var(--color-text-main)] block">Auto Irrigation</span>
                <span className="text-[10px] text-[var(--color-text-muted)]">Pumps automatically when dry</span>
              </div>
              <input
                type="checkbox"
                checked={autoWater}
                onChange={(e) => setAutoWater(e.target.checked)}
                className="w-5 h-5 accent-[var(--color-emerald-main)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* FERTILIZER SETTINGS CARD */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
            <FlaskConical size={20} className="text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">Fertilizer Dispenser Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[var(--color-text-subtle)] uppercase block mb-1.5">Recommended Dose (mL)</label>
              <input
                type="number"
                value={doseMl}
                onChange={(e) => setDoseMl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] font-bold outline-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <div>
                <span className="font-bold text-[var(--color-text-main)] block">Auto Dosing</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium">Automatic nutrient schedule</span>
              </div>
              <input
                type="checkbox"
                checked={autoFertilizer}
                onChange={(e) => setAutoFertilizer(e.target.checked)}
                className="w-5 h-5 accent-[var(--color-emerald-main)] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* ESP32 HARDWARE DIAGNOSTICS CARD */}
        <div className="glass-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-3">
              <Wifi size={20} className="text-[var(--color-emerald-main)]" />
              <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">ESP32 Hardware Diagnostics</h3>
            </div>
            <span className="pulse-emerald">
              <span>{esp32Status.isConnected ? 'ONLINE' : 'OFFLINE'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] font-mono">
              <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">DEVICE ID</span>
              <span className="font-bold text-[var(--color-text-main)]">{esp32Status.deviceId}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] font-mono">
              <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">LAST COMM</span>
              <span className="font-bold text-[var(--color-text-main)]">{esp32Status.lastCommunication}</span>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] font-mono">
              <span className="text-[10px] text-[var(--color-text-subtle)] font-bold uppercase block">REST ENDPOINT</span>
              <span className="font-bold text-[var(--color-text-main)]">http://{ipAddress}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white font-extrabold text-xs shadow-lg transition-all"
          >
            <Save size={16} />
            <span>SAVE CONFIGURATION</span>
          </button>
        </div>
      </form>
    </div>
  );
};
