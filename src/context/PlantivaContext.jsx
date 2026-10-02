import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PLANTS,
  INITIAL_HOURLY_READINGS,
  INITIAL_ALERTS,
  INITIAL_TIMELINE,
  INITIAL_STATS
} from '../services/plantivaData';
import { triggerWaterPump, triggerFertilizerPump } from '../services/plantService';

const PlantivaContext = createContext();

export const PlantivaProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState(1);
  const [hourlyReadings, setHourlyReadings] = useState(INITIAL_HOURLY_READINGS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [stats, setStats] = useState(INITIAL_STATS);

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => localStorage.getItem('plantiva_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('plantiva_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // ESP32 Status & Hardware Connection
  const [esp32Status, setEsp32Status] = useState({
    isConnected: true,
    deviceId: 'ESP32-001',
    lastCommunication: 'Just now',
    statusMessage: 'ESP32 Connected'
  });

  // Action States
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [isFertilizingActive, setIsFertilizingActive] = useState(false);
  const [wateringMode, setWateringMode] = useState('AUTO'); // 'AUTO' | 'MANUAL'
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [showWateringModal, setShowWateringModal] = useState(false);
  const [toast, setToast] = useState(null);

  const activePlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  const showToast = (message, type = 'success') => {
    setToast(message ? { message, type, id: Date.now() } : null);
    if (message) {
      setTimeout(() => setToast(null), 4000);
    }
  };

  // Action: Trigger Manual Water Pump Command
  const handleWaterNow = async (durationSec = 5) => {
    if (isWateringActive) return false;

    // High moisture safety check warning
    if (activePlant.soilMoisture > 80) {
      showToast(`Soil moisture is already high (${activePlant.soilMoisture}%). Additional watering skipped to prevent root rot.`, 'warning');
      return false;
    }

    setIsWateringActive(true);
    try {
      await triggerWaterPump(durationSec, activePlant.id);
      
      const estimatedMl = durationSec * 15;
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update active plant soil moisture
      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === activePlant.id) {
            return {
              ...p,
              soilMoisture: Math.min(85, p.soilMoisture + 18),
              lastWatered: `Just now (${estimatedMl} mL)`
            };
          }
          return p;
        })
      );

      // Log timeline entry
      setTimeline((prev) => [
        {
          id: `t-${Date.now()}`,
          time: nowTime,
          title: `💧 ${activePlant.name} Watered`,
          description: `${estimatedMl} mL water dispensed via pump command`,
          type: 'watering',
          icon: '💧',
          amount: `${estimatedMl} mL`
        },
        ...prev
      ]);

      showToast(`✓ Watering command accepted (${estimatedMl} mL dispensed)`, 'success');
      setIsWateringActive(false);
      return true;
    } catch (err) {
      setIsWateringActive(false);
      showToast(`ESP32 command failure: ${err.message || 'Pump offline'}`, 'error');
      return false;
    }
  };

  // Action: Trigger Fertilizer Dispense Command
  const handleDispenseFertilizer = async (doseMl = 5) => {
    if (isFertilizingActive) return false;

    if (activePlant.soilMoisture < 30) {
      showToast(`The soil is too dry (${activePlant.soilMoisture}%). Water ${activePlant.name} before fertilizing to protect root health.`, 'warning');
      return false;
    }

    setIsFertilizingActive(true);
    try {
      await triggerFertilizerPump(doseMl, activePlant.id);

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === activePlant.id) {
            return {
              ...p,
              lastFertilized: `Just now (${doseMl} mL)`
            };
          }
          return p;
        })
      );

      setTimeline((prev) => [
        {
          id: `t-${Date.now()}`,
          time: nowTime,
          title: `🧪 Fertilizer Dispensed`,
          description: `${doseMl} mL ${activePlant.nutrientFormula || 'Organic Feed'} dosed`,
          type: 'fertilizer',
          icon: '🧪',
          amount: `${doseMl} mL`
        },
        ...prev
      ]);

      showToast(`✓ ${doseMl} mL fertilizer command sent successfully!`, 'success');
      setIsFertilizingActive(false);
      return true;
    } catch (err) {
      setIsFertilizingActive(false);
      showToast(`Fertilizer command failed: ${err.message || 'Dispenser error'}`, 'error');
      return false;
    }
  };

  // Dismiss Alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return (
    <PlantivaContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode: theme === 'dark',
        activeTab,
        setActiveTab,
        plants,
        setPlants,
        selectedPlantId,
        setSelectedPlantId,
        activePlant,
        hourlyReadings,
        setHourlyReadings,
        alerts,
        dismissAlert,
        timeline,
        stats,
        esp32Status,
        setEsp32Status,
        isWateringActive,
        isFertilizingActive,
        wateringMode,
        setWateringMode,
        showFertilizerModal,
        setShowFertilizerModal,
        showWateringModal,
        setShowWateringModal,
        toast,
        showToast,
        handleWaterNow,
        handleDispenseFertilizer
      }}
    >
      {children}
    </PlantivaContext.Provider>
  );
};

export const usePlantiva = () => {
  const context = useContext(PlantivaContext);
  if (!context) {
    throw new Error('usePlantiva must be used within a PlantivaProvider');
  }
  return context;
};
