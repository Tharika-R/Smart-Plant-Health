import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Plant, SensorReading, FertilizerEvent, Command
from schemas import (
    FertilizerManualRequest,
    FertilizerEventResponse,
    FertilizerRecommendationResponse,
    FertilizerCommandResponse
)
from services.fertilizer_rules import generate_fertilizer_recommendation

router = APIRouter(prefix="/api/plants", tags=["Fertilizer"])


@router.get("/{plant_id}/fertilizer/recommendation", response_model=FertilizerRecommendationResponse)
def get_fertilizer_recommendation(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    # Fetch latest soil moisture reading
    latest_sensor = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )
    soil_moisture = latest_sensor.soil_moisture if latest_sensor else 50.0

    # Fetch last fertilizer event timestamp
    last_fert = (
        db.query(FertilizerEvent)
        .filter(FertilizerEvent.plant_id == plant_id)
        .order_by(FertilizerEvent.timestamp.desc())
        .first()
    )
    
    days_since_last = None
    if last_fert and last_fert.timestamp:
        days_since_last = (datetime.utcnow() - last_fert.timestamp).total_seconds() / 86400.0

    rec = generate_fertilizer_recommendation(
        plant_type=plant.plant_type,
        growth_stage=plant.growth_stage,
        soil_moisture=soil_moisture,
        days_since_last_fertilizer=days_since_last
    )

    return FertilizerRecommendationResponse(**rec)


@router.get("/{plant_id}/fertilizer/history", response_model=List[FertilizerEventResponse])
def get_fertilizer_history(
    plant_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    events = (
        db.query(FertilizerEvent)
        .filter(FertilizerEvent.plant_id == plant_id)
        .order_by(FertilizerEvent.timestamp.desc())
        .limit(limit)
        .all()
    )
    return events


@router.post("/{plant_id}/fertilizer/manual", response_model=FertilizerCommandResponse)
def trigger_manual_fertilizer(
    plant_id: int,
    request: FertilizerManualRequest,
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    # Fetch latest soil moisture & last fertilizer event for safety evaluation
    latest_sensor = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant_id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )
    soil_moisture = latest_sensor.soil_moisture if latest_sensor else 50.0

    last_fert = (
        db.query(FertilizerEvent)
        .filter(FertilizerEvent.plant_id == plant_id)
        .order_by(FertilizerEvent.timestamp.desc())
        .first()
    )
    days_since_last = None
    if last_fert and last_fert.timestamp:
        days_since_last = (datetime.utcnow() - last_fert.timestamp).total_seconds() / 86400.0

    req_dose = request.dose_ml or 5.0

    # Evaluate safety rules
    rec = generate_fertilizer_recommendation(
        plant_type=plant.plant_type,
        growth_stage=plant.growth_stage,
        soil_moisture=soil_moisture,
        days_since_last_fertilizer=days_since_last,
        requested_dose_ml=req_dose
    )

    if not rec["can_dispense"]:
        return FertilizerCommandResponse(
            success=False,
            command_id=None,
            message=rec["warning"] or "The soil is too dry. Water your plant before fertilizing."
        )

    # 1. Create Pending Fertilizer Event
    f_event = FertilizerEvent(
        plant_id=plant_id,
        fertilizer_type=rec["fertilizer"],
        nutrient=rec["nutrient"],
        dose_ml=req_dose,
        mode="manual",
        status="pending"
    )
    db.add(f_event)
    db.commit()
    db.refresh(f_event)

    # 2. Create Pending Command for ESP32
    cmd = Command(
        plant_id=plant_id,
        command_type="FERTILIZE",
        parameters=json.dumps({
            "dose_ml": req_dose,
            "fertilizer_type": rec["fertilizer"],
            "fertilizer_event_id": f_event.id
        }),
        status="PENDING"
    )
    db.add(cmd)
    db.commit()
    db.refresh(cmd)

    return FertilizerCommandResponse(
        success=True,
        command_id=cmd.id,
        message="Fertilizer dispensing command created."
    )
