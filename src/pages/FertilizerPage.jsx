import React from 'react';
import { usePlant } from '../context/PlantContext';
import { FertilizerCard } from '../components/FertilizerCard';
import { FlaskConical, Sprout, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import './FertilizerPage.css';

export const FertilizerPage = () => {
  const { plantInfo, fertilizerRec, activities } = usePlant();
  const fertilizerHistory = activities.filter((a) => a.type === 'fertilizer');

  return (
    <div className="fertilizer-page">
      <div className="page-header">
        <div>
          <h2 className="page-heading">Nutrient & Peristaltic Pump Management</h2>
          <p className="page-subheading">
            Dose growth-stage specific liquid fertilizers safely through automated peristaltic pump control.
          </p>
        </div>
      </div>

      <div className="grid-1-1">
        {/* Main Dispenser Card */}
        <FertilizerCard />

        {/* Growth Stage Nutrient Guide */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={20} style={{ color: '#8B5CF6' }} />
              <span>Flowering Stage Agronomy Guide</span>
            </div>
            <span className="rec-dose-tag">Stage: {plantInfo?.growthStage || 'Flowering'}</span>
          </div>

          <div className="agronomy-guide-body">
            <div className="guide-item">
              <div className="guide-icon-box">
                <Sprout size={18} />
              </div>
              <div className="guide-text">
                <h4>NPK Ratio Requirement</h4>
                <p>During the flowering stage (Days 35-60), plants consume higher <strong>Phosphorus (P)</strong> for flower retention and <strong>Potassium (K)</strong> for fruit setting.</p>
              </div>
            </div>

            <div className="guide-item">
              <div className="guide-icon-box">
                <Sparkles size={18} />
              </div>
              <div className="guide-text">
                <h4>Dispensing Best Practices</h4>
                <p>Dispense in small 15 mL micro-doses with irrigation water. Never exceed 30 mL within a 48-hour safety interval.</p>
              </div>
            </div>

            <div className="guide-item">
              <div className="guide-icon-box">
                <AlertCircle size={18} />
              </div>
              <div className="guide-text">
                <h4>ESP32 Hardware Protection</h4>
                <p>The peristaltic pump relay is locked if soil moisture drops below 30% to prevent concentrated root burning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
