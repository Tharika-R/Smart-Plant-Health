from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    plants = relationship("Plant", back_populates="owner", cascade="all, delete-orphan")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    plant_type = Column(String(100), nullable=False)
    age_days = Column(Integer, default=1)
    growth_stage = Column(String(50), default="Vegetative")
    location = Column(String(100), default="Indoor")
    device_id = Column(String(50), index=True, nullable=False)
    moisture_threshold = Column(Float, default=45.0)
    temperature_threshold = Column(Float, default=30.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="plants")
    sensor_readings = relationship("SensorReading", back_populates="plant", cascade="all, delete-orphan")
    watering_events = relationship("WateringEvent", back_populates="plant", cascade="all, delete-orphan")
    fertilizer_events = relationship("FertilizerEvent", back_populates="plant", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="plant", cascade="all, delete-orphan")
    system_status = relationship("SystemStatus", back_populates="plant", cascade="all, delete-orphan")
    commands = relationship("Command", back_populates="plant", cascade="all, delete-orphan")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    soil_moisture = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    plant = relationship("Plant", back_populates="sensor_readings")


class WateringEvent(Base):
    __tablename__ = "watering_events"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    estimated_water_ml = Column(Float, nullable=False)
    mode = Column(String(20), default="manual")  # 'automatic' | 'manual'
    status = Column(String(20), default="pending")  # 'completed' | 'failed' | 'pending'
    timestamp = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant", back_populates="watering_events")


class FertilizerEvent(Base):
    __tablename__ = "fertilizer_events"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    fertilizer_type = Column(String(100), nullable=False)
    nutrient = Column(String(100), nullable=False)
    dose_ml = Column(Float, nullable=False)
    mode = Column(String(20), default="manual")
    status = Column(String(20), default="completed")
    timestamp = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant", back_populates="fertilizer_events")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    alert_type = Column(String(50), nullable=False)
    message = Column(String(255), nullable=False)
    severity = Column(String(20), default="info")  # 'info' | 'warning' | 'critical'
    acknowledged = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant", back_populates="alerts")


class SystemStatus(Base):
    __tablename__ = "system_status"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    device_id = Column(String(50), index=True, nullable=False)
    esp32_online = Column(Boolean, default=True)
    soil_sensor_online = Column(Boolean, default=True)
    dht22_online = Column(Boolean, default=True)
    water_pump_ready = Column(Boolean, default=True)
    fertilizer_pump_ready = Column(Boolean, default=True)
    last_seen = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant", back_populates="system_status")


class Command(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), index=True, nullable=False)
    command_type = Column(String(20), nullable=False)  # 'WATER' | 'FERTILIZE'
    parameters = Column(Text, nullable=True)  # JSON params string
    status = Column(String(20), default="PENDING")  # 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED'
    created_at = Column(DateTime, default=datetime.utcnow)
    executed_at = Column(DateTime, nullable=True)

    plant = relationship("Plant", back_populates="commands")
