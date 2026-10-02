import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Heart, Droplets, ArrowRight, Sparkles } from 'lucide-react';
import './PlantCard.css';

export const PlantCard = ({ plant }) => {
  const { setSelectedPlantId, toggleFavorite, openWateringModal } = usePlantora();

  if (!plant) return null;

  const {
    id,
    name,
    nickname,
    species,
    healthState,
    soilMoisture,
    lastWatered,
    isFavorite,
    iconEmoji,
    bgGradient
  } = plant;

  const isNeedsWater = healthState === 'Needs Water' || soilMoisture < 40;

  return (
    <div
      className="plant-card organic-card"
      onClick={() => setSelectedPlantId(id)}
    >
      {/* BOTANICAL ILLUSTRATION / AVATAR HERO */}
      <div className="plant-card-hero" style={{ background: bgGradient }}>
        <div className="hero-svg-wrapper">
          <span className="plant-card-emoji">{iconEmoji}</span>
        </div>

        {/* Favorite Heart Floating Button */}
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => toggleFavorite(id, e)}
          aria-label="Toggle Favorite"
        >
          <Heart
            size={18}
            fill={isFavorite ? '#E07A5F' : 'none'}
            color={isFavorite ? '#E07A5F' : '#7D8880'}
          />
        </button>

        {/* Moisture Badge Pill */}
        <div className="moisture-pill-badge font-mono">
          <Droplets size={13} className="droplets-icon" />
          <span>{soilMoisture}% soil</span>
        </div>
      </div>

      {/* PLANT CARD DETAILS */}
      <div className="plant-card-body">
        <div className="plant-card-title-group">
          <h3 className="serif-heading plant-nickname">{nickname || name}</h3>
          <p className="plant-species">{species}</p>
        </div>

        <div className="plant-status-row">
          <span className={`health-status-badge ${isNeedsWater ? 'state-needs-water' : 'state-thriving'}`}>
            {isNeedsWater ? '💧 Needs Water' : '🌿 Looking happy today'}
          </span>
          <span className="last-watered-text font-mono">{lastWatered}</span>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="plant-card-footer">
        <button className="btn-plantora btn-plantora-secondary quick-action-btn">
          <span>View Plant Profile</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
