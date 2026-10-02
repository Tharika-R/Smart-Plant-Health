from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, Field


# ------------------ USER SCHEMAS ------------------
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ------------------ PLANT SCHEMAS ------------------
class PlantBase(BaseModel):
    name: str
    plant_type: str
    age_days: int = 1
    growth_stage: str = "Vegetative"
    location: str = "Indoor"
    device_id: str
    moisture_threshold: float = 45.0
    temperature_threshold: float = 30.0

class PlantCreate(PlantBase):
    user_id: Optional[int] = 1

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    plant_type: Optional[str] = None
    age_days: Optional[int] = None
    growth_stage: Optional[str] = None
    location: Optional[str] = None
    device_id: Optional[str] = None
    moisture_threshold: Optional[float] = None
    temperature_threshold: Optional[float] = None

class PlantResponse(PlantBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    health_status: Optional[str] = "HEALTHY"
    health_message: Optional[str] = "Your plant is getting the care it needs."

    class Config:
        from_attributes = True


# ------------------ SENSOR READINGS SCHEMAS ------------------
class SensorReadingBase(BaseModel):
    soil_moisture: float
    temperature: float
    humidity: float

class SensorReadingCreate(SensorReadingBase):
    plant_id: int

class SensorReadingResponse(SensorReadingBase):
    id: int
    plant_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class SensorLatestResponse(BaseModel):
    plant_id: int
    soil_moisture: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    timestamp: Optional[datetime] = None
    has_data: bool = True
    message: Optional[str] = "Latest sensor telemetry"


# ------------------ WATERING SCHEMAS ------------------
class WateringManualRequest(BaseModel):
    duration_seconds: int = Field(5, ge=1, le=120)

class WateringCommandResponse(BaseModel):
    success: bool
    command_id: int
    message: str

class WateringEventResponse(BaseModel):
    id: int
    plant_id: int
    duration_seconds: int
    estimated_water_ml: float
    mode: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True


# ------------------ FERTILIZER SCHEMAS ------------------
class FertilizerManualRequest(BaseModel):
    dose_ml: Optional[float] = Field(5.0, ge=1.0, le=50.0)

class FertilizerCommandResponse(BaseModel):
    success: bool
    command_id: Optional[int] = None
    message: str

class FertilizerEventResponse(BaseModel):
    id: int
    plant_id: int
    fertilizer_type: str
    nutrient: str
    dose_ml: float
    mode: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class FertilizerRecommendationResponse(BaseModel):
    fertilizer: str
    nutrient: str
    dose_ml: float
    reason: str
    can_dispense: bool
    warning: Optional[str] = None


# ------------------ ALERT SCHEMAS ------------------
class AlertResponse(BaseModel):
    id: int
    plant_id: int
    alert_type: str
    message: str
    severity: str
    acknowledged: bool
    timestamp: datetime

    class Config:
        from_attributes = True


# ------------------ SYSTEM STATUS SCHEMAS ------------------
class SystemStatusResponse(BaseModel):
    esp32_online: bool
    soil_sensor_online: bool
    dht22_online: bool
    water_pump_ready: bool
    fertilizer_pump_ready: bool
    last_seen: Optional[datetime] = None

    class Config:
        from_attributes = True


# ------------------ COMMAND SCHEMAS ------------------
class ESP32CommandItem(BaseModel):
    id: int
    command_type: str
    parameters: Optional[Dict[str, Any]] = None

class ESP32CommandsResponse(BaseModel):
    commands: List[ESP32CommandItem]


# ------------------ ESP32 ENDPOINT PAYLOADS ------------------
class ESP32SensorPayload(BaseModel):
    device_id: str
    plant_id: int
    soil_moisture: float
    temperature: float
    humidity: float

class ESP32CommandResultPayload(BaseModel):
    command_id: int
    device_id: str
    success: bool
    message: Optional[str] = "Execution completed"


# ------------------ DASHBOARD UNIFIED SCHEMA ------------------
class DashboardResponse(BaseModel):
    plant: Dict[str, Any]
    health: Dict[str, Any]
    sensors: Optional[Dict[str, Any]] = None
    device: Dict[str, Any]
    fertilizer: Dict[str, Any]
    recent_activity: List[Dict[str, Any]]
    alerts: List[Dict[str, Any]]
