/**
 * Plantora Data Model & Default Companion State
 * 
 * Product: PLANTORA ("Your plants. Your little garden. Always cared for.")
 */

export const INITIAL_PLANTS = [
  {
    id: 1,
    name: 'Monstera',
    nickname: 'Monstera 🌿',
    species: 'Monstera Deliciosa (Swiss Cheese Plant)',
    plantType: 'Monstera',
    location: 'Living Room Corner',
    tagline: 'Your tropical beauty',
    ageDays: 42,
    careStreakDays: 21,
    growthStage: 'Vegetative',
    growthStageIndex: 1, // 0: Seedling, 1: Vegetative, 2: Flowering, 3: Fruiting
    deviceId: 'ESP32-001',
    moistureThreshold: 40,
    tempThreshold: 28,
    healthScore: 96,
    healthState: 'Thriving',
    healthStatus: 'HEALTHY',
    healthMessage: "She's getting everything she needs.",
    soilMoisture: 68,
    soilInterpretation: 'Healthy',
    temperature: 24,
    tempInterpretation: 'Comfortable',
    humidity: 64,
    humidityInterpretation: 'Good',
    lastWatered: 'Watered 2h ago',
    lastWateredAmountMl: 150,
    lastFertilized: '3 days ago',
    lastFertilizedAmountMl: 5,
    nutrientFormula: 'Foliage & Leaf Expansion Tonic',
    npkBreakdown: { n: 85, p: 50, k: 60 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Active leaf split phase benefits from gentle nitrogen support.',
    iconEmoji: '🌿',
    bgGradient: 'linear-gradient(135deg, #E8F0EC 0%, #D8E2DC 100%)',
    badgeColor: '#1B4332',
    isFavorite: true,
    milestones: [
      '🌱 Adopted into your home 42 days ago',
      '🍃 New split fenestrated leaf opened last week',
      '💚 21-day thriving care streak!'
    ]
  },
  {
    id: 2,
    name: 'Tomato',
    nickname: 'Sunny Tomato 🍅',
    species: 'Cherry Tomato (Solanum lycopersicum)',
    plantType: 'Tomato',
    location: 'Sunny Balcony',
    tagline: 'Your juicy balcony crop',
    ageDays: 55,
    careStreakDays: 14,
    growthStage: 'Flowering',
    growthStageIndex: 2,
    deviceId: 'ESP32-002',
    moistureThreshold: 45,
    tempThreshold: 30,
    healthScore: 84,
    healthState: 'Needs Water',
    healthStatus: 'ATTENTION',
    healthMessage: 'Moisture is getting a little low, but overall in great spirit.',
    soilMoisture: 38,
    soilInterpretation: 'Getting thirsty',
    temperature: 27,
    tempInterpretation: 'Warm & sunny',
    humidity: 60,
    humidityInterpretation: 'Good airflow',
    lastWatered: 'Yesterday at 09:00 AM',
    lastWateredAmountMl: 120,
    lastFertilized: '2 days ago',
    lastFertilizedAmountMl: 5,
    nutrientFormula: 'Phosphorus + Potassium Boost',
    npkBreakdown: { n: 65, p: 85, k: 90 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Your Tomato is entering the flowering stage. Based on its growth stage and current conditions, a phosphorus + potassium fertilizer is recommended.',
    iconEmoji: '🍅',
    bgGradient: 'linear-gradient(135deg, #FDECE8 0%, #FCE3DC 100%)',
    badgeColor: '#E07A5F',
    isFavorite: true,
    milestones: [
      '🌱 First sprout appeared 55 days ago',
      '🌼 First flower cluster bloomed 7 days ago',
      '💚 14-day thriving streak achieved!'
    ]
  },
  {
    id: 3,
    name: 'Peace Lily',
    nickname: 'Peace Lily 🌸',
    species: 'Spathiphyllum wallisii',
    plantType: 'Peace Lily',
    location: 'Bedroom Table',
    tagline: 'Your serene purifier',
    ageDays: 70,
    careStreakDays: 18,
    growthStage: 'Flowering',
    growthStageIndex: 2,
    deviceId: 'ESP32-003',
    moistureThreshold: 50,
    tempThreshold: 28,
    healthScore: 92,
    healthState: 'Thriving',
    healthStatus: 'HEALTHY',
    healthMessage: 'Looking peaceful and refreshed today.',
    soilMoisture: 72,
    soilInterpretation: 'Healthy',
    temperature: 25,
    tempInterpretation: 'Comfortable',
    humidity: 62,
    humidityInterpretation: 'Good',
    lastWatered: '3 hours ago',
    lastWateredAmountMl: 100,
    lastFertilized: '4 days ago',
    lastFertilizedAmountMl: 5,
    nutrientFormula: 'Gentle Bloom Support',
    npkBreakdown: { n: 60, p: 80, k: 70 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Serene white bloom phase benefits from mild nutrient balance.',
    iconEmoji: '🌸',
    bgGradient: 'linear-gradient(135deg, #F5F3EF 0%, #E8E5DF 100%)',
    badgeColor: '#52796F',
    isFavorite: false,
    milestones: [
      '🌱 Planted 70 days ago',
      '🌸 White flower spathe emerged 4 days ago'
    ]
  },
  {
    id: 4,
    name: 'Chilli',
    nickname: 'Pepper Chilli 🌶️',
    species: 'Birdseye Chilli (Capsicum annuum)',
    plantType: 'Chilli',
    location: 'Sun Porch',
    tagline: 'Your spicy companion',
    ageDays: 30,
    careStreakDays: 5,
    growthStage: 'Fruiting',
    growthStageIndex: 3,
    deviceId: 'ESP32-004',
    moistureThreshold: 45,
    tempThreshold: 32,
    healthScore: 88,
    healthState: 'Thriving',
    healthStatus: 'HEALTHY',
    healthMessage: 'Active fruit set is progressing nicely.',
    soilMoisture: 62,
    soilInterpretation: 'Healthy',
    temperature: 28,
    tempInterpretation: 'Warm & sunny',
    humidity: 55,
    humidityInterpretation: 'Good',
    lastWatered: 'Yesterday at 06:00 PM',
    lastWateredAmountMl: 100,
    lastFertilized: '5 days ago',
    lastFertilizedAmountMl: 5,
    nutrientFormula: 'Chilli Fruit Retention Feed',
    npkBreakdown: { n: 50, p: 80, k: 90 },
    recommendedDoseMl: 5,
    fertilizerReason: 'Fruiting stage retains flower sets and enhances spicy pepper growth.',
    iconEmoji: '🌶️',
    bgGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    badgeColor: '#F59E0B',
    isFavorite: false,
    milestones: [
      '🌱 Planted 30 days ago',
      '🌶️ First green chilli pod set 3 days ago'
    ]
  }
];

export const INITIAL_DIARY_ENTRIES = [
  {
    id: 'diary-1',
    plantId: 1,
    plantName: 'Monstera',
    date: 'August 10, 2026',
    time: '10:32 AM',
    title: 'New split leaf opened! 🍃',
    note: 'A beautiful new fenestrated leaf completely unrolled today! Leaves are looking shiny and happy.',
    type: 'growth',
    tag: 'Growth Milestone',
    imageUrl: null
  },
  {
    id: 'diary-2',
    plantId: 2,
    plantName: 'Tomato',
    date: 'August 9, 2026',
    time: '09:30 AM',
    title: 'First yellow flower cluster 🌼',
    note: 'The first flower cluster opened in full bloom. Applied 5 mL phosphorus & potassium boost.',
    type: 'nutrition',
    tag: 'Plant Feed',
    imageUrl: null
  },
  {
    id: 'diary-3',
    plantId: 3,
    plantName: 'Peace Lily',
    date: 'August 8, 2026',
    time: '08:15 AM',
    title: 'Morning drink & mist 💧',
    note: 'Gave a gentle 100 mL drink. Leaves purged dust and look vibrant.',
    type: 'watering',
    tag: 'Care Routine',
    imageUrl: null
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
    title: '✨ Your Monstera has been thriving for 21 days.',
    description: 'She is getting optimal light and comfortable hydration.',
    timestamp: '10 mins ago',
    acknowledged: false
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: '💧 Your Tomato is thirsty.',
    description: 'Soil moisture (38%) is getting low. Time for a refreshing drink.',
    timestamp: '1 hour ago',
    acknowledged: false
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: '☀️ It\'s warmer than usual today.',
    description: 'Temperature is 27°C, perfect for balcony crop growth.',
    timestamp: '2 hours ago',
    acknowledged: true
  }
];

export const NATURAL_INSIGHTS = [
  "Your Monstera's moisture has been stable this week.",
  "Your Tomato needed 18% more water this week due to warm sunny weather.",
  "Your Rose has been thriving for 7 days in a row!"
];
