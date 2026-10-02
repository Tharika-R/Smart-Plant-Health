# 🌿 Plantora Node.js Express Backend API

> **Node.js + Express + TypeScript + Prisma + PostgreSQL + Google Gemini API + ESP32**

This is the backend server for **Plantora — AI-Powered Smart Plant Care System**. It processes plant camera images via Google's **Gemini Vision API**, correlates visual leaf condition with live **ESP32 NPK soil sensor telemetry**, enforces backend safety limits for nutrient dosing, and manages peristaltic pump commands for physical hardware execution.

---

## 🏗️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **AI Provider**: **Google Gemini API ONLY** (`gemini-1.5-flash` Vision model) — *No OpenAI or third-party providers used.*
- **Authentication**: JWT & bcrypt password hashing
- **File Uploads**: Multer (stores JPG, PNG, WEBP images up to 10MB)

---

## 📡 Complete System Architecture & Flow

```text
USER (Camera / Gallery)
        ↓
Plantora Frontend
        ↓ POST /api/plant-vision/analyze (Multer Upload)
Node.js Express Backend
        ↓ (Image + Prompt)
Google Gemini 1.5 Flash Vision API
        ↓ Structured JSON Assessment
Backend Sensor Fusion (Merges Gemini Visual Assessment + ESP32 NPK Soil Sensor)
        ↓ Returns Recommendations
Frontend Displays: "🌿 Possible Nitrogen Deficiency (Confidence: 87%)"
        ↓ User Clicks "DISPENSE NITROGEN"
POST /api/fertilizer/dispense
        ↓ Backend Validates User, Ownership, Cooldown & Safety Cap (5 mL)
Fertilizer Command Created (Status: PENDING)
        ↓
ESP32 Polls GET /api/devices/:deviceId/commands
        ↓
ESP32 Activates Fertilizer Peristaltic Pump (5 mL)
        ↓
ESP32 Reports POST /api/devices/commands/:commandId/result (COMPLETED)
        ↓
Backend Records Fertilizer Event in History & Updates Command Status
```

---

## 🛠️ Environment Setup & Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend-node
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your `GEMINI_API_KEY` and PostgreSQL `DATABASE_URL`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/plantora_db?schema=public
   JWT_SECRET=super_secret_jwt_key_plantora_2026
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run Prisma Migrations & Seed Database**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Server will start at **`http://localhost:5000`**.

---

## 📜 API Endpoints Reference

### 🔐 Authentication
- **`POST /api/auth/register`**: Register a new user account.
- **`POST /api/auth/login`**: Authenticate and receive JWT token.

### 🌿 Plants Management
- **`POST /api/plants`**: Create a new plant companion.
- **`GET /api/plants`**: Fetch all plants for authenticated user.
- **`GET /api/plants/:id`**: Get plant details, recent sensor telemetry, and care history.

### 📷 Plant Vision Doctor (Gemini Vision API)
- **`POST /api/plant-vision/analyze`**: Accepts multipart image upload, calls Gemini 1.5 Flash Vision API, performs NPK sensor fusion, and returns structured JSON diagnosis.
- **`GET /api/plants/:id/vision-history`**: Retrieves history of AI vision checks for a plant.

### 📊 Sensors & Telemetry (ESP32)
- **`POST /api/devices/sensor-data`**: Receives live sensor readings (`soilMoisture`, `temperature`, `humidity`, `nitrogen`, `phosphorus`, `potassium`).
- **`GET /api/plants/:id/sensors/latest`**: Returns latest sensor reading.
- **`GET /api/plants/:id/sensors/history`**: Returns sensor historical readings.

### 🧪 Fertilizer & Safety Dosing Engine
- **`POST /api/fertilizer/dispense`**: Validates request, checks plant ownership, enforces safety caps (5 mL), checks 5-minute cooldown, and queues `PENDING` hardware command.
- **`GET /api/plants/:id/fertilizer-history`**: Fetches fertilizer event logs.

### 🤖 ESP32 Hardware Polling & Callback
- **`GET /api/devices/:deviceId/commands`**: ESP32 polls for pending actuator commands.
- **`POST /api/devices/commands/:commandId/result`**: ESP32 reports execution result (`COMPLETED` / `FAILED`).

---

## 🔒 Backend Safety & Protections

1. **No Frontend Arbitrary Dosing**: The frontend can ONLY send the nutrient type (`NITROGEN`, `PHOSPHORUS`, `POTASSIUM`). The backend retrieves the safe demo dose (`5.0 mL`) directly from `fertilizer_config`.
2. **Cooldown Guardrail**: Prevents duplicate dispensing if a plant was fertilized within the last 5 minutes.
3. **Command Expiration**: Commands auto-expire after 10 minutes if the ESP32 is offline.
4. **Gemini Uncertainty Principle**: Prompts Gemini to express visual observations with uncertainty (`LOW`, `NORMAL`, `UNCERTAIN`) rather than claiming to physically measure soil chemistry.
