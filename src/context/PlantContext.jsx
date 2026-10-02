import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCurrentSensors,
  fetchInitialDashboardData,
  triggerWaterPump,
  triggerFertilizerPump,
  updateHardwareSettings,
  configureHardwareApi
} from '../services/plantService';

const PlantContext = createContext();

export const PlantProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Core State
  const [plantInfo, setPlantInfo] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [hourlyReadings, setHourlyReadings] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [wateringStatus, setWateringStatus] = useState(null);
  const [fertilizerRec, setFertilizerRec] = useState(null);
  const [hardwareList, setHardwareList] = useState([]);
  const [activities, setActivities] = useState([]);

  // Hardware Config State
  const [hardwareConfig, setHardwareConfig] = useState({
    ipAddress: '192.168.1.104',
    useMock: true,
    connectionStatus: 'Connected', // 'Connected' | 'Connecting' | 'Offline'
    lastPingMs: 14
  });

  // Action status
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [isFertilizingActive, setIsFertilizingActive] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchInitialDashboardData();
        setPlantInfo(data.plantInfo);
        setSensorData(data.sensorData);
        setHourlyReadings(data.hourlyReadings);
        setHealthStatus(data.healthStatus);
        setWateringStatus(data.wateringStatus);
        setFertilizerRec(data.fertilizerRec);
        setHardwareList(data.hardwareList);
        setActivities(data.activities);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Periodic Telemetry Refresh (Simulated Live Reading updates every 5s)
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(async () => {
      const updatedSensors = await fetchCurrentSensors();
      setSensorData(updatedSensors);

      // Re-evaluate plant health based on live sensor data
      if (updatedSensors.soilMoisture) {
        const val = updatedSensors.soilMoisture.value;
        setHealthStatus((prev) => {
          if (!prev) return prev;
          let overall = 'Healthy';
          let score = 96;

          if (val < 35 || val > 80) {
            overall = 'Critical';
            score = 55;
          } else if (val < 45 || val > 75) {
            overall = 'Attention';
            score = 78;
          }

          return {
            ...prev,
            overall,
            score,
            factors: prev.factors.map((f) => {
              if (f.name === 'Soil Moisture') {
                return {
                  ...f,
                  value: `${val}%`,
                  status: val < 40 ? 'Low' : val > 70 ? 'High' : 'Optimal'
                };
              }
              return f;
            })
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [loading]);

  // Action: Manual Water Trigger
  const handleWaterNow = async (durationSec = 15) => {
    setIsWateringActive(true);
    setWateringStatus((prev) => ({ ...prev, pumpStatus: 'Active' }));

    try {
      const res = await triggerWaterPump(durationSec);

      // Instantly boost moisture telemetry visually
      setSensorData((prev) => ({
        ...prev,
        soilMoisture: {
          ...prev.soilMoisture,
          value: Math.min(78, prev.soilMoisture.value + 16),
          status: 'Optimal',
          lastRead: 'Just now'
        }
      }));

      // Update watering counters
      const amount = durationSec * 15;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setWateringStatus((prev) => ({
        ...prev,
        pumpStatus: 'Idle',
        lastWateringTime: `Today at ${nowStr}`,
        wateringCountToday: prev.wateringCountToday + 1,
        totalWateringCount: prev.totalWateringCount + 1,
        totalEstimatedWaterLiters: parseFloat((prev.totalEstimatedWaterLiters + amount / 1000).toFixed(2))
      }));

      // Add to recent activities
      const newActivity = {
        id: Date.now(),
        type: 'watering',
        title: 'Manual Irrigation Triggered',
        description: `Pump ran for ${durationSec}s. Dispensed ~${amount} mL water.`,
        timestamp: `Today at ${nowStr}`,
        status: 'success'
      };

      setActivities((prev) => [newActivity, ...prev]);
      showToast(`Watering completed (${amount}mL dispensed)!`, 'success');
    } catch (err) {
      showToast('Watering failed. Check ESP32 pump connection.', 'error');
      setWateringStatus((prev) => ({ ...prev, pumpStatus: 'Idle' }));
    } finally {
      setIsWateringActive(false);
    }
  };

  // Action: Manual Dispense Fertilizer
  const handleDispenseFertilizer = async (amountMl = 15) => {
    // Safety Check: Check soil moisture
    if (sensorData?.soilMoisture?.value < 30) {
      showToast('Safety Warning: Soil too dry (<30%). Water the plant first!', 'warning');
      return false;
    }

    setIsFertilizingActive(true);

    try {
      await triggerFertilizerPump(amountMl);

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setFertilizerRec((prev) => ({
        ...prev,
        lastDispensed: `Just now (${amountMl} mL)`,
        totalDispensedMl: prev.totalDispensedMl + amountMl
      }));

      const newActivity = {
        id: Date.now(),
        type: 'fertilizer',
        title: 'Nutrient Dose Dispensed',
        description: `Dispensed ${amountMl} mL ${fertilizerRec?.recommendedFertilizer || 'Liquid Nutrient'}`,
        timestamp: `Today at ${nowStr}`,
        status: 'info'
      };

      setActivities((prev) => [newActivity, ...prev]);
      showToast(`Successfully dispensed ${amountMl}mL nutrient solution!`, 'success');
      return true;
    } catch (err) {
      showToast('Fertilizer pump failed. Check relay wiring.', 'error');
      return false;
    } finally {
      setIsFertilizingActive(false);
    }
  };

  // Action: Toggle Auto/Manual Watering Mode
  const toggleWateringMode = () => {
    setWateringStatus((prev) => {
      const nextMode = prev.mode === 'Automatic' ? 'Manual' : 'Automatic';
      showToast(`Watering mode set to ${nextMode}`, 'info');
      return { ...prev, mode: nextMode };
    });
  };

  // Action: Save Settings
  const handleSaveSettings = async (newSettings) => {
    try {
      await updateHardwareSettings(newSettings);

      if (newSettings.plantInfo) {
        setPlantInfo((prev) => ({ ...prev, ...newSettings.plantInfo }));
      }

      if (newSettings.hardwareConfig) {
        setHardwareConfig((prev) => ({ ...prev, ...newSettings.hardwareConfig }));
        configureHardwareApi(newSettings.hardwareConfig.ipAddress, newSettings.hardwareConfig.useMock);
      }

      if (newSettings.wateringStatus) {
        setWateringStatus((prev) => ({ ...prev, ...newSettings.wateringStatus }));
      }

      showToast('Settings saved & synced with ESP32!', 'success');
    } catch (err) {
      showToast('Failed to sync settings with ESP32 hardware.', 'error');
    }
  };

  return (
    <PlantContext.Provider
      value={{
        activeTab,
        setActiveTab,
        loading,
        plantInfo,
        sensorData,
        hourlyReadings,
        healthStatus,
        wateringStatus,
        fertilizerRec,
        hardwareList,
        activities,
        hardwareConfig,
        isWateringActive,
        isFertilizingActive,
        toastMessage,
        handleWaterNow,
        handleDispenseFertilizer,
        toggleWateringMode,
        handleSaveSettings,
        showToast
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

export const usePlant = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
};
