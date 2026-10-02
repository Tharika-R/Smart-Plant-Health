/**
 * Sensors Subsystem Header
 */

#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>
#include <DHT.h>
#include "config.h"

struct SensorData {
    float soil_moisture_pct;
    uint16_t raw_soil_adc;
    float temperature_c;
    float humidity_pct;
    bool soil_sensor_online;
    bool dht22_online;
};

void initSensors();
SensorData readSensors();
void printSensorReadings(const SensorData& data);

#endif // SENSORS_H
