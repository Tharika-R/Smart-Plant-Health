from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from database import get_db
from models import Plant, Alert, SystemStatus, SensorReading, WateringEvent, FertilizerEvent
from schemas import AlertResponse, SystemStatusResponse, DashboardResponse
from services.plant_health import evaluate_plant_health
from services.fertilizer_rules import generate_fertilizer_recommendation

router = APIRouter(tags=["Alerts, Status & Dashboard"])


@router.get("/api/plants/{plant_id}/alerts", response_model=List[AlertResponse])
def get_plant_alerts(
    plant_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    alerts = (
        db.query(Alert)
        .filter(Alert.plant_id == plant_id)
        .order_by(Alert.timestamp.desc())
        .limit(limit)
        .all()
    )
    return alerts


@router.post("/api/alerts/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    db.commit()
    db.refresh(alert)
    return alert


@router.get("/api/plants/{plant_id}/status", response_model=SystemStatusResponse)
def get_plant_system_status(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    sys_status = db.query(SystemStatus).filter(SystemStatus.plant_id == plant_id).first()
    if not sys_status:
        sys_status = SystemStatus(
            plant_id=plant_id,
            device_id=plant.device_id,
            esp32_online=True,
            soil_sensor_online=True,
            dht22_online=True,
            water_pump_ready=True,
            fertilizer_pump_ready=True,
            last_seen=datetime.utcnow()
        )
        db.add(sys_status)
        db.commit()
        db.refresh(sys_status)

    # Dynamic ESP32 Online Check: Consider offline if last_seen > 5 minutes (300 seconds) ago
    is_online = True
    if sys_status.last_seen:
        seconds_ago = (datetime.utcnow() - sys_status.last_seen).total_seconds()
        if seconds_ago > 300.0:
            is_online = False
            sys_status.esp32_online = False

    return SystemStatusResponse(
        esp32_online=is_online,
        soil_sensor_online=sys_status.soil_sensor_online if is_online else False,
        dht22_online=sys_status.dht22_online if is_online else False,
        water_pump_ready=sys_status.water_pump_ready,
        fertilizer_pump_ready=sys_status.fertilizer_pump_ready,
        last_seen=sys_status.last_seen
    )


@router.get("/api/plants/{plant_id}/dashboard", response_model=DashboardResponse)
def get_plant_dashboard(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    # 1. Fetch Latest Telemetry
    latest_reading = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )

    sensors_dict = None
    if latest_reading:
        sensors_dict = {
            "soil_moisture": latest_reading.soil_moisture,
            "temperature": latest_reading.temperature,
            "humidity": latest_reading.humidity,
            "timestamp": latest_reading.timestamp.isoformat()
        }
        health_eval = evaluate_plant_health(
            soil_moisture=latest_reading.soil_moisture,
            temperature=latest_reading.temperature,
            humidity=latest_reading.humidity,
            moisture_threshold=plant.moisture_threshold,
            temp_threshold=plant.temperature_threshold
        )
    else:
        health_eval = {
            "status": "HEALTHY",
            "message": "No sensor data available yet"
        }

    # 2. Fetch Device Status
    sys_status = db.query(SystemStatus).filter(SystemStatus.plant_id == plant_id).first()
    device_online = True
    last_seen_iso = None

    if sys_status and sys_status.last_seen:
        last_seen_iso = sys_status.last_seen.isoformat()
        if (datetime.utcnow() - sys_status.last_seen).total_seconds() > 300.0:
            device_online = False
    elif not sys_status:
        device_online = False

    device_dict = {
        "online": device_online,
        "last_seen": last_seen_iso
    }

    # 3. Fertilizer Recommendation
    last_fert = (
        db.query(FertilizerEvent)
        .filter(FertilizerEvent.plant_id == plant_id)
        .order_by(FertilizerEvent.timestamp.desc())
        .first()
    )
    days_since_fert = None
    if last_fert and last_fert.timestamp:
        days_since_fert = (datetime.utcnow() - last_fert.timestamp).total_seconds() / 86400.0

    soil_m = latest_reading.soil_moisture if latest_reading else 50.0
    fert_rec = generate_fertilizer_recommendation(
        plant_type=plant.plant_type,
        growth_stage=plant.growth_stage,
        soil_moisture=soil_m,
        days_since_last_fertilizer=days_since_fert
    )

    # 4. Recent Activity (Combine last 5 watering & fertilizer events)
    recent_watering = (
        db.query(WateringEvent)
        .filter(WateringEvent.plant_id == plant_id)
        .order_by(WateringEvent.timestamp.desc())
        .limit(5)
        .all()
    )
    recent_fertilizer = (
        db.query(FertilizerEvent)
        .filter(FertilizerEvent.plant_id == plant_id)
        .order_by(FertilizerEvent.timestamp.desc())
        .limit(5)
        .all()
    )

    activity_list = []
    for w in recent_watering:
        activity_list.append({
            "id": f"water-{w.id}",
            "type": "watering",
            "title": f"Irrigation ({w.duration_seconds}s)",
            "description": f"Dispensed ~{w.estimated_water_ml} mL water ({w.mode} mode)",
            "timestamp": w.timestamp.isoformat(),
            "status": w.status
        })

    for f in recent_fertilizer:
        activity_list.append({
            "id": f"fert-{f.id}",
            "type": "fertilizer",
            "title": f"Nutrient Dosed ({f.dose_ml} mL)",
            "description": f"{f.fertilizer_type} ({f.nutrient})",
            "timestamp": f.timestamp.isoformat(),
            "status": f.status
        })

    activity_list.sort(key=lambda x: x["timestamp"], reverse=True)

    # 5. Alerts List
    plant_alerts = (
        db.query(Alert)
        .filter(Alert.plant_id == plant_id)
        .order_by(Alert.timestamp.desc())
        .limit(5)
        .all()
    )
    alerts_dict = [
        {
            "id": a.id,
            "alert_type": a.alert_type,
            "message": a.message,
            "severity": a.severity,
            "acknowledged": a.acknowledged,
            "timestamp": a.timestamp.isoformat()
        }
        for a in plant_alerts
    ]

    return DashboardResponse(
        plant={
            "id": plant.id,
            "name": plant.name,
            "plant_type": plant.plant_type,
            "growth_stage": plant.growth_stage,
            "location": plant.location,
            "device_id": plant.device_id
        },
        health={
            "status": health_eval["status"],
            "message": health_eval["message"]
        },
        sensors=sensors_dict,
        device=device_dict,
        fertilizer=fert_rec,
        recent_activity=activity_list[:10],
        alerts=alerts_dict
    )
