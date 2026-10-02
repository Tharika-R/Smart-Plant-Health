/**
 * Plantora ESP32 Firmware Main Entry Point
 * 
 * Hardware Controller for Smart Plant Watering & Nutrition System.
 */

#include <Arduino.h>
#include "config.h"
#include "sensors.h"
#include "actuators.h"
#include "communication.h"

// Non-blocking timer tracking
static unsigned long last_sensor_send_time = 0;
static unsigned long last_command_check_time = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("\nInitializing Plantora ESP32 Firmware Subsystems...");
    
    initActuators();
    initSensors();
    initWiFi();

    if (CALIBRATION_MODE) {
        Serial.println("\n[NOTICE] Firmware running in CALIBRATION MODE. Testing pump flow rate...");
        runCalibrationTest(10); // Run pump for 10 seconds to calibrate mL/second rate
    }

    Serial.println("\nSetup Complete. Entering Main Operational Loop.\n");
}

void loop() {
    // 1. Maintain Wi-Fi Connection in Background
    checkWiFiConnection();

    unsigned long current_time = millis();

    // 2. Telemetry Timer: Sample Sensors & Send Data to FastAPI Backend
    if (current_time - last_sensor_send_time >= SENSOR_SEND_INTERVAL_MS) {
        last_sensor_send_time = current_time;

        SensorData data = readSensors();
        printSensorReadings(data);
        sendSensorData(data);
    }

    // 3. Command System Timer: Poll Pending Actuator Commands from Backend
    if (current_time - last_command_check_time >= COMMAND_CHECK_INTERVAL_MS) {
        last_command_check_time = current_time;

        pollAndExecuteCommands();
    }

    // Small loop yield to prevent ESP32 watchdog reset
    delay(10);
}
