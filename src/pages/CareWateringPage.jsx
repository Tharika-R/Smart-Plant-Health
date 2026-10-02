import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Droplets, Sparkles, CheckCircle2 } from 'lucide-react';
import './CareWateringPage.css';

export const CareWateringPage = () => {
  const { plants, openWateringModal } = usePlantora();
  const plantsNeedingWater = plants.filter((p) => p.healthState === 'Needs Water' || p.soilMoisture < 40);

  return (
    <div className="care-watering-page">
      <div className="care-header">
        <div>
          <h2 className="serif-heading page-title">Watering & Irrigation Schedule 💧</h2>
          <p className="page-subtitle">
            Manage daily moisture needs across your garden.
          </p>
        </div>
      </div>

      <div className="grid-1-1">
        <div className="organic-card">
          <div className="card-title-row">
            <Droplets size={20} className="blue-icon" />
            <h3 className="serif-heading">Action Needed Today</h3>
          </div>

          {plantsNeedingWater.length > 0 ? (
            <div className="needs-water-list">
              {plantsNeedingWater.map((p) => (
                <div key={p.id} className="water-needed-item">
                  <div>
                    <h4 className="plant-item-name">{p.nickname}</h4>
                    <p className="plant-item-sub font-mono">Soil moisture: {p.soilMoisture}%</p>
                  </div>
                  <button
                    className="btn-plantora btn-plantora-terracotta"
                    onClick={(e) => openWateringModal(p, e)}
                  >
                    <Droplets size={16} />
                    <span>Water Now</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="all-hydrated-box">
              <CheckCircle2 size={36} className="text-emerald" />
              <p>All plants in your garden are well hydrated today! 🌱</p>
            </div>
          )}
        </div>

        <div className="organic-card">
          <h3 className="serif-heading">Hydration Best Practices</h3>
          <ul className="watering-tips-list">
            <li>💧 <strong>Water deeply, less often:</strong> Promotes deep, resilient root development.</li>
            <li>🌅 <strong>Best time:</strong> Early morning watering reduces evaporation losses.</li>
            <li>🌿 <strong>Check soil topsoil:</strong> Feel top 1 inch before adding water.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
