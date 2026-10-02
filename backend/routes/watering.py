import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Plant, WateringEvent, Command
from schemas import WateringManualRequest, WateringEventResponse, WateringCommandResponse

router = APIRouter(prefix="/api/plants", tags=["Watering"])


@router.get("/{plant_id}/watering/history", response_model=List[WateringEventResponse])
def get_watering_history(
    plant_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    events = (
        db.query(WateringEvent)
        .filter(WateringEvent.plant_id == plant_id)
        .order_by(WateringEvent.timestamp.desc())
        .limit(limit)
        .all()
    )
    return events


@router.post("/{plant_id}/watering/manual", response_model=WateringCommandResponse)
def trigger_manual_watering(
    plant_id: int,
    request: WateringManualRequest,
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    duration_sec = request.duration_seconds
    estimated_ml = float(duration_sec * 15.0)

    # 1. Create Pending Watering Event record
    w_event = WateringEvent(
        plant_id=plant_id,
        duration_seconds=duration_sec,
        estimated_water_ml=estimated_ml,
        mode="manual",
        status="pending"
    )
    db.add(w_event)
    db.commit()
    db.refresh(w_event)

    # 2. Create Pending WATER Command for ESP32
    cmd = Command(
        plant_id=plant_id,
        command_type="WATER",
        parameters=json.dumps({
            "duration_seconds": duration_sec,
            "estimated_water_ml": estimated_ml,
            "watering_event_id": w_event.id
        }),
        status="PENDING"
    )
    db.add(cmd)
    db.commit()
    db.refresh(cmd)

    return WateringCommandResponse(
        success=True,
        command_id=cmd.id,
        message="Watering command created."
    )
