# Plantora Backend API

FastAPI REST API and SQLite Database for **Plantora** (*Smart Plant Watering & Health Monitoring System*).

---

## 🛠️ Requirements & Stack

- **Language**: Python 3.10+
- **Framework**: FastAPI + Uvicorn
- **Database**: SQLite (`plantora.db`) via SQLAlchemy ORM
- **Data Validation**: Pydantic v2

---

## 🚀 Quick Setup & Execution

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Create & activate a Python virtual environment

**Windows (PowerShell / Command Prompt):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI development server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📖 Interactive API Documentation

Once the server is running, access the interactive OpenAPI / Swagger documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔄 Resetting the SQLite Database

To reset the database back to clean seeded demo data:

1. Stop the running Uvicorn server (`Ctrl + C`).
2. Delete the database file:
   ```powershell
   Remove-Item plantora.db
   ```
3. Restart Uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The database `plantora.db` will be recreated and automatically seeded with 1 demo user (`Plant Lover`), 4 demo plants (`Sunny`, `Luna`, `Rosie`, `Pepper`), 24 hours of telemetry history, watering logs, and alerts.

---

## 📡 API Endpoint Overview

### Plants API
- `GET /api/plants`: List all plants with evaluated health status
- `POST /api/plants`: Create a new plant
- `GET /api/plants/{plant_id}`: Get single plant profile & health
- `PUT /api/plants/{plant_id}`: Update plant properties
- `DELETE /api/plants/{plant_id}`: Delete plant

### Sensors API
- `GET /api/plants/{plant_id}/sensors/latest`: Latest sensor reading + health status
- `GET /api/plants/{plant_id}/sensors/history`: Historical telemetry readings

### Watering API
- `GET /api/plants/{plant_id}/watering/history`: Irrigation event log
- `POST /api/plants/{plant_id}/watering/manual`: Trigger manual watering pump command

### Fertilizer API
- `GET /api/plants/{plant_id}/fertilizer/recommendation`: Rule-based nutrition recommendation & safety check
- `GET /api/plants/{plant_id}/fertilizer/history`: Fertilizer dispense history
- `POST /api/plants/{plant_id}/fertilizer/manual`: Dispense fertilizer (subject to dry soil safety locks)

### Alerts & System API
- `GET /api/plants/{plant_id}/alerts`: List alerts for plant
- `POST /api/alerts/{alert_id}/acknowledge`: Acknowledge an alert
- `GET /api/plants/{plant_id}/status`: ESP32 & sensor component diagnostic status

### ESP32 Hardware Integration API
- `POST /api/esp32/sensor-data`: Receive telemetry payload from physical ESP32
- `GET /api/esp32/commands`: Return pending actuator commands for ESP32
- `POST /api/esp32/command-result`: Receive execution outcome callback from ESP32
