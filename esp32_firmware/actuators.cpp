/**
 * Actuators Subsystem Implementation
 */

#include "actuators.h"

void initActuators() {
    pinMode(WATER_PUMP_PIN, OUTPUT);
    pinMode(FERTILIZER_PUMP_PIN, OUTPUT);
    pinMode(FERTILIZER_VALVE_PIN, OUTPUT);

    // Default all outputs to INACTIVE state
    digitalWrite(WATER_PUMP_PIN, RELAY_INACTIVE_LEVEL);
    digitalWrite(FERTILIZER_PUMP_PIN, RELAY_INACTIVE_LEVEL);
    digitalWrite(FERTILIZER_VALVE_PIN, RELAY_INACTIVE_LEVEL);

    Serial.println("[Actuators] Relays and pump drivers initialized to INACTIVE state.");
}

ActuatorResult executeWatering(int duration_seconds) {
    ActuatorResult res;
    
    if (duration_seconds <= 0) {
        res.success = false;
        res.message = "Invalid watering duration requested.";
        return res;
    }

    // Safety Cap Enforcement
    int actual_duration = min(duration_seconds, (int)MAX_WATER_DURATION_SECONDS);

    Serial.println("==========================================");
    Serial.println("WATER COMMAND RECEIVED");
    Serial.printf("Requested Duration : %d seconds\n", duration_seconds);
    Serial.printf("Enforced Duration  : %d seconds (Max Cap: %d s)\n", actual_duration, MAX_WATER_DURATION_SECONDS);
    Serial.println("Pump               : ON");

    digitalWrite(WATER_PUMP_PIN, RELAY_ACTIVE_LEVEL);

    // Non-blocking millisecond sleep allowing system pings
    unsigned long start_time = millis();
    while (millis() - start_time < (unsigned long)(actual_duration * 1000)) {
        delay(10);
    }

    digitalWrite(WATER_PUMP_PIN, RELAY_INACTIVE_LEVEL);

    Serial.println("Pump               : OFF");
    Serial.println("Watering Command Completed Successfully.");
    Serial.println("==========================================");

    res.success = true;
    res.message = String("Watering completed: ") + actual_duration + " seconds irrigated.";
    return res;
}

ActuatorResult executeFertilization(float dose_ml) {
    ActuatorResult res;

    if (dose_ml <= 0.0f) {
        res.success = false;
        res.message = "Invalid fertilizer dose requested.";
        return res;
    }

    // Safety Cap Enforcement
    float actual_dose = min(dose_ml, MAX_FERTILIZER_DOSE_ML);
    
    // Calculate pump run duration based on flow rate calibration constant
    float pump_duration_sec = actual_dose / FERTILIZER_ML_PER_SECOND;
    unsigned long pump_duration_ms = (unsigned long)(pump_duration_sec * 1000.0f);

    Serial.println("==========================================");
    Serial.println("FERTILIZER COMMAND RECEIVED");
    Serial.printf("Requested Dose      : %.1f mL\n", dose_ml);
    Serial.printf("Enforced Dose       : %.1f mL (Max Cap: %.1f mL)\n", actual_dose, MAX_FERTILIZER_DOSE_ML);
    Serial.printf("Calculated Run Time : %.1f seconds (Flow Rate: %.2f mL/s)\n", pump_duration_sec, FERTILIZER_ML_PER_SECOND);
    
    // Step 1: Open Solenoid Valve
    Serial.println("Valve               : OPEN");
    digitalWrite(FERTILIZER_VALVE_PIN, RELAY_ACTIVE_LEVEL);
    delay(300); // Short settling delay for solenoid valve body

    // Step 2: Turn Peristaltic Pump ON
    Serial.println("Fertilizer Pump     : ON");
    digitalWrite(FERTILIZER_PUMP_PIN, RELAY_ACTIVE_LEVEL);

    // Run pump for calculated time
    unsigned long start_time = millis();
    while (millis() - start_time < pump_duration_ms) {
        delay(10);
    }

    // Step 3: Turn Peristaltic Pump OFF
    digitalWrite(FERTILIZER_PUMP_PIN, RELAY_INACTIVE_LEVEL);
    Serial.println("Fertilizer Pump     : OFF");
    delay(200);

    // Step 4: Close Solenoid Valve
    digitalWrite(FERTILIZER_VALVE_PIN, RELAY_INACTIVE_LEVEL);
    Serial.println("Valve               : CLOSED");

    Serial.println("Fertilizer Command Completed Successfully.");
    Serial.println("==========================================");

    res.success = true;
    res.message = String("Fertilizer dispensing completed: ") + actual_dose + " mL solution dosed.";
    return res;
}

void runCalibrationTest(int seconds) {
    Serial.println("[CALIBRATION MODE] Running fertilizer peristaltic pump for test duration...");
    digitalWrite(FERTILIZER_VALVE_PIN, RELAY_ACTIVE_LEVEL);
    delay(200);
    digitalWrite(FERTILIZER_PUMP_PIN, RELAY_ACTIVE_LEVEL);
    delay(seconds * 1000);
    digitalWrite(FERTILIZER_PUMP_PIN, RELAY_INACTIVE_LEVEL);
    delay(200);
    digitalWrite(FERTILIZER_VALVE_PIN, RELAY_INACTIVE_LEVEL);
    Serial.println("[CALIBRATION MODE] Test complete. Measure total dispensed volume in mL!");
}
