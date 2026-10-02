import React, { useState } from 'react';
import { usePlant } from '../context/PlantContext';
import { ChartCard } from '../components/ChartCard';
import { BarChart3, Droplets, Thermometer, Wind, History, Filter } from 'lucide-react';
import './AnalyticsPage.css';

export const AnalyticsPage = () => {
  const { hourlyReadings, activities } = usePlant();
  const [metricFilter, setMetricFilter] = useState('all');

  const wateringActivities = activities.filter((a) => a.type === 'watering');
  const fertilizerActivities = activities.filter((a) => a.type === 'fertilizer');

  return (
    <div className="analytics-page">
      {/* Header Banner */}
      <div className="analytics-header">
        <div>
          <h2 className="page-heading">Historical Analytics & Trends</h2>
          <p className="page-subheading">
            Analyze historical sensor telemetry logged from ESP32 flash memory and cloud storage.
          </p>
        </div>

        <div className="analytics-filters">
          <div className="filter-pill-group">
            <button
              className={`filter-btn ${metricFilter === 'all' ? 'active' : ''}`}
              onClick={() => setMetricFilter('all')}
            >
              All Telemetry
            </button>
            <button
              className={`filter-btn ${metricFilter === 'moisture' ? 'active' : ''}`}
              onClick={() => setMetricFilter('moisture')}
            >
              Moisture
            </button>
            <button
              className={`filter-btn ${metricFilter === 'temp' ? 'active' : ''}`}
              onClick={() => setMetricFilter('temp')}
            >
              Temperature
            </button>
            <button
              className={`filter-btn ${metricFilter === 'humidity' ? 'active' : ''}`}
              onClick={() => setMetricFilter('humidity')}
            >
              Humidity
            </button>
          </div>
        </div>
      </div>

      {/* Historical Telemetry Charts */}
      <div className="analytics-charts-grid">
        {(metricFilter === 'all' || metricFilter === 'moisture') && (
          <ChartCard
            title="Soil Moisture Percentage History"
            subtitle="Target optimal zone: 40% - 70%"
            data={hourlyReadings}
            dataKey="moisture"
            color="#10B981"
            unit="%"
          />
        )}

        {(metricFilter === 'all' || metricFilter === 'temp') && (
          <ChartCard
            title="Ambient Temperature (°C) History"
            subtitle="Target optimal range: 18°C - 30°C"
            data={hourlyReadings}
            dataKey="temperature"
            color="#F59E0B"
            unit="°C"
          />
        )}

        {(metricFilter === 'all' || metricFilter === 'humidity') && (
          <ChartCard
            title="Relative Humidity (%) History"
            subtitle="Target optimal zone: 50% - 80%"
            data={hourlyReadings}
            dataKey="humidity"
            color="#3B82F6"
            unit="%"
          />
        )}
      </div>

      {/* Historical Event Tables */}
      <div className="grid-1-1" style={{ marginTop: 24 }}>
        {/* Watering History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Droplets size={18} style={{ color: '#3B82F6' }} />
              <span>Watering Event History</span>
            </div>
            <span className="count-tag">{wateringActivities.length} Logged</span>
          </div>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {wateringActivities.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <strong>{act.title}</strong>
                      <p className="table-desc">{act.description}</p>
                    </td>
                    <td className="font-mono text-muted">{act.timestamp}</td>
                    <td>
                      <span className="badge-pill healthy">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fertilizer History */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={18} style={{ color: '#8B5CF6' }} />
              <span>Nutrient & Fertilizer Dispense History</span>
            </div>
            <span className="count-tag">{fertilizerActivities.length} Logged</span>
          </div>
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fertilizerActivities.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <strong>{act.title}</strong>
                      <p className="table-desc">{act.description}</p>
                    </td>
                    <td className="font-mono text-muted">{act.timestamp}</td>
                    <td>
                      <span className="badge-pill info">Dispensed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
