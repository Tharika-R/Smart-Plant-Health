import os
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from models import User, Plant, SensorReading, WateringEvent, FertilizerEvent, Alert, SystemStatus
from routes import plants, sensors, watering, fertilizer, alerts, esp32, ai_vision

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plantora Backend API",
    description="Smart Plant Watering & Health Monitoring System REST API (ESP32 Integration)",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(plants.router)
app.include_router(sensors.router)
app.include_router(watering.router)
app.include_router(fertilizer.router)
app.include_router(alerts.router)
app.include_router(esp32.router)
app.include_router(ai_vision.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Plantora Smart Plant Care API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


def seed_demo_data():
    """Seeds initial demo user, 4 demo plants, telemetry history, and alerts once if DB is empty."""
    db = SessionLocal()
    try:
        # Check if DB is already seeded
        if db.query(User).first() is not None:
            return

        print("Seeding initial Plantora demo data...")

        # 1. Create Demo User
        user = User(
            name="Plant Lover",
            email="demo@plantora.local"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # 2. Create 4 Demo Plants
        demo_plants_data = [
            {
                "name": "Sunny",
                "plant_type": "Tomato",
                "age_days": 55,
                "growth_stage": "Flowering",
                "location": "Balcony",
                "device_id": "ESP32-001",
                "moisture_threshold": 45.0,
                "temperature_threshold": 30.0,
                "base_moisture": 48.0
            },
            {
                "name": "Luna",
                "plant_type": "Monstera",
                "age_days": 42,
                "growth_stage": "Vegetative",
                "location": "Living Room",
                "device_id": "ESP32-002",
                "moisture_threshold": 40.0,
                "temperature_threshold": 28.0,
                "base_moisture": 68.0
            },
            {
                "name": "Rosie",
                "plant_type": "Rose",
                "age_days": 88,
                "growth_stage": "Flowering",
                "location": "Garden",
                "device_id": "ESP32-003",
                "moisture_threshold": 50.0,
                "temperature_threshold": 30.0,
                "base_moisture": 72.0
            },
            {
                "name": "Pepper",
                "plant_type": "Chilli",
                "age_days": 30,
                "growth_stage": "Fruiting",
                "location": "Balcony",
                "device_id": "ESP32-004",
                "moisture_threshold": 45.0,
                "temperature_threshold": 32.0,
                "base_moisture": 56.0
            }
        ]

        created_plants = []
        for pdata in demo_plants_data:
            plant = Plant(
                user_id=user.id,
                name=pdata["name"],
                plant_type=pdata["plant_type"],
                age_days=pdata["age_days"],
                growth_stage=pdata["growth_stage"],
                location=pdata["location"],
                device_id=pdata["device_id"],
                moisture_threshold=pdata["moisture_threshold"],
                temperature_threshold=pdata["temperature_threshold"]
            )
            db.add(plant)
            db.commit()
            db.refresh(plant)
            created_plants.append((plant, pdata["base_moisture"]))

            # Create System Status
            sys_status = SystemStatus(
                plant_id=plant.id,
                device_id=plant.device_id,
                esp32_online=True,
                soil_sensor_online=True,
                dht22_online=True,
                water_pump_ready=True,
                fertilizer_pump_ready=True,
                last_seen=datetime.utcnow()
            )
            db.add(sys_status)

        # 3. Create 24 Hours of Telemetry History for Each Plant
        now = datetime.utcnow()
        for plant, base_m in created_plants:
            for i in range(24, 0, -1):
                timestamp = now - timedelta(hours=i)
                # Realistic curve variations
                moisture_val = max(20.0, min(85.0, base_m - (i % 6) * 1.5 + (i % 4) * 0.8))
                temp_val = round(24.0 + (i % 8) * 0.4, 1)
                hum_val = round(60.0 + (i % 5) * 1.2, 1)

                reading = SensorReading(
                    plant_id=plant.id,
                    soil_moisture=round(moisture_val, 1),
                    temperature=temp_val,
                    humidity=hum_val,
                    timestamp=timestamp
                )
                db.add(reading)

        # 4. Seed Watering Events
        sunny = created_plants[0][0]
        luna = created_plants[1][0]

        w1 = WateringEvent(
            plant_id=sunny.id,
            duration_seconds=15,
            estimated_water_ml=225.0,
            mode="automatic",
            status="completed",
            timestamp=now - timedelta(hours=4)
        )
        w2 = WateringEvent(
            plant_id=luna.id,
            duration_seconds=10,
            estimated_water_ml=150.0,
            mode="manual",
            status="completed",
            timestamp=now - timedelta(hours=18)
        )
        db.add_all([w1, w2])

        # 5. Seed Fertilizer Events
        f1 = FertilizerEvent(
            plant_id=sunny.id,
            fertilizer_type="FloraBloom Organic Enhancer",
            nutrient="Phosphorus & Potassium Fruit Booster",
            dose_ml=15.0,
            mode="manual",
            status="completed",
            timestamp=now - timedelta(days=2)
        )
        db.add(f1)

        # 6. Seed Alerts
        a1 = Alert(
            plant_id=sunny.id,
            alert_type="MOISTURE_LOW",
            message="Soil moisture dropped below threshold (45%). Automatic watering scheduled.",
            severity="warning",
            acknowledged=True,
            timestamp=now - timedelta(hours=4)
        )
        a2 = Alert(
            plant_id=luna.id,
            alert_type="SYSTEM_INFO",
            message="Your garden is connected 🌿 Telemetry ping healthy.",
            severity="info",
            acknowledged=False,
            timestamp=now - timedelta(hours=1)
        )
        db.add_all([a1, a2])

        db.commit()
        print("Demo data seeded successfully!")

    except Exception as e:
        print("Error seeding demo data:", e)
        db.rollback()
    finally:
        db.close()


# Ensure demo data is seeded upon module import / server startup
seed_demo_data()
