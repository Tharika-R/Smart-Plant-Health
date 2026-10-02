import React from 'react';
import { usePlant } from '../context/PlantContext';
import { StatusBadge } from './StatusBadge';
import { Cpu, Droplets, Thermometer, Zap, FlaskConical, Server } from 'lucide-react';
import './SystemStatusCard.css';

const iconMap = {
  Cpu,
  Droplets,
  Thermometer,
  Zap,
  FlaskConical
};

export const SystemStatusCard = () => {
  const { hardwareList } = usePlant();

  return (
    <div className="card system-status-card">
      <div className="card-header">
        <div className="card-title">
          <Server size={20} className="sys-header-icon" />
          <span>Hardware & Sensor Diagnostic Status</span>
        </div>
        <StatusBadge status="All Systems Operational" size="sm" />
      </div>

      <div className="hardware-grid">
        {hardwareList && hardwareList.map((hw, idx) => {
          const IconComp = iconMap[hw.iconName] || Cpu;
          return (
            <div key={idx} className="hardware-item">
              <div className="hw-icon-box">
                <IconComp size={18} className="hw-icon" />
              </div>
              <div className="hw-info">
                <div className="hw-name-row">
                  <span className="hw-name">{hw.name}</span>
                  <StatusBadge status={hw.status} size="sm" />
                </div>
                <div className="hw-meta font-mono">
                  <span>ID: {hw.componentId}</span>
                  <span className="hw-bullet">•</span>
                  <span>Bus: {hw.bus}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
