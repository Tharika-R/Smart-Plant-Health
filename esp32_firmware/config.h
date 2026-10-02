/**
 * Plantora ESP32 Firmware Configuration
 * 
 * Central configuration file for Wi-Fi credentials, backend API URL,
 * pin assignments, calibration thresholds, and safety caps.
 */

#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ============================================================================
// 1. MULTI-WIFI NETWORK CONFIGURATION (AUTO-CONNECTS TO AVAILABLE NETWORK)
// ============================================================================

struct KnownWiFi {
    const char* ssid;
    const char* password;
};

// Add your known Wi-Fi networks here (Home, College, Mobile Hotspot)
const KnownWiFi KNOWN_WIFI_NETWORKS[] = {
    { "Hello", "12345678" },     // Network 1 (e.g., Mobile Hotspot)
    { "Cit-Class",      "C!t@CLASS@2025" },  // Network 2 (e.g., Home Router)
    { "GIRLS HOSTEL ","citchennai@24" }   // Network 3 (e.g., College Wi-Fi)
};
const int NUM_KNOWN_NETWORKS = sizeof(KNOWN_WIFI_NETWORKS) / sizeof(KNOWN_WIFI_NETWORKS[0]);

// Default network & Backend URL set to your laptop IP (192.168.56.1)
#define WIFI_SSID           "Hello"
#define WIFI_PASSWORD       "12345678"               
#define BACKEND_URL         "http://192.168.56.1:8000"   // Updated with your Laptop IP (192.168.56.1)

#define DEVICE_ID           "ESP32-001"
#define PLANT_ID            1

// Telemetry & Command Polling Intervals (milliseconds)
#define SENSOR_SEND_INTERVAL_MS      30000   // Send sensor data every 30 seconds
#define COMMAND_CHECK_INTERVAL_MS    5000    // Check pending commands every 5 seconds
#define WIFI_RECONNECT_INTERVAL_MS   10000   // Wi-Fi reconnection retry delay

// ============================================================================
// 2. HARDWARE PIN ASSIGNMENTS
// ============================================================================
#define DHT_PIN             4       // DHT22 Data Pin
#define DHT_TYPE            DHT22   // Sensor Model (DHT22 / AM2302)

#define SOIL_MOISTURE_PIN   34      // Capacitive Soil Moisture Sensor Analog OUT (ADC1 Input-only)

#define WATER_PUMP_PIN      26      // Water Pump Relay/MOSFET Control Signal
#define FERTILIZER_PUMP_PIN 27      // Fertilizer Peristaltic Pump Relay/MOSFET Signal
#define FERTILIZER_VALVE_PIN 25     // Fertilizer Solenoid Valve Relay/MOSFET Signal

// ============================================================================
// 3. RELAY LOGIC & CALIBRATION CONSTANTS
// ============================================================================
#define RELAY_ACTIVE_LEVEL  HIGH    
#define RELAY_INACTIVE_LEVEL (!RELAY_ACTIVE_LEVEL)

// Capacitive Soil Moisture Sensor Calibration (Raw ADC 0-4095)
#define MOISTURE_DRY_RAW    3200    // Raw ADC reading in dry air (0% moisture)
#define MOISTURE_WET_RAW    1400    // Raw ADC reading in water (100% moisture)

// Fertilizer Peristaltic Pump Flow Rate Calibration (mL / second)
#define FERTILIZER_ML_PER_SECOND 1.0f  // Default: 1.0 mL per second

// ============================================================================
// 4. ACTUATOR SAFETY CAPS
// ============================================================================
#define MAX_WATER_DURATION_SECONDS   30     // Maximum allowed watering run time (seconds)
#define MAX_FERTILIZER_DOSE_ML       30.0f  // Maximum allowed fertilizer dose (mL)

// ============================================================================
// 5. TESTING & CALIBRATION MODE
// ============================================================================
#define CALIBRATION_MODE             false

#endif // CONFIG_H
