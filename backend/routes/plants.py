from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Plant, SensorReading
from schemas import PlantCreate, PlantUpdate, PlantResponse
from services.plant_health import evaluate_plant_health

router = APIRouter(prefix="/api/plants", tags=["Plants"])


def _attach_health(plant: Plant, db: Session) -> dict:
    latest_reading = (
        db.query(SensorReading)
        .filter(SensorReading.plant_id == plant.id)
        .order_by(SensorReading.timestamp.desc())
        .first()
    )
    
    if latest_reading:
        eval_res = evaluate_plant_health(
            soil_moisture=latest_reading.soil_moisture,
            temperature=latest_reading.temperature,
            humidity=latest_reading.humidity,
            moisture_threshold=plant.moisture_threshold,
            temp_threshold=plant.temperature_threshold
        )
        health_status = eval_res["status"]
        health_message = eval_res["message"]
    else:
        health_status = "HEALTHY"
        health_message = "Your plant is registered and awaiting telemetry data."

    plant_dict = {
        "id": plant.id,
        "user_id": plant.user_id,
        "name": plant.name,
        "plant_type": plant.plant_type,
        "age_days": plant.age_days,
        "growth_stage": plant.growth_stage,
        "location": plant.location,
        "device_id": plant.device_id,
        "moisture_threshold": plant.moisture_threshold,
        "temperature_threshold": plant.temperature_threshold,
        "created_at": plant.created_at,
        "updated_at": plant.updated_at,
        "health_status": health_status,
        "health_message": health_message
    }
    return plant_dict


@router.get("", response_model=List[PlantResponse])
def get_all_plants(db: Session = Depends(get_db)):
    plants = db.query(Plant).all()
    return [_attach_health(p, db) for p in plants]


@router.post("", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(plant_in: PlantCreate, db: Session = Depends(get_db)):
    db_plant = Plant(
        user_id=plant_in.user_id or 1,
        name=plant_in.name,
        plant_type=plant_in.plant_type,
        age_days=plant_in.age_days,
        growth_stage=plant_in.growth_stage,
        location=plant_in.location,
        device_id=plant_in.device_id,
        moisture_threshold=plant_in.moisture_threshold,
        temperature_threshold=plant_in.temperature_threshold
    )
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return _attach_health(db_plant, db)


@router.get("/{plant_id}", response_model=PlantResponse)
def get_plant_by_id(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return _attach_health(plant, db)


@router.put("/{plant_id}", response_model=PlantResponse)
def update_plant(plant_id: int, plant_in: PlantUpdate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    update_data = plant_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(plant, field, val)

    db.commit()
    db.refresh(plant)
    return _attach_health(plant, db)


@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    db.delete(plant)
    db.commit()
    return None
