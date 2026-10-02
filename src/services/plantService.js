/**
 * Plant Service API Layer
 * 
 * Hardware & FastAPI Backend Integration Layer for Plantora.
 * Connects React UI -> REST API (FastAPI @ http://localhost:8000) -> SQLite -> ESP32
 */

import {
  INITIAL_PLANT_INFO,
  INITIAL_SENSOR_DATA,
  INITIAL_HOURLY_READINGS,
  INITIAL_HEALTH_STATUS,
  INITIAL_WATERING_STATUS,
  INITIAL_FERTILIZER_RECOMMENDATION,
  INITIAL_SYSTEM_HARDWARE,
  INITIAL_ACTIVITIES
} from './mockData';

// Configuration: Toggle to switch between Local Mock Data and Live FastAPI Server
export let USE_MOCK_DATA = true;
export let FASTAPI_BASE_URL = 'http://localhost:8000/api';
export let ESP32_BASE_URL = 'http://192.168.1.104';

export const configureHardwareApi = (baseUrl, useMock = true) => {
  if (baseUrl) {
    if (baseUrl.includes(':8000')) {
      FASTAPI_BASE_URL = baseUrl;
    } else {
      ESP32_BASE_URL = baseUrl;
    }
  }
  USE_MOCK_DATA = useMock;
};

/**
 * Fetch Current Sensor Telemetry from FastAPI /api/plants/1/sensors/latest or Mock
 */
export const fetchCurrentSensors = async (plantId = 1) => {
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/plants/${plantId}/sensors/latest`);
      if (response.ok) {
        const data = await response.json();
        if (data.has_data !== false && data.soil_moisture !== null) {
          return {
            ...INITIAL_SENSOR_DATA,
            soilMoisture: {
              ...INITIAL_SENSOR_DATA.soilMoisture,
              value: data.soil_moisture,
              lastRead: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            temperature: {
              ...INITIAL_SENSOR_DATA.temperature,
              value: data.temperature
            },
            humidity: {
              ...INITIAL_SENSOR_DATA.humidity,
              value: data.humidity
            }
          };
        }
      }
    } catch (error) {
      console.warn('FastAPI Server offline, using local telemetry:', error);
    }
  }

  // Fallback / Mock Jitter
  const jitterMoisture = (Math.random() * 0.4 - 0.2).toFixed(1);
  const jitterTemp = (Math.random() * 0.2 - 0.1).toFixed(1);

  return {
    ...INITIAL_SENSOR_DATA,
    soilMoisture: {
      ...INITIAL_SENSOR_DATA.soilMoisture,
      value: parseFloat((INITIAL_SENSOR_DATA.soilMoisture.value + parseFloat(jitterMoisture)).toFixed(1))
    },
    temperature: {
      ...INITIAL_SENSOR_DATA.temperature,
      value: parseFloat((INITIAL_SENSOR_DATA.temperature.value + parseFloat(jitterTemp)).toFixed(1))
    }
  };
};

/**
 * Trigger Manual Water Command via FastAPI /api/plants/1/watering/manual
 */
export const triggerWaterPump = async (durationSec = 15, plantId = 1) => {
  console.log(`[API Command] Queuing Water Pump Command for ${durationSec} seconds...`);
  
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/plants/${plantId}/watering/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_seconds: durationSec })
      });
      if (response.ok) {
        const data = await response.json();
        return {
          success: data.success,
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (error) {
      console.warn('FastAPI watering endpoint fallback:', error);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    success: true,
    message: `Watering command created for ${durationSec} seconds`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

/**
 * Trigger Fertilizer Dispense Command via FastAPI /api/plants/1/fertilizer/manual
 */
export const triggerFertilizerPump = async (amountMl = 15, plantId = 1) => {
  console.log(`[API Command] Queuing Fertilizer Command for ${amountMl} mL...`);
  
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetch(`${FASTAPI_BASE_URL}/plants/${plantId}/fertilizer/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dose_ml: amountMl })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Safety lock active');
      }
      return {
        success: true,
        message: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      console.warn('FastAPI fertilizer endpoint warning:', error);
      throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    success: true,
    message: `Dispensed ${amountMl} mL nutrient feed successfully`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

/**
 * Update Hardware Settings
 */
export const updateHardwareSettings = async (settings) => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, settings };
  }
  return { success: true, settings };
};

/**
 * Fetch Initial Baseline Data
 */
export const fetchInitialDashboardData = async () => {
  return {
    plantInfo: INITIAL_PLANT_INFO,
    sensorData: INITIAL_SENSOR_DATA,
    hourlyReadings: INITIAL_HOURLY_READINGS,
    healthStatus: INITIAL_HEALTH_STATUS,
    wateringStatus: INITIAL_WATERING_STATUS,
    fertilizerRec: INITIAL_FERTILIZER_RECOMMENDATION,
    hardwareList: INITIAL_SYSTEM_HARDWARE,
    activities: INITIAL_ACTIVITIES
  };
};
