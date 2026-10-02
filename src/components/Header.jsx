import React, { useState, useEffect } from 'react';
import { usePlant } from '../context/PlantContext';
import { Menu, Wifi, Calendar, Clock, Sprout } from 'lucide-react';
import './Header.css';

const titles = {
  dashboard: 'System Overview',
  analytics: 'Sensor Analytics & Telemetry',
  watering: 'Irrigation & Pump Management',
  fertilizer: 'Nutrient & Fertilizer Dispenser',
  settings: 'System & Hardware Configuration'
};

export const Header = ({ onOpenSidebar }) => {
  const { activeTab, plantInfo, hardwareConfig } = usePlant();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onOpenSidebar} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{titles[activeTab] || 'Dashboard'}</h1>
          <p className="header-subtitle">ESP32 Automated Precision Agriculture System</p>
        </div>
      </div>

      <div className="header-right">
        {/* Plant Badge */}
        <div className="header-badge plant-badge">
          <Sprout size={16} className="badge-icon green-icon" />
          <span className="badge-label">{plantInfo?.name || 'Tomato Plant'}</span>
          <span className="badge-tag">{plantInfo?.growthStage || 'Flowering'}</span>
        </div>

        {/* ESP32 Status Badge */}
        <div className={`header-badge wifi-badge ${hardwareConfig.useMock ? 'mock-mode' : 'online'}`}>
          <Wifi size={16} className="badge-icon" />
          <span className="live-dot" />
          <span className="badge-label">
            {hardwareConfig.useMock ? 'ESP32 (Simulated)' : 'ESP32 Online'}
          </span>
        </div>

        {/* Live Clock & Date */}
        <div className="header-time-card">
          <div className="time-item">
            <Calendar size={14} className="time-icon" />
            <span>{dateStr}</span>
          </div>
          <div className="time-item font-mono">
            <Clock size={14} className="time-icon" />
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
