import React, { useState } from 'react';
import { usePlant } from '../context/PlantContext';
import { WateringCard } from '../components/WateringCard';
import { Droplets, Settings, Sliders, History, Play, CheckCircle } from 'lucide-react';
import './WateringPage.css';

export const WateringPage = () => {
  const { wateringStatus, sensorData, toggleWateringMode, handleSaveSettings } = usePlant();
  const [threshold, setThreshold] = useState(wateringStatus?.moistureThreshold || 45);

  const currentMoisture = sensorData?.soilMoisture?.value || 58.4;

  const saveThreshold = () => {
    handleSaveSettings({
      wateringStatus: {
        moistureThreshold: Number(threshold)
      }
    });
  };

  return (
    <div className="watering-page">
      <div className="page-header">
        <div>
          <h2 className="page-heading">Irrigation & Water Pump Controller</h2>
          <p className="page-subheading">
            Manage automated soil moisture thresholds and trigger manual ESP32 relay pulses.
          </p>
        </div>
      </div>

      <div className="grid-1-1">
        {/* Irrigation Main Controller */}
        <WateringCard />

        {/* Moisture Threshold Configuration */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={20} style={{ color: '#10B981' }} />
              <span>Automated Threshold Tuning</span>
            </div>
            <span className="mode-pill automatic">{wateringStatus?.mode || 'Automatic'} Mode</span>
          </div>

          <div className="threshold-config-body">
            <p className="config-desc">
              When the capacitive soil moisture sensor registers a value below this threshold, the ESP32 automatically activates the water pump relay.
            </p>

            <div className="live-moisture-indicator">
              <div className="indicator-row">
                <span className="ind-label">Current Live Moisture:</span>
                <span className="ind-val font-mono">{currentMoisture}%</span>
              </div>
              <div className="indicator-row">
                <span className="ind-label">Target Auto-Watering Trigger:</span>
                <span className="ind-val font-mono text-emerald">&lt; {threshold}%</span>
              </div>
            </div>

            <div className="slider-group">
              <label className="slider-label">
                <span>Auto Irrigation Trigger Threshold:</span>
                <strong className="font-mono">{threshold}% Moisture</strong>
              </label>
              <input
                type="range"
                min="20"
                max="75"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="custom-range-slider"
              />
              <div className="slider-ticks">
                <span>20% (Very Dry)</span>
                <span>45% (Recommended)</span>
                <span>75% (Wet)</span>
              </div>
            </div>

            <button className="btn btn-primary save-threshold-btn" onClick={saveThreshold}>
              <CheckCircle size={16} />
              <span>Update ESP32 Threshold</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
