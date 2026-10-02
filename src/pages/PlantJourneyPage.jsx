import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { ChartCard } from '../components/ChartCard';
import { Sparkles, Heart, LineChart, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './PlantJourneyPage.css';

export const PlantJourneyPage = () => {
  const { hourlyReadings, insights } = usePlantora();

  return (
    <div className="plant-journey-page">
      <div className="page-header">
        <div>
          <h2 className="serif-heading page-title">Plant Journey & Analytics 📊</h2>
          <p className="page-subtitle">
            Long-term moisture trends, microclimate curves, and meaningful growth insights.
          </p>
        </div>
      </div>

      {/* PLAIN-LANGUAGE INSIGHTS CARDS */}
      <div className="insights-grid">
        {insights.map((ins, idx) => (
          <div key={idx} className="organic-card insight-card">
            <div className="insight-icon-box">
              <Sparkles size={18} className="text-emerald" />
            </div>
            <p className="insight-text">"{ins}"</p>
          </div>
        ))}
      </div>

      {/* RECHARTS MOISTURE & CLIMATE CURVES */}
      <div className="charts-stack">
        <ChartCard
          title="Soil Moisture Trend"
          subtitle="Continuous hydration curve over time"
          data={hourlyReadings}
          dataKey="moisture"
          color="#52796F"
          unit="%"
        />

        <ChartCard
          title="Temperature Climate"
          subtitle="Ambient thermal comfort zone (°C)"
          data={hourlyReadings}
          dataKey="temp"
          color="#F4A261"
          unit="°C"
        />
      </div>
    </div>
  );
};
