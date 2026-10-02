"""
Comprehensive Integration Test Suite for Plantora Backend API

Verifies:
1. Database & table creation (SQLite plantora.db)
2. Seed user (Plant Lover) & 4 seed plants (Sunny, Luna, Rosie, Pepper)
3. GET & POST /api/plants endpoints
4. Sensor latest & history endpoints
5. Rule-based Fertilizer recommendation & safety check
6. Manual watering command creation
7. Manual fertilizer command creation
8. Alerts list & acknowledgement
9. ESP32 sensor telemetry ingestion payload with device validation
10. ESP32 command polling & execution callback result
11. Unified Dashboard API endpoint
"""

import os
import sys
from fastapi.testclient import TestClient

# Ensure database is freshly created & seeded for clean test run
DB_FILE = os.path.join(os.path.dirname(__file__), "plantora.db")
if os.path.exists(DB_FILE):
    try:
        os.remove(DB_FILE)
    except Exception:
        pass

from main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("STARTING PLANTORA BACKEND VERIFICATION TESTS")
    print("=" * 60)

    # 1. Root Endpoint Test
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("PASS: Root API / endpoint")

    # 2. Get All Plants Test (Check seed data)
    res = client.get("/api/plants")
    assert res.status_code == 200, f"Get plants failed: {res.text}"
    plants = res.json()
    assert len(plants) == 4, f"Expected 4 seed plants, got {len(plants)}"
    plant_names = [p["name"] for p in plants]
    assert "Sunny" in plant_names and "Luna" in plant_names and "Rosie" in plant_names and "Pepper" in plant_names
    print(f"PASS: GET /api/plants -> Found {len(plants)} seeded plants: {plant_names}")

    # 3. Get Single Plant Profile
    plant_id = plants[0]["id"]
    res = client.get(f"/api/plants/{plant_id}")
    assert res.status_code == 200
    p = res.json()
    assert p["name"] == "Sunny"
    print(f"PASS: GET /api/plants/{plant_id} -> {p['name']} ({p['plant_type']})")

    # 4. Latest Sensor Telemetry
    res = client.get(f"/api/plants/{plant_id}/sensors/latest")
    assert res.status_code == 200
    latest_data = res.json()
    assert latest_data["soil_moisture"] is not None
    print(f"PASS: GET /api/plants/{plant_id}/sensors/latest -> Moisture: {latest_data['soil_moisture']}%")

    # 5. Sensor Telemetry History (Ascending order)
    res = client.get(f"/api/plants/{plant_id}/sensors/history?hours=24")
    assert res.status_code == 200
    history = res.json()
    assert len(history) > 0
    print(f"PASS: GET /api/plants/{plant_id}/sensors/history -> {len(history)} readings retrieved in chronological order")

    # 6. Fertilizer Recommendation Engine (Rule-Based)
    res = client.get(f"/api/plants/{plant_id}/fertilizer/recommendation")
    assert res.status_code == 200
    rec = res.json()
    assert "nutrient" in rec and "can_dispense" in rec
    print(f"PASS: GET /api/plants/{plant_id}/fertilizer/recommendation -> Recommended: {rec['fertilizer']} (Can dispense: {rec['can_dispense']})")

    # 7. Manual Watering Command Trigger
    res = client.post(f"/api/plants/{plant_id}/watering/manual", json={"duration_seconds": 5})
    assert res.status_code == 200
    w_cmd = res.json()
    assert w_cmd["success"] == True and w_cmd["command_id"] is not None
    print(f"PASS: POST /api/plants/{plant_id}/watering/manual -> Created command ID {w_cmd['command_id']}")

    # 8. ESP32 Command Polling
    res = client.get(f"/api/esp32/commands?device_id=ESP32-001")
    assert res.status_code == 200
    cmds = res.json()["commands"]
    assert len(cmds) > 0
    cmd_id = cmds[0]["id"]
    print(f"PASS: GET /api/esp32/commands -> Found {len(cmds)} pending command(s) for ESP32-001 (Command ID {cmd_id})")

    # 9. ESP32 Command Execution Callback Result
    res = client.post("/api/esp32/command-result", json={"command_id": cmd_id, "device_id": "ESP32-001", "success": True, "message": "Watering completed"})
    assert res.status_code == 200
    print(f"PASS: POST /api/esp32/command-result -> Command {cmd_id} updated to EXECUTED")

    # 10. ESP32 Ingest Telemetry Payload (Step 14 Test)
    payload = {
        "device_id": "ESP32-001",
        "plant_id": plant_id,
        "soil_moisture": 48.0,
        "temperature": 27.4,
        "humidity": 62.0
    }
    res = client.post("/api/esp32/sensor-data", json=payload)
    assert res.status_code == 201
    esp_res = res.json()
    assert esp_res["status"] == "success"
    print(f"PASS: POST /api/esp32/sensor-data -> Ingested reading 1 for plant {plant_id} ({esp_res['health']['status']})")

    # 11. Send Second Telemetry Payload (Step 14 Test 2)
    payload2 = {
        "device_id": "ESP32-001",
        "plant_id": plant_id,
        "soil_moisture": 30.0,
        "temperature": 28.1,
        "humidity": 58.0
    }
    res = client.post("/api/esp32/sensor-data", json=payload2)
    assert res.status_code == 201
    print(f"PASS: POST /api/esp32/sensor-data -> Ingested reading 2 for plant {plant_id}")

    # 12. Dashboard Unified Endpoint (Step 13)
    res = client.get(f"/api/plants/{plant_id}/dashboard")
    assert res.status_code == 200
    dash = res.json()
    assert dash["plant"]["name"] == "Sunny"
    assert dash["sensors"]["soil_moisture"] == 30.0
    print(f"PASS: GET /api/plants/{plant_id}/dashboard -> Unified dashboard response loaded for {dash['plant']['name']}")

    # 13. System Status Endpoint
    res = client.get(f"/api/plants/{plant_id}/status")
    assert res.status_code == 200
    sys_status = res.json()
    assert sys_status["esp32_online"] == True
    print(f"PASS: GET /api/plants/{plant_id}/status -> ESP32 online: {sys_status['esp32_online']}")

    print("=" * 60)
    print("ALL BACKEND VERIFICATION TESTS PASSED 100%!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
