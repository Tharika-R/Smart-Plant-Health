import React from 'react';
import { usePlant } from '../context/PlantContext';
import { SensorCard } from '../components/SensorCard';
import { ChartCard } from '../components/ChartCard';
import { HealthCard } from '../components/HealthCard';
import { WateringCard } from '../components/WateringCard';
import { FertilizerCard } from '../components/FertilizerCard';
import { ActivityList } from '../components/ActivityList';
import { SystemStatusCard } from '../components/SystemStatusCard';
import { Droplets, Thermometer, Wind, Cpu, Sparkles, Sprout, Calendar, Clock } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const {
    plantInfo,
    sensorData,
    hourlyReadings,
    healthStatus,
    loading
  } = usePlant();

  if (loading || !sensorData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Connecting to ESP32 Hardware Telemetry...</p>
      </div>
    );
  }

  const { soilMoisture, temperature, humidity, systemStatus } = sensorData;

  return (
    <div className="dashboard-page">
      {/* 1. Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>AI Plant Health Monitor</span>
          </div>
          <h2 className="welcome-heading">Good afternoon! 🌱</h2>
          <p className="welcome-subtitle">
            Your <strong>{plantInfo?.name || 'Tomato'}</strong> is healthy today. Automated environmental controls are active.
          </p>
        </div>

        <div className="welcome-stats">
          <div className="w-stat-item">
            <Sprout size={18} className="w-stat-icon" />
            <div className="w-stat-info">
              <span className="w-stat-label">Plant Name</span>
              <span className="w-stat-val">{plantInfo?.name || 'Tomato'}</span>
            </div>
          </div>

          <div className="w-stat-item">
            <Calendar size={18} className="w-stat-icon" />
            <div className="w-stat-info">
              <span className="w-stat-label">Growth Stage</span>
              <span className="w-stat-val text-emerald">{plantInfo?.growthStage || 'Flowering'}</span>
            </div>
          </div>

          <div className="w-stat-item">
            <Clock size={18} className="w-stat-icon" />
            <div className="w-stat-info">
              <span className="w-stat-label">Plant Age</span>
              <span className="w-stat-val">{plantInfo?.ageDays || 42} days</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sensor Telemetry Cards */}
      <section className="dashboard-section">
        <div className="grid-4">
          <SensorCard
            title="Soil Moisture"
            value={soilMoisture.value}
            unit={soilMoisture.unit}
            status={soilMoisture.status}
            trend={soilMoisture.trend}
            trendType={soilMoisture.trendType}
            icon={Droplets}
            color="emerald"
          />

          <SensorCard
            title="Ambient Temperature"
            value={temperature.value}
            unit={temperature.unit}
            status={temperature.status}
            trend={temperature.trend}
            trendType={temperature.trendType}
            icon={Thermometer}
            color="amber"
          />

          <SensorCard
            title="Relative Humidity"
            value={humidity.value}
            unit={humidity.unit}
            status={humidity.status}
            trend={humidity.trend}
            trendType={humidity.trendType}
            icon={Wind}
            color="blue"
          />

          <SensorCard
            title="System Status"
            value={systemStatus.value}
            unit={systemStatus.unit}
            status={systemStatus.status}
            trend={systemStatus.trend}
            trendType={systemStatus.trendType}
            icon={Cpu}
            color="purple"
          />
        </div>
      </section>

      {/* 3. Soil Moisture Chart & Plant Health Breakdown */}
      <section className="dashboard-section">
        <div className="grid-2-1">
          <ChartCard
            title="Soil Moisture Telemetry (24 Hours)"
            subtitle="Real-time capacitive sensor data received from ESP32 ADC GPIO34"
            data={hourlyReadings}
            dataKey="moisture"
            color="#10B981"
            unit="%"
          />
          <HealthCard healthStatus={healthStatus} />
        </div>
      </section>

      {/* 4. Actuator Controllers: Irrigation & Fertilizer */}
      <section className="dashboard-section">
        <div className="grid-1-1">
          <WateringCard />
          <FertilizerCard />
        </div>
      </section>

      {/* 5. Activity Timeline & System Component Health */}
      <section className="dashboard-section">
        <div className="grid-2-1">
          <ActivityList />
          <SystemStatusCard />
        </div>
      </section>
    </div>
  );
};
