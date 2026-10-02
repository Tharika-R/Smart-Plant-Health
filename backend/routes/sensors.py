from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db
from models import Plant, SensorReading

router = APIRouter(prefix="/api/plants", tags=["Sensors"])


@router.get("/{plant_id}/sensors/latest")
def get_latest_sensor_reading(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    latest = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )

    if not latest:
        return {
            "plant_id": plant_id,
            "soil_moisture": None,
            "temperature": None,
            "humidity": None,
            "timestamp": None,
            "has_data": False,
            "message": "No sensor data available yet"
        }

    return {
        "plant_id": plant_id,
        "soil_moisture": latest.soil_moisture,
        "temperature": latest.temperature,
        "humidity": latest.humidity,
        "timestamp": latest.timestamp.isoformat()
    }


@router.get("/{plant_id}/sensors/history")
def get_sensor_history(
    plant_id: int,
    hours: int = Query(24, ge=1, le=720),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    cutoff_time = datetime.utcnow() - timedelta(hours=hours)

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant_id, SensorReading.timestamp >= cutoff_time)
        .order_by(SensorReading.timestamp.asc())  # Oldest to newest for Recharts rendering
        .all()
    )

    return [
        {
            "soil_moisture": r.soil_moisture,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "timestamp": r.timestamp.isoformat()
        }
        for r in readings
    ]
