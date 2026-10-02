/**
 * Mock Data for Smart Plant Watering & Health Monitoring System (ESP32 IoT Dashboard)
 * 
 * NOTE FOR STUDENTS & DEVELOPERS:
 * This file contains realistic sample telemetry data used strictly for UI demonstration.
 * When connecting your physical ESP32 micro-controller, update `plantService.js` to 
 * set `USE_MOCK_DATA = false` or provide your ESP32's local IP address / WebSocket URL in Settings.
 */

export const INITIAL_PLANT_INFO = {
  name: 'Tomato Plant',
  variety: 'Cherry Tomato (Solanum lycopersicum)',
  growthStage: 'Flowering',
  ageDays: 42,
  plantedDate: '2026-06-30',
  location: 'Greenhouse Bay 3 / Bench B',
  targetMoistureMin: 40,
  targetMoistureMax: 70,
  targetTempMin: 18,
  targetTempMax: 30,
  targetHumidityMin: 50,
  targetHumidityMax: 80,
  wateringSafetyIntervalHours: 4,
};

export const INITIAL_SENSOR_DATA = {
  soilMoisture: {
    value: 58.4,
    unit: '%',
    status: 'Optimal', // 'Optimal' | 'Low' | 'Critical' | 'High'
    trend: '+2.1%',
    trendType: 'up', // 'up' | 'down' | 'stable'
    min: 40,
    max: 70,
    lastRead: 'Just now'
  },
  temperature: {
    value: 24.6,
    unit: '°C',
    status: 'Optimal',
    trend: '-0.4°C',
    trendType: 'down',
    min: 18,
    max: 30,
    lastRead: 'Just now'
  },
  humidity: {
    value: 64.2,
    unit: '%',
    status: 'Optimal',
    trend: '+1.5%',
    trendType: 'up',
    min: 50,
    max: 80,
    lastRead: 'Just now'
  },
  systemStatus: {
    value: 'Online',
    unit: 'ESP32 v1.2',
    status: 'Healthy',
    trend: '99.8% uptime',
    trendType: 'stable',
    lastRead: 'Ping 14ms'
  }
};

// 24 Hour Historical Sensor Readings for Charts
export const INITIAL_HOURLY_READINGS = [
  { time: '00:00', moisture: 68, temperature: 21.2, humidity: 72 },
  { time: '01:00', moisture: 67, temperature: 21.0, humidity: 73 },
  { time: '02:00', moisture: 66, temperature: 20.8, humidity: 74 },
  { time: '03:00', moisture: 65, temperature: 20.5, humidity: 75 },
  { time: '04:00', moisture: 64, temperature: 20.2, humidity: 76 },
  { time: '05:00', moisture: 63, temperature: 20.4, humidity: 74 },
  { time: '06:00', moisture: 62, temperature: 21.1, humidity: 71 },
  { time: '07:00', moisture: 60, temperature: 22.3, humidity: 68 },
  { time: '08:00', moisture: 58, temperature: 23.5, humidity: 66 },
  { time: '09:00', moisture: 55, temperature: 24.8, humidity: 63 },
  { time: '10:00', moisture: 52, temperature: 25.9, humidity: 60 },
  { time: '11:00', moisture: 48, temperature: 27.1, humidity: 57 },
  { time: '12:00', moisture: 44, temperature: 28.3, humidity: 54 }, // Triggered Auto-Watering
  { time: '13:00', moisture: 72, temperature: 27.8, humidity: 58 }, // Post watering spike
  { time: '14:00', moisture: 69, temperature: 27.2, humidity: 61 },
  { time: '15:00', moisture: 66, temperature: 26.5, humidity: 62 },
  { time: '16:00', moisture: 63, temperature: 25.8, humidity: 63 },
  { time: '17:00', moisture: 61, temperature: 25.1, humidity: 64 },
  { time: '18:00', moisture: 60, temperature: 24.6, humidity: 65 },
  { time: '19:00', moisture: 59, temperature: 24.2, humidity: 66 },
  { time: '20:00', moisture: 58.8, temperature: 23.8, humidity: 67 },
  { time: '21:00', moisture: 58.6, temperature: 23.5, humidity: 68 },
  { time: '22:00', moisture: 58.5, temperature: 23.0, humidity: 70 },
  { time: '23:00', moisture: 58.4, temperature: 22.7, humidity: 71 },
];

export const INITIAL_HEALTH_STATUS = {
  overall: 'Healthy', // 'Healthy' | 'Attention' | 'Critical'
  score: 96,
  explanation: 'Soil moisture, ambient temperature, and relative humidity are within ideal target ranges for the flowering stage.',
  factors: [
    {
      name: 'Soil Moisture',
      status: 'Optimal',
      value: '58.4%',
      target: '40% - 70%',
      percentage: 85,
      note: 'Optimal root hydration level'
    },
    {
      name: 'Ambient Temperature',
      status: 'Optimal',
      value: '24.6 °C',
      target: '18°C - 30°C',
      percentage: 92,
      note: 'Favorable for flower pollination'
    },
    {
      name: 'Relative Humidity',
      status: 'Optimal',
      value: '64.2%',
      target: '50% - 80%',
      percentage: 88,
      note: 'Protects foliage from moisture stress'
    }
  ]
};

export const INITIAL_WATERING_STATUS = {
  pumpStatus: 'Idle', // 'Idle' | 'Active' | 'Cooldown'
  mode: 'Automatic', // 'Automatic' | 'Manual'
  lastWateringTime: 'Today at 12:05 PM',
  lastWateringAmountMl: 250,
  wateringCountToday: 1,
  totalWateringCount: 38,
  totalEstimatedWaterLiters: 9.5,
  moistureThreshold: 45,
  durationSec: 15,
};

export const INITIAL_FERTILIZER_RECOMMENDATION = {
  recommendedNutrient: 'Potassium & Phosphorus Booster (N-P-K 5-15-25)',
  recommendedFertilizer: 'FloraBloom Organic Bloom Enhancer',
  recommendedDoseMl: 15,
  doseUnit: 'mL',
  reason: 'Plant is currently in the active flowering phase (Day 42). Elevated Potassium and Phosphorus promote strong bloom retention and fruit development.',
  safeToDispense: true,
  minMoistureRequired: 30,
  lastDispensed: '2 days ago (15 mL)',
  totalDispensedMl: 120
};

export const INITIAL_SYSTEM_HARDWARE = [
  { name: 'ESP32 Microcontroller', componentId: 'ESP32-WROOM-32', status: 'Online', bus: 'WiFi (192.168.1.104)', iconName: 'Cpu' },
  { name: 'Capacitive Soil Moisture Sensor', componentId: 'v1.2 Analog', status: 'Optimal', bus: 'ADC Pin GPIO34', iconName: 'Droplets' },
  { name: 'DHT22 Temp & Humidity Sensor', componentId: 'DHT22 Digital', status: 'Optimal', bus: 'Digital Pin GPIO4', iconName: 'Thermometer' },
  { name: 'Submersible Water Pump Relay', componentId: '5V Single Relay', status: 'Ready', bus: 'GPIO16', iconName: 'Zap' },
  { name: 'Peristaltic Fertilizer Pump', componentId: '12V DC Pump Relay', status: 'Ready', bus: 'GPIO17', iconName: 'FlaskConical' },
];

export const INITIAL_ACTIVITIES = [
  {
    id: 1,
    type: 'watering',
    title: 'Automatic Soil Irrigation',
    description: 'Dispensed 250 mL of water (Soil moisture dropped below 45%)',
    timestamp: 'Today at 12:05 PM',
    status: 'success'
  },
  {
    id: 2,
    type: 'fertilizer',
    title: 'Organic Bloom Nutrient Dispensed',
    description: 'Dispensed 15 mL FloraBloom enhancer for flowering stage support',
    timestamp: '2 days ago at 09:30 AM',
    status: 'info'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Temperature Spike Notification',
    description: 'Ambient temperature reached 28.3°C. Fan airflow recommended.',
    timestamp: 'Yesterday at 01:15 PM',
    status: 'warning'
  },
  {
    id: 4,
    type: 'system',
    title: 'ESP32 Firmware Telemetry Ping',
    description: 'Firmware v1.2 self-diagnostic check completed without errors',
    timestamp: 'Yesterday at 08:00 AM',
    status: 'success'
  }
];
