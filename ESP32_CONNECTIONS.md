# Plantora ESP32 Hardware Integration & Demonstration Guide

Complete hardware documentation, wiring assignments, portable demonstration setup guide, safety warnings, calibration guide, and testing protocol for **Plantora** (*Smart Plant Watering & Nutrition System*).

---

## 🚀 Portable Demonstration Checklist (Before Each Demo)

Perform these steps before demonstrating the project on a new Wi-Fi network or Windows laptop:

1. **Connect laptop and ESP32 to the same Wi-Fi network or Mobile Hotspot.**
2. **Find the laptop's IPv4 address:**
   - Open Command Prompt (`cmd`) on Windows and run `ipconfig`.
   - Locate the **IPv4 Address** under your active Wi-Fi or Hotspot adapter (e.g. `192.168.1.100` or `192.168.43.50`).
3. **Start the FastAPI backend listening on all interfaces (`0.0.0.0`):**
   ```bash
   cd backend
   .\venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
4. **Open [esp32_firmware/config.h](file:///c:/Users/swaytha/Desktop/Done_Dusted_proj/SmartPot/esp32_firmware/config.h) and set your network credentials:**
   ```cpp
   #define WIFI_SSID           "YOUR_WIFI_NAME"        // Wi-Fi or Phone Hotspot Name
   #define WIFI_PASSWORD       "YOUR_WIFI_PASSWORD"    // Wi-Fi or Phone Hotspot Password
   #define BACKEND_URL         "http://192.168.1.100:8000" // Replace with laptop IPv4 from step 2
   ```
5. **Upload the firmware** to the ESP32 board using Arduino IDE.
6. **Verify the ESP32 can reach the backend:**
   - Open Arduino Serial Monitor (`115200` baud).
   - Confirm it prints:
     ```
     WiFi connecting...
     WiFi connected
     ESP32 IP: ...
     Backend URL: http://192.168.1.100:8000
     [HTTP POST] http://192.168.1.100:8000/api/esp32/sensor-data -> Response Code: 201
     ```

---

## 📌 1. Pin Assignment & Connection Table

| Component | ESP32 Pin | Signal Type | Operating Voltage | Ground Connection | Purpose |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **DHT22 Sensor** | **GPIO 4** | Digital Data | 3.3V (or 5V) | Common GND | Ambient Temperature & Humidity |
| **Capacitive Moisture Sensor** | **GPIO 34** | Analog Input (ADC1_CH6) | 3.3V | Common GND | Soil Moisture level (Input-only ADC1 pin) |
| **Water Pump Relay / Driver** | **GPIO 26** | Digital Output | 3.3V Logic | Common GND | Triggers 12V/5V Submersible Water Pump |
| **Fertilizer Peristaltic Pump** | **GPIO 27** | Digital Output | 3.3V Logic | Common GND | Triggers 12V Peristaltic Nutrient Pump |
| **Fertilizer Solenoid Valve** | **GPIO 25** | Digital Output | 3.3V Logic | Common GND | Opens/Closes Fertilizer Supply Line |

---

## ⚡ 2. Critical Power & Electrical Safety Warnings

> [!CAUTION]
> **DO NOT power pumps or solenoid valves directly from ESP32 GPIO pins!**
> ESP32 GPIO pins are rated for maximum 12mA–20mA current. Pumps and valves draw 200mA to 2.0A which will permanently destroy the ESP32 microcontroller. Always use relay modules or MOSFET drivers (e.g. IRFZ44N or L298N module).

> [!IMPORTANT]
> **COMMON GROUND REQUIREMENT**:
> Connect the Ground (`GND`) pin of your ESP32 board to the negative (`-`) terminal of your external 12V/5V DC power supply. Without a shared common ground, relay signals will trigger erratically or fail.

> [!WARNING]
> **PHYSICAL SEPARATION**:
> Keep water tanks, liquid fertilizer solutions, and silicon tubing strictly below or isolated from electronics and the ESP32 development board. Enclose electronics in a waterproof junction box.

---

## 📚 3. Required Arduino IDE Libraries

Install the following libraries using the **Arduino IDE Library Manager** (`Ctrl + Shift + I`):

1. **ArduinoJson** (by *Benoît Blanchon*) — Version 6.x or 7.x
2. **DHT sensor library** (by *Adafruit*) — Version 1.4.x
3. **Adafruit Unified Sensor** (by *Adafruit*) — Dependency for DHT library
4. **WiFi** (built into ESP32 Arduino Board Package)
5. **HTTPClient** (built into ESP32 Arduino Board Package)

---

## 🧪 4. Calibration Procedure

### A. Capacitive Soil Moisture Calibration
1. Upload code and open Serial Monitor (`115200` baud).
2. Note raw ADC reading when sensor is suspended in **dry air**. Update `MOISTURE_DRY_RAW` in `config.h` (Default: `3200`).
3. Submerge sensor tip in a glass of **water** up to the white line. Update `MOISTURE_WET_RAW` in `config.h` (Default: `1400`).

### B. Fertilizer Flow Rate Calibration
1. In `config.h`, set `#define CALIBRATION_MODE true`.
2. Submerge inlet tubing in fertilizer solution and place outlet in a graduated cylinder.
3. Power on ESP32. The pump will run for 10 seconds.
4. Measure total volume in mL. Calculate:
   $$\text{FERTILIZER\_ML\_PER\_SECOND} = \frac{\text{Measured Volume (mL)}}{10.0}$$
5. Update `FERTILIZER_ML_PER_SECOND` in `config.h` and reset `CALIBRATION_MODE` to `false`.

---

## 📋 5. Sequential 13-Step Testing Protocol

Perform hardware testing in this exact order. **Disconnect tubing from plants during initial tests!**

| Step | Action | Expected Outcome |
| :---: | :--- | :--- |
| **TEST 1** | Power ESP32 via USB | Power LED illuminates, Serial Monitor outputs initial boot banner |
| **TEST 2** | Wi-Fi Connection | Serial displays `WiFi connected` and prints ESP32 IP |
| **TEST 3** | DHT22 Sensor Test | Temperature (°C) and Humidity (%) print to Serial Monitor |
| **TEST 4** | Soil Moisture Sensor Test | Raw ADC and mapped percentage (0–100%) print to Serial |
| **TEST 5** | Telemetry Post | Serial prints `[HTTP POST] ... /api/esp32/sensor-data -> Response Code: 201` |
| **TEST 6** | Dashboard UI Check | Open `http://127.0.0.1:5173/` and verify live sensor readings display |
| **TEST 7** | Manual Water Command | In React UI or Swagger, click "Water Now" (5 seconds) |
| **TEST 8** | ESP32 Command Polling | Serial prints `WATER COMMAND RECEIVED` |
| **TEST 9** | Short Pump Run | Water relay switches ON for 5s, then switches OFF |
| **TEST 10** | Manual Fertilizer Command | In React UI or Swagger, click "Dispense Fertilizer" (5 mL) |
| **TEST 11** | Valve Activation | Solenoid Valve relay opens (`Valve: OPEN`) |
| **TEST 12** | Fertilizer Pump Run | Peristaltic pump runs for calibrated duration (5s) then turns OFF; Valve closes |
| **TEST 13** | Callback Result | Backend receives `POST /api/esp32/command-result` and marks command `EXECUTED` |
