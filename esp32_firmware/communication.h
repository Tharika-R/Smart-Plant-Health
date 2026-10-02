/**
 * Communication Subsystem Header
 */

#ifndef COMMUNICATION_H
#define COMMUNICATION_H

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config.h"
#include "sensors.h"
#include "actuators.h"

void initWiFi();
void checkWiFiConnection();
bool sendSensorData(const SensorData& data);
void pollAndExecuteCommands();

#endif // COMMUNICATION_H
