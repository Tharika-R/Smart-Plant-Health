import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PLANTS,
  INITIAL_DIARY_ENTRIES,
  INITIAL_HOURLY_READINGS,
  INITIAL_ALERTS,
  NATURAL_INSIGHTS
} from '../services/plantoraData';
import { triggerWaterPump, triggerFertilizerPump } from '../services/plantService';

const PlantoraContext = createContext();

export const PlantoraProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('garden');
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState(INITIAL_DIARY_ENTRIES);
  const [hourlyReadings, setHourlyReadings] = useState(INITIAL_HOURLY_READINGS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Theme System (Persisted in localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem('plantora_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('plantora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Hardware Status Indicator (Human-friendly)
  const [hardwareBridge, setHardwareBridge] = useState({
    isConnected: true,
    statusText: 'Your garden is connected 💚',
    deviceId: 'ESP32-001',
    ipAddress: '192.168.56.1',
    useMock: true
  });

  // Modal Open States
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [isWateringModalOpen, setIsWateringModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isAddDiaryOpen, setIsAddDiaryOpen] = useState(false);
  const [activeActionPlant, setActiveActionPlant] = useState(null);

  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || null;

  const showToast = (message, type = 'success') => {
    setToastMessage(message ? { message, type, id: Date.now() } : null);
    if (message) {
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Action: Favorite Toggle
  const toggleFavorite = (plantId, e) => {
    if (e) e.stopPropagation();
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === plantId) {
          const nextFav = !p.isFavorite;
          showToast(nextFav ? `Added ${p.nickname} to your favorites ❤️` : `Removed ${p.nickname} from favorites`, 'info');
          return { ...p, isFavorite: nextFav };
        }
        return p;
      })
    );
  };

  // Action: Water Plant Trigger
  const handleWaterPlant = async (plantId, amountMl = 120) => {
    const targetPlant = plants.find((p) => p.id === plantId) || selectedPlant || plants[0];
    if (!targetPlant) return false;

    try {
      await triggerWaterPump(Math.max(3, Math.round(amountMl / 15)));

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nowDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === targetPlant.id) {
            return {
              ...p,
              soilMoisture: Math.min(82, p.soilMoisture + 28),
              healthState: 'Thriving',
              healthScore: 96,
              healthMessage: "Your plant is refreshed 💚",
              lastWatered: `Watered just now (${amountMl} mL)`
            };
          }
          return p;
        })
      );

      const newDiaryEntry = {
        id: `diary-${Date.now()}`,
        plantId: targetPlant.id,
        plantName: targetPlant.name,
        date: `${nowDate}, 2026`,
        time: nowTime,
        title: `💧 Watered ${targetPlant.name}`,
        note: `Gave a refreshing ${amountMl} mL drink. Your ${targetPlant.name} is refreshed.`,
        type: 'watering',
        tag: 'Care Routine'
      };

      setDiaryEntries((prev) => [newDiaryEntry, ...prev]);
      showToast(`✓ Your ${targetPlant.name} is refreshed 💚`, 'success');
      return true;
    } catch (err) {
      showToast(`Could not connect to irrigation pump. Please check garden connection.`, 'error');
      return false;
    }
  };

  // Action: Feed Plant / Nutrition Trigger
  const handleFeedPlant = async (plantId, doseMl = 5) => {
    const targetPlant = plants.find((p) => p.id === plantId) || selectedPlant || plants[0];
    if (!targetPlant) return false;

    if (targetPlant.soilMoisture < 30) {
      showToast(`Let's wait a little. The soil is too dry right now. Water your plant before fertilizing.`, 'warning');
      return false;
    }

    try {
      await triggerFertilizerPump(doseMl);

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nowDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      setPlants((prev) =>
        prev.map((p) => {
          if (p.id === targetPlant.id) {
            return {
              ...p,
              healthScore: Math.min(100, p.healthScore + 4),
              healthMessage: `Given ${doseMl} mL organic plant nourishment.`
            };
          }
          return p;
        })
      );

      const newDiaryEntry = {
        id: `diary-${Date.now()}`,
        plantId: targetPlant.id,
        plantName: targetPlant.name,
        date: `${nowDate}, 2026`,
        time: nowTime,
        title: `🌱 Plant Nourishment Delivered`,
        note: `Dosed ${doseMl} mL ${targetPlant.nutrientFormula || 'Organic Feed'}.`,
        type: 'nutrition',
        tag: 'Plant Feed'
      };

      setDiaryEntries((prev) => [newDiaryEntry, ...prev]);
      showToast(`✓ ${doseMl} mL delivered successfully 💚`, 'success');
      return true;
    } catch (err) {
      showToast(`Nourishment error: ${err.message || 'Dispenser offline'}`, 'error');
      return false;
    }
  };

  // Action: Add Plant Onboarding
  const handleAddPlant = (newPlant) => {
    const createdPlant = {
      id: Date.now(),
      name: newPlant.name || 'My New Plant',
      nickname: `${newPlant.name || 'New Plant'} 🌿`,
      species: newPlant.species || 'Botanical Houseplant',
      plantType: newPlant.speciesType || 'Houseplant',
      location: newPlant.location || 'Indoor Garden',
      tagline: 'Your new garden addition',
      ageDays: Number(newPlant.ageDays) || 1,
      careStreakDays: 1,
      growthStage: 'Seedling',
      growthStageIndex: 0,
      deviceId: newPlant.deviceId || 'ESP32-005',
      moistureThreshold: 45,
      tempThreshold: 28,
      healthScore: 98,
      healthState: 'Thriving',
      healthStatus: 'HEALTHY',
      healthMessage: 'Welcome to your garden! Ready to flourish.',
      soilMoisture: 65,
      temperature: 24.0,
      humidity: 60,
      lastWatered: 'Just added today',
      lastWateredAmountMl: 100,
      lastFertilized: 'Not fertilized yet',
      lastFertilizedAmountMl: 0,
      nutrientFormula: 'Balanced Plant Food',
      npkBreakdown: { n: 70, p: 70, k: 70 },
      recommendedDoseMl: 5,
      fertilizerReason: 'Young growth stage benefits from balanced foliage nourishment.',
      iconEmoji: newPlant.speciesType === 'Tomato' ? '🍅' : newPlant.speciesType === 'Rose' ? '🌹' : newPlant.speciesType === 'Chilli' ? '🌶️' : '🌿',
      bgGradient: 'linear-gradient(135deg, #E8F0EC 0%, #D8E2DC 100%)',
      badgeColor: '#1B4332',
      isFavorite: false,
      milestones: ['🌱 Joined your digital garden today!']
    };

    setPlants((prev) => [createdPlant, ...prev]);
    showToast(`Your new plant is ready 🌱`, 'success');
  };

  // Action: Add Diary Entry
  const handleAddDiaryEntry = (entryData) => {
    const newEntry = {
      id: `diary-${Date.now()}`,
      plantId: entryData.plantId || plants[0]?.id,
      plantName: entryData.plantName || plants[0]?.name,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: entryData.title || '🌿 Growth Note',
      note: entryData.note || '',
      type: 'milestone',
      tag: entryData.tag || 'Growth Milestone',
      imageUrl: entryData.imageUrl || null
    };

    setDiaryEntries((prev) => [newEntry, ...prev]);
    showToast(`Added to your Plant Diary! 📖`, 'success');
  };

  const openWateringModal = (plant, e) => {
    if (e) e.stopPropagation();
    setActiveActionPlant(plant);
    setIsWateringModalOpen(true);
  };

  const openNutritionModal = (plant, e) => {
    if (e) e.stopPropagation();
    setActiveActionPlant(plant);
    setIsNutritionModalOpen(true);
  };

  return (
    <PlantoraContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode: theme === 'dark',
        activeTab,
        setActiveTab,
        plants,
        selectedPlantId,
        setSelectedPlantId,
        selectedPlant,
        diaryEntries,
        hourlyReadings,
        alerts,
        filterStatus,
        setFilterStatus,
        searchQuery,
        setSearchQuery,
        insights: NATURAL_INSIGHTS,
        hardwareBridge,
        setHardwareBridge,
        toastMessage,
        showToast,
        toggleFavorite,
        handleWaterPlant,
        handleFeedPlant,
        handleAddPlant,
        handleAddDiaryEntry,
        isAddPlantOpen,
        setIsAddPlantOpen,
        isWateringModalOpen,
        setIsWateringModalOpen,
        isNutritionModalOpen,
        setIsNutritionModalOpen,
        isAddDiaryOpen,
        setIsAddDiaryOpen,
        activeActionPlant,
        openWateringModal,
        openNutritionModal
      }}
    >
      {children}
    </PlantoraContext.Provider>
  );
};

export const usePlantora = () => {
  const context = useContext(PlantoraContext);
  if (!context) {
    throw new Error('usePlantora must be used within a PlantoraProvider');
  }
  return context;
};
