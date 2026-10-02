import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Plant, SensorReading, SystemStatus, Alert, Command, WateringEvent, FertilizerEvent
from schemas import ESP32SensorPayload, ESP32CommandResultPayload, ESP32CommandsResponse, ESP32CommandItem
from services.plant_health import evaluate_plant_health

router = APIRouter(prefix="/api/esp32", tags=["ESP32 Hardware APIs"])


@router.post("/sensor-data", status_code=status.HTTP_201_CREATED)
def receive_esp32_sensor_data(
    payload: ESP32SensorPayload,
    db: Session = Depends(get_db)
):
    # 1. Validate Plant existence
    plant = db.query(Plant).filter(Plant.id == payload.plant_id).first()
    if not plant:
        raise HTTPException(
            status_code=404,
            detail=f"Plant with ID {payload.plant_id} not found."
        )

    # 2. Verify device belongs to plant
    if plant.device_id != payload.device_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Device {payload.device_id} does not belong to plant ID {payload.plant_id} (Expected {plant.device_id})."
        )

    now = datetime.utcnow()

    # 3. Store Sensor Reading in sensor_readings table
    reading = SensorReading(
        plant_id=payload.plant_id,
        soil_moisture=payload.soil_moisture,
        temperature=payload.temperature,
        humidity=payload.humidity,
        timestamp=now
    )
    db.add(reading)

    # 4. Update System Status & ESP32 last_seen
    sys_status = db.query(SystemStatus).filter(SystemStatus.plant_id == payload.plant_id).first()
    if sys_status:
        sys_status.device_id = payload.device_id
        sys_status.esp32_online = True
        sys_status.soil_sensor_online = True
        sys_status.dht22_online = True
        sys_status.last_seen = now
    else:
        sys_status = SystemStatus(
            plant_id=payload.plant_id,
            device_id=payload.device_id,
            esp32_online=True,
            soil_sensor_online=True,
            dht22_online=True,
            water_pump_ready=True,
            fertilizer_pump_ready=True,
            last_seen=now
        )
        db.add(sys_status)

    # 5. Evaluate Health & Generate Alerts if needed
    health_eval = evaluate_plant_health(
        soil_moisture=payload.soil_moisture,
        temperature=payload.temperature,
        humidity=payload.humidity,
        moisture_threshold=plant.moisture_threshold,
        temp_threshold=plant.temperature_threshold
    )

    if health_eval["status"] in ["CRITICAL", "ATTENTION"]:
        # Prevent duplicate unacknowledged alerts of same severity
        existing_alert = (
            db.query(Alert)
            .filter(
                Alert.plant_id == payload.plant_id,
                Alert.acknowledged == False,
                Alert.severity == health_eval["severity"]
            )
            .first()
        )
        if not existing_alert:
            alert = Alert(
                plant_id=payload.plant_id,
                alert_type="SENSOR_WARNING",
                message=health_eval["message"],
                severity=health_eval["severity"],
                acknowledged=False,
                timestamp=now
            )
            db.add(alert)

    db.commit()

    return {
        "status": "success",
        "message": "Sensor data stored successfully",
        "plant_id": payload.plant_id,
        "health": health_eval
    }


@router.get("/commands", response_model=ESP32CommandsResponse)
def get_pending_esp32_commands(
    device_id: str = Query(..., description="ESP32 Device Identifier"),
    db: Session = Depends(get_db)
):
    plant = db.query(Plant).filter(Plant.device_id == device_id).first()
    if not plant:
        return ESP32CommandsResponse(commands=[])

    pending_cmds = (
        db.query(Command)
        .filter(Command.plant_id == plant.id, Command.status == "PENDING")
        .order_by(Command.created_at.asc())
        .all()
    )

    cmd_list = []
    for c in pending_cmds:
        parsed_params = None
        if c.parameters:
            try:
                parsed_params = json.loads(c.parameters)
            except Exception:
                parsed_params = {"raw": c.parameters}

        cmd_list.append(ESP32CommandItem(
            id=c.id,
            command_type=c.command_type,
            parameters=parsed_params
        ))

    return ESP32CommandsResponse(commands=cmd_list)


@router.post("/command-result")
def receive_esp32_command_result(
    payload: ESP32CommandResultPayload,
    db: Session = Depends(get_db)
):
    cmd = db.query(Command).filter(Command.id == payload.command_id).first()
    if not cmd:
        raise HTTPException(
            status_code=404,
            detail=f"Command with ID {payload.command_id} not found."
        )

    now = datetime.utcnow()

    # Update ESP32 last_seen in SystemStatus
    sys_status = db.query(SystemStatus).filter(SystemStatus.plant_id == cmd.plant_id).first()
    if sys_status:
        sys_status.esp32_online = True
        sys_status.last_seen = now

    if payload.success:
        cmd.status = "EXECUTED"
        cmd.executed_at = now

        # Update or create associated event
        if cmd.parameters:
            try:
                params = json.loads(cmd.parameters)
                if "watering_event_id" in params:
                    we = db.query(WateringEvent).filter(WateringEvent.id == params["watering_event_id"]).first()
                    if we:
                        we.status = "completed"
                elif "fertilizer_event_id" in params:
                    fe = db.query(FertilizerEvent).filter(FertilizerEvent.id == params["fertilizer_event_id"]).first()
                    if fe:
                        fe.status = "completed"
            except Exception:
                pass
    else:
        cmd.status = "FAILED"
        cmd.executed_at = now

        # Create alert for command failure
        alert = Alert(
            plant_id=cmd.plant_id,
            alert_type="COMMAND_FAILED",
            message=f"Hardware command {cmd.command_type} failed: {payload.message}",
            severity="warning",
            acknowledged=False,
            timestamp=now
        )
        db.add(alert)

    db.commit()

    return {
        "success": payload.success,
        "command_id": payload.command_id,
        "message": f"Command {payload.command_id} marked as {cmd.status}"
    }
