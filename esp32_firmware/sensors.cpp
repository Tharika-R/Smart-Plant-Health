/**
 * Sensors Subsystem Implementation
 */

#include "sensors.h"

static DHT dht(DHT_PIN, DHT_TYPE);

// Store last valid readings in case of temporary sensor dropout
static float last_valid_temp = 25.0f;
static float last_valid_humidity = 50.0f;

void initSensors() {
    analogReadResolution(12); // ESP32 12-bit ADC (0 - 4095)
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    dht.begin();
    Serial.println("[Sensors] DHT22 & Capacitive Moisture sensor initialized.");
}

SensorData readSensors() {
    SensorData data;
    
    // 1. Read Capacitive Soil Moisture Sensor (GPIO 34)
    uint32_t adc_sum = 0;
    const int num_samples = 10;
    for (int i = 0; i < num_samples; i++) {
        adc_sum += analogRead(SOIL_MOISTURE_PIN);
        delay(2);
    }
    data.raw_soil_adc = adc_sum / num_samples;
    data.soil_sensor_online = (data.raw_soil_adc > 100 && data.raw_soil_adc < 4050);

    // Constrain and map raw ADC to percentage 0% - 100%
    long raw_clamped = constrain((long)data.raw_soil_adc, 
                                 min((long)MOISTURE_DRY_RAW, (long)MOISTURE_WET_RAW), 
                                 max((long)MOISTURE_DRY_RAW, (long)MOISTURE_WET_RAW));
    
    // Reverse mapping because dry soil gives HIGHER raw ADC voltage than wet soil
    float moisture_pct = (float)(MOISTURE_DRY_RAW - raw_clamped) / (float)(MOISTURE_DRY_RAW - MOISTURE_WET_RAW) * 100.0f;
    data.soil_moisture_pct = constrain(moisture_pct, 0.0f, 100.0f);

    // 2. Read DHT22 Temperature & Humidity (GPIO 4)
    float raw_h = dht.readHumidity();
    float raw_t = dht.readTemperature();

    if (isnan(raw_h) || isnan(raw_t)) {
        Serial.println("[Sensors WARNING] Failed to read from DHT22 sensor! Retaining previous valid readings.");
        data.dht22_online = false;
        data.temperature_c = last_valid_temp;
        data.humidity_pct = last_valid_humidity;
    } else {
        data.dht22_online = true;
        data.temperature_c = raw_t;
        data.humidity_pct = raw_h;
        last_valid_temp = raw_t;
        last_valid_humidity = raw_h;
    }

    return data;
}

void printSensorReadings(const SensorData& data) {
    Serial.println("==========================================");
    Serial.printf("Raw Moisture ADC : %d\n", data.raw_soil_adc);
    Serial.printf("Soil Moisture %%  : %.1f %%\n", data.soil_moisture_pct);
    Serial.printf("Temperature      : %.1f C %s\n", data.temperature_c, data.dht22_online ? "" : "(Cached)");
    Serial.printf("Humidity         : %.1f %% %s\n", data.humidity_pct, data.dht22_online ? "" : "(Cached)");
    Serial.println("==========================================");
}
