/**
 * Plantiva IoT Mock Data & Baseline State
 * 
 * Provides rich multi-plant companion profiles, human-centric wellness interpretations,
 * N-P-K nutrient breakdown, care journal timeline, and marketing insights.
 */

export const INITIAL_PLANTS = [
  {
    id: 1,
    name: 'Sunny',
    nickname: 'Sunny 🍅',
    species: 'Cherry Tomato (Solanum lycopersicum)',
    plantType: 'Tomato',
    location: 'Sunny Balcony',
    ageDays: 55,
    careStreakDays: 14,
    growthStage: 'Flowering',
    growthStageIndex: 2, // 0: Seedling, 1: Vegetative, 2: Flowering, 3: Fruiting
    deviceId: 'ESP32-001',
    moistureThreshold: 45,
    tempThreshold: 30,
    healthScore: 92,
    healthCondition: 'Feeling Great & Thriving',
    healthStatus: 'HEALTHY',
    healthMessage: 'Your tomato plant is growing beautifully and feels very comfortable.',
    soilMoisture: 48,
    soilMoistureInterpretation: 'Your plant is comfortably hydrated.',
    temperature: 27.4,
    tempInterpretation: 'Perfect environment for growth.',
    humidity: 64,
    humidityInterpretation: 'Nice and comfortable airflow.',
    lastWatered: 'Today, 10:32 AM',
    lastWateredNote: 'Received a refreshing drink of 120 mL.',
    lastFertilized: 'Yesterday, 09:30 AM',
    lastFertilizedNote: 'Dosed 5 mL flowering organic boost.',
    nutrientFormula: 'Phosphorus + Potassium Boost',
    npkBreakdown: { n: 65, p: 85, k: 90 },
    recommendedDoseMl: 5,
    fertilizerReason: 'These nutrients support healthy flowering and fruit development as your plant enters its bloom phase.',
    iconEmoji: '🍅',
    isFavorite: true,
    milestones: [
      '🌱 First sprout appeared 55 days ago',
      '🌿 Lush canopy formed 30 days ago',
      '🌼 First flower cluster bloomed 7 days ago',
      '💚 14-day thriving streak achieved!'
    ]
  },
  {
    id: 2,
    name: 'Luna',
    nickname: 'Luna 🌿',
    species: 'Swiss Cheese Plant (Monstera Deliciosa)',
    plantType: 'Monstera',
    location: 'Living Room Corner',
    ageDays: 42,
    careStreakDays: 21,
    growthStage: 'Vegetative',
    growthStageIndex: 1,
    deviceId: 'ESP32-002',
    moistureThreshold: 40,
    tempThreshold: 28,
    healthScore: 96,
    healthCondition: 'Lush & Happy Leaves',
    healthStatus: 'HEALTHY',
    healthMessage: 'Luna is enjoying optimal indirect sunlight and root moisture.',
    soilMoisture: 68,
    soilMoistureInterpretation: 'Root hydration is rich and satisfying.',
    temperature: 24.2,
    tempInterpretation: 'Cozy indoor room climate.',
    humidity: 60,
    humidityInterpretation: 'Gentle tropical humidity.',
    lastWatered: '2 hours ago',
    lastWateredNote: 'Hydrated with 150 mL fresh water.',
    lastFertilized: '3 days ago',
    lastFertilizedNote: 'Given 5 mL foliage tonic.',
    nutrientFormula: 'Foliage & Leaf Expansion Tonic',
    npkBreakdown: { n: 85, p: 50, k: 60 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Active leaf split phase benefits from gentle nitrogen support.',
    iconEmoji: '🌿',
    isFavorite: true,
    milestones: [
      '🌱 Adopted into your home 42 days ago',
      '🍃 New split fenestrated leaf opened last week',
      '💚 21-day thriving care streak!'
    ]
  },
  {
    id: 3,
    name: 'Rosie',
    nickname: 'Rosie 🌹',
    species: 'Hybrid Tea Rose (Rosa rubiginosa)',
    plantType: 'Rose',
    location: 'Outdoor Terrace',
    ageDays: 88,
    careStreakDays: 18,
    growthStage: 'Flowering',
    growthStageIndex: 2,
    deviceId: 'ESP32-003',
    moistureThreshold: 50,
    tempThreshold: 30,
    healthScore: 89,
    healthCondition: 'Vibrant Bloom',
    healthStatus: 'HEALTHY',
    healthMessage: 'Bud density is high and fragrance is blooming.',
    soilMoisture: 72,
    temperature: 26.5,
    humidity: 58,
    lastWatered: '3 hours ago',
    lastWateredNote: 'Given 200 mL terrace hydration.',
    lastFertilized: '4 days ago',
    lastFertilizedNote: 'Nourished with bloom booster.',
    nutrientFormula: 'Potassium Bloom Enhancer',
    npkBreakdown: { n: 55, p: 75, k: 95 },
    recommendedDoseMl: 10,
    fertilizerReason: 'Bud bloom phase benefits from elevated potassium levels.',
    iconEmoji: '🌹',
    isFavorite: false,
    milestones: [
      '🌱 Planted 88 days ago',
      '🌹 6 vibrant rose buds opened this week'
    ]
  },
  {
    id: 4,
    name: 'Pepper',
    nickname: 'Pepper 🌶️',
    species: 'Birdseye Chilli (Capsicum annuum)',
    plantType: 'Chilli',
    location: 'Sun Porch',
    ageDays: 30,
    careStreakDays: 5,
    growthStage: 'Fruiting',
    growthStageIndex: 3,
    deviceId: 'ESP32-004',
    moistureThreshold: 45,
    tempThreshold: 32,
    healthScore: 84,
    healthCondition: 'Getting Thirsty',
    healthStatus: 'ATTENTION',
    healthMessage: 'Pepper is getting a little thirsty, but overall in great spirit.',
    soilMoisture: 38,
    soilMoistureInterpretation: 'Your plant is getting thirsty 💧',
    temperature: 28.1,
    tempInterpretation: 'Warm, sunny climate.',
    humidity: 54,
    humidityInterpretation: 'Good air movement.',
    lastWatered: 'Yesterday, 06:00 PM',
    lastWateredNote: 'Given 100 mL evening drink.',
    lastFertilized: '5 days ago',
    lastFertilizedNote: 'Given chilli fruit booster.',
    nutrientFormula: 'Phosphorus & Potassium Fruit Retention Feed',
    npkBreakdown: { n: 50, p: 80, k: 90 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Fruiting stage retains flower sets and enhances chilli development.',
    iconEmoji: '🌶️',
    isFavorite: false,
    milestones: [
      '🌱 Planted 30 days ago',
      '🌶️ First green chilli pod set 3 days ago'
    ]
  }
];

export const INITIAL_HOURLY_READINGS = [
  { time: '00:00', moisture: 54, temp: 24.1, humidity: 68 },
  { time: '02:00', moisture: 53, temp: 23.8, humidity: 69 },
  { time: '04:00', moisture: 52, temp: 23.5, humidity: 70 },
  { time: '06:00', moisture: 50, temp: 24.0, humidity: 67 },
  { time: '08:00', moisture: 49, temp: 25.2, humidity: 65 },
  { time: '10:00', moisture: 48, temp: 27.4, humidity: 64 },
  { time: '12:00', moisture: 46, temp: 28.5, humidity: 61 },
  { time: '14:00', moisture: 45, temp: 29.1, humidity: 59 },
  { time: '16:00', moisture: 47, temp: 28.0, humidity: 62 },
  { time: '18:00', moisture: 52, temp: 26.2, humidity: 66 },
  { time: '20:00', moisture: 50, temp: 25.1, humidity: 67 },
  { time: '22:00', moisture: 49, temp: 24.5, humidity: 68 }
];

export const INITIAL_ALERTS = [
  {
    id: 'alert-1',
    severity: 'info',
    title: 'Your garden is being cared for 💚',
    description: 'All 4 plant companions are growing in comfortable conditions.',
    timestamp: '10 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Pepper is getting thirsty 💧',
    description: 'Soil hydration (38%) is approaching Pepper\'s watering comfort zone.',
    timestamp: '1 hour ago',
    acknowledged: false
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: 'Your garden connection is active 🌿',
    description: 'Garden gateway ping is clear and connected.',
    timestamp: '2 hours ago',
    acknowledged: true
  }
];

export const INITIAL_TIMELINE = [
  {
    id: 't-1',
    time: '10:32 AM',
    title: 'Morning Refreshment',
    description: 'Your plant received 120 mL of water.',
    type: 'watering',
    icon: '🌤️',
    amount: '120 mL'
  },
  {
    id: 't-2',
    time: '09:30 AM',
    title: 'Plant Nourishment Delivered',
    description: 'Plant nourishment was delivered (5 mL Phosphorus & Potassium).',
    type: 'fertilizer',
    icon: '🌿',
    amount: '5 mL'
  },
  {
    id: 't-3',
    time: '08:15 AM',
    title: 'Perfect Comfort Environment',
    description: 'Temperature was perfect for growth (27.4°C).',
    type: 'sensor',
    icon: '☀️',
    amount: '27.4°C'
  }
];

export const INITIAL_STATS = {
  waterUsedWeekLiters: '1.2 L',
  fertilizerUsedMl: '25 mL',
  waterSavingsPct: '32%',
  healthAvgPct: '91%',
  thrivingStreakDays: '14 Days'
};
