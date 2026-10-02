import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { ArrowLeft, Heart, Droplets, Sprout, Sparkles, Thermometer, Wind, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './PlantDetailPage.css';

export const PlantDetailPage = () => {
  const { selectedPlant, setSelectedPlantId, toggleFavorite, openWateringModal, openNutritionModal } = usePlantora();

  if (!selectedPlant) return null;

  const {
    id,
    nickname,
    species,
    location,
    ageDays,
    growthStage,
    healthState,
    healthScore,
    healthMessage,
    isFavorite,
    soilMoisture,
    temperature,
    humidity,
    lastWatered,
    bgGradient
  } = selectedPlant;

  const isNeedsWater = healthState === 'Needs Water' || soilMoisture < 40;

  return (
    <motion.div
      className="plant-detail-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Back Button */}
      <button className="back-to-garden-btn" onClick={() => setSelectedPlantId(null)}>
        <ArrowLeft size={18} />
        <span>Back to My Garden</span>
      </button>

      {/* Hero Profile Banner */}
      <section className="plant-detail-hero organic-card" style={{ background: bgGradient }}>
        <div className="hero-left-content">
          <div className="hero-badge-row">
            <span className="location-pill">{location}</span>
            <span className="age-pill">
              <Calendar size={13} />
              <span>{ageDays} days with you</span>
            </span>
          </div>

          <h1 className="serif-heading plant-detail-title">{nickname}</h1>
          <p className="plant-detail-species">{species}</p>

          {/* Emotional Health Statement */}
          <div className="emotional-health-box">
            <div className="health-score-pill">
              <Sparkles size={16} />
              <span>{healthState}</span>
            </div>
            <p className="health-message-quote">"{healthMessage}"</p>
          </div>
        </div>

        <div className="hero-right-visual">
          <div className="big-plant-visual">
            {nickname.includes('Monstera') ? '🌿' : nickname.includes('Tomato') ? '🍅' : nickname.includes('Lily') ? '🌸' : '🌱'}
          </div>
          <button
            className={`fav-floating-btn ${isFavorite ? 'active' : ''}`}
            onClick={(e) => toggleFavorite(id, e)}
          >
            <Heart size={20} fill={isFavorite ? '#E07A5F' : 'none'} color={isFavorite ? '#E07A5F' : '#7D8880'} />
          </button>
        </div>
      </section>

      {/* CARE TODAY SECTION */}
      <section className="care-today-section">
        <h3 className="serif-heading section-title">Care Today</h3>

        <div className="grid-1-1">
          {/* Watering Action Card */}
          <div className="organic-card care-action-card">
            <div className="care-action-header">
              <div className="action-icon-circle blue-bg">
                <Droplets size={22} className="blue-icon" />
              </div>
              <div className="action-header-text">
                <h4>Watering Status</h4>
                <p>{isNeedsWater ? 'Moisture is getting low' : 'Recently watered & comfortable'}</p>
              </div>
            </div>

            <div className="care-card-metrics">
              <span className="metric-text font-mono">Current: {soilMoisture}% soil moisture</span>
              <span className="last-watered-tag">{lastWatered}</span>
            </div>

            <button
              className={`btn-plantora ${isNeedsWater ? 'btn-plantora-terracotta' : 'btn-plantora-secondary'} care-btn`}
              onClick={(e) => openWateringModal(selectedPlant, e)}
            >
              <Droplets size={18} />
              <span>{isNeedsWater ? 'Water Now' : 'Give Extra Water'}</span>
            </button>
          </div>

          {/* Nutrition Action Card */}
          <div className="organic-card care-action-card">
            <div className="care-action-header">
              <div className="action-icon-circle green-bg">
                <Sprout size={22} className="green-icon" />
              </div>
              <div className="action-header-text">
                <h4>Plant Nutrition</h4>
                <p>Growth stage: {growthStage}</p>
              </div>
            </div>

            <div className="care-card-metrics">
              <span className="metric-text">Recommended feed: Organic tonic</span>
              <span className="last-watered-tag">Safe for dosage</span>
            </div>

            <button
              className="btn-plantora btn-plantora-secondary care-btn"
              onClick={(e) => openNutritionModal(selectedPlant, e)}
            >
              <Sprout size={18} />
              <span>Prepare Nutrition</span>
            </button>
          </div>
        </div>
      </section>

      {/* FRIENDLY ENVIRONMENTAL GAUGES */}
      <section className="environmental-gauges-section">
        <h3 className="serif-heading section-title">Environment & Climate</h3>

        <div className="grid-3">
          <div className="organic-card gauge-card">
            <div className="gauge-header">
              <Droplets size={20} className="blue-icon" />
              <span>Soil Moisture</span>
            </div>
            <div className="gauge-value font-mono">{soilMoisture}%</div>
            <div className="gauge-status-bar">
              <div className="gauge-fill" style={{ width: `${soilMoisture}%`, backgroundColor: '#3B82F6' }} />
            </div>
            <span className="gauge-note">Target: 60% – 75%</span>
          </div>

          <div className="organic-card gauge-card">
            <div className="gauge-header">
              <Thermometer size={20} className="amber-icon" />
              <span>Temperature</span>
            </div>
            <div className="gauge-value font-mono">{temperature}°C</div>
            <div className="gauge-status-bar">
              <div className="gauge-fill" style={{ width: `${(temperature / 40) * 100}%`, backgroundColor: '#F4A261' }} />
            </div>
            <span className="gauge-note">Comfortable (18°C – 30°C)</span>
          </div>

          <div className="organic-card gauge-card">
            <div className="gauge-header">
              <Wind size={20} className="green-icon" />
              <span>Humidity</span>
            </div>
            <div className="gauge-value font-mono">{humidity}%</div>
            <div className="gauge-status-bar">
              <div className="gauge-fill" style={{ width: `${humidity}%`, backgroundColor: '#52796F' }} />
            </div>
            <span className="gauge-note">Good airflow zone</span>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
