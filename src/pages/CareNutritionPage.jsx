import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Sprout, Sparkles } from 'lucide-react';
import './CareNutritionPage.css';

export const CareNutritionPage = () => {
  const { plants, openNutritionModal } = usePlantora();

  return (
    <div className="care-nutrition-page">
      <div className="care-header">
        <div>
          <h2 className="serif-heading page-title">Plant Nutrition & Feed 🌱</h2>
          <p className="page-subtitle">
            Targeted organic feeding tailored to plant growth stages.
          </p>
        </div>
      </div>

      <div className="grid-1-1">
        <div className="organic-card">
          <h3 className="serif-heading" style={{ marginBottom: 16 }}>Garden Plant Feeds</h3>
          <div className="nutrition-plants-list">
            {plants.map((p) => (
              <div key={p.id} className="nutrition-item-card">
                <div>
                  <h4 className="plant-item-name">{p.nickname}</h4>
                  <p className="plant-item-sub">Stage: {p.growthStage}</p>
                </div>
                <button
                  className="btn-plantora btn-plantora-secondary"
                  onClick={(e) => openNutritionModal(p, e)}
                >
                  <Sprout size={16} />
                  <span>Prepare Feed</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="organic-card">
          <h3 className="serif-heading">Agronomy Guidelines</h3>
          <div className="agronomy-card-content">
            <div className="agronomy-tip">
              <Sparkles size={18} className="text-emerald" />
              <div>
                <strong>Flowering Phase:</strong> Higher Phosphorus & Potassium support bloom density and fruit set.
              </div>
            </div>
            <div className="agronomy-tip">
              <Sprout size={18} className="text-emerald" />
              <div>
                <strong>Vegetative Phase:</strong> Nitrogen rich organic tonic promotes lush leaf canopy development.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
