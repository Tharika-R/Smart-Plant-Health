/**
 * Actuators Subsystem Header
 */

#ifndef ACTUATORS_H
#define ACTUATORS_H

#include <Arduino.h>
#include "config.h"

struct ActuatorResult {
    bool success;
    String message;
};

void initActuators();
ActuatorResult executeWatering(int duration_seconds);
ActuatorResult executeFertilization(float dose_ml);
void runCalibrationTest(int seconds);

#endif // ACTUATORS_H
