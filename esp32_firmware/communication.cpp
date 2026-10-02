/**
 * Communication Subsystem Implementation with Multi-WiFi Auto-Failover
 */

#include "communication.h"

static unsigned long last_wifi_reconnect_attempt = 0;
static int current_network_idx = 0;

void initWiFi() {
    Serial.println();
    Serial.println("==========================================");
    Serial.println("PLANTORA ESP32 HARDWARE CONTROLLER");
    Serial.println("==========================================");
    Serial.println("Scanning for known Wi-Fi networks...");
    
    WiFi.mode(WIFI_STA);

    // Try connecting to known Wi-Fi networks in sequence
    for (int i = 0; i < NUM_KNOWN_NETWORKS; i++) {
        const char* ssid = KNOWN_WIFI_NETWORKS[i].ssid;
        const char* pass = KNOWN_WIFI_NETWORKS[i].password;

        if (strlen(ssid) == 0 || strcmp(ssid, "CHANGE_ME") == 0) continue;

        Serial.printf("Trying Wi-Fi Network [%d/%d]: %s ...\n", i + 1, NUM_KNOWN_NETWORKS, ssid);
        WiFi.disconnect();
        WiFi.begin(ssid, pass);

        int attempts = 0;
        while (WiFi.status() != WL_CONNECTED && attempts < 12) {
            delay(500);
            Serial.print(".");
            attempts++;
        }

        if (WiFi.status() == WL_CONNECTED) {
            current_network_idx = i;
            Serial.println("\n[Wi-Fi SUCCESS] Connected!");
            Serial.printf("Connected Network: %s\n", ssid);
            Serial.printf("ESP32 IP Address: %s\n", WiFi.localIP().toString().c_str());
            Serial.printf("Backend URL: %s\n", BACKEND_URL);
            Serial.printf("Plant ID: %d | Device ID: %s\n", PLANT_ID, DEVICE_ID);
            Serial.println("==========================================");
            return;
        }
        Serial.println(" [Failed/Not in range]");
    }

    // Fallback if none connected
    Serial.println("\n[Wi-Fi WARNING] Could not connect to any stored Wi-Fi networks.");
    Serial.println("Will retry connecting periodically in background...");
    Serial.println("==========================================");
}

void checkWiFiConnection() {
    if (WiFi.status() != WL_CONNECTED) {
        unsigned long now = millis();
        if (now - last_wifi_reconnect_attempt > WIFI_RECONNECT_INTERVAL_MS) {
            last_wifi_reconnect_attempt = now;
            current_network_idx = (current_network_idx + 1) % NUM_KNOWN_NETWORKS;
            
            const char* ssid = KNOWN_WIFI_NETWORKS[current_network_idx].ssid;
            const char* pass = KNOWN_WIFI_NETWORKS[current_network_idx].password;

            if (strlen(ssid) > 0 && strcmp(ssid, "CHANGE_ME") != 0) {
                Serial.printf("[Wi-Fi Retry] Attempting connection to: %s\n", ssid);
                WiFi.disconnect();
                WiFi.begin(ssid, pass);
            }
        }
    }
}

bool sendSensorData(const SensorData& data) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[HTTP Warning] Cannot send telemetry: Wi-Fi disconnected.");
        return false;
    }

    HTTPClient http;
    String endpoint = String(BACKEND_URL) + "/api/esp32/sensor-data";
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");

    // Construct JSON Payload
    StaticJsonDocument<256> doc;
    doc["device_id"] = DEVICE_ID;
    doc["plant_id"] = PLANT_ID;
    doc["soil_moisture"] = round(data.soil_moisture_pct * 10.0f) / 10.0f;
    doc["temperature"] = round(data.temperature_c * 10.0f) / 10.0f;
    doc["humidity"] = round(data.humidity_pct * 10.0f) / 10.0f;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);

    Serial.printf("[HTTP POST] %s -> Response Code: %d\n", endpoint.c_str(), httpResponseCode);
    if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("[Backend Reply] %s\n", response.c_str());
    } else {
        Serial.printf("[HTTP Error] POST failed: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
    return (httpResponseCode >= 200 && httpResponseCode < 300);
}

static void sendCommandResult(int command_id, bool success, const String& message) {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    String endpoint = String(BACKEND_URL) + "/api/esp32/command-result";
    http.begin(endpoint);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["command_id"] = command_id;
    doc["device_id"] = DEVICE_ID;
    doc["success"] = success;
    doc["message"] = message;

    String payload;
    serializeJson(doc, payload);

    int httpCode = http.POST(payload);
    Serial.printf("[HTTP Callback Result] Command %d -> HTTP %d\n", command_id, httpCode);

    http.end();
}

void pollAndExecuteCommands() {
    if (WiFi.status() != WL_CONNECTED) return;

    HTTPClient http;
    String endpoint = String(BACKEND_URL) + "/api/esp32/commands?device_id=" + String(DEVICE_ID);
    http.begin(endpoint);

    int httpCode = http.GET();
    if (httpCode == 200) {
        String payload = http.getString();
        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);

        if (!error && doc.containsKey("commands")) {
            JsonArray commands = doc["commands"].as<JsonArray>();
            for (JsonObject cmd : commands) {
                int cmd_id = cmd["id"];
                String cmd_type = cmd["command_type"].as<String>();
                JsonObject params = cmd["parameters"];

                Serial.printf("[Command System] Received Command ID %d: %s\n", cmd_id, cmd_type.c_str());

                ActuatorResult res;
                if (cmd_type == "WATER") {
                    int duration_sec = params["duration_seconds"] | 5;
                    res = executeWatering(duration_sec);
                } else if (cmd_type == "FERTILIZE") {
                    float dose_ml = params["dose_ml"] | 5.0f;
                    res = executeFertilization(dose_ml);
                } else {
                    res.success = false;
                    res.message = "Unknown command type received.";
                }

                // Send Result Callback back to Backend
                sendCommandResult(cmd_id, res.success, res.message);
            }
        }
    }

    http.end();
}
