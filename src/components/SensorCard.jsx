import React, { useState, useEffect } from 'react';
import { StatusBadge } from './StatusBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './SensorCard.css';

export const SensorCard = ({
  title,
  value,
  unit,
  status = 'Healthy',
  trend = 'Stable',
  trendType = 'stable',
  icon: Icon,
  color = 'emerald',
  maxVal = 100,
  isLoading = false
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  // Smooth number transition on value prop update
  useEffect(() => {
    if (value !== displayValue && value !== undefined && value !== null) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsUpdating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const renderTrendIcon = () => {
    if (trendType === 'up') return <TrendingUp size={14} className="trend-icon up" />;
    if (trendType === 'down') return <TrendingDown size={14} className="trend-icon down" />;
    return <Minus size={14} className="trend-icon stable" />;
  };

  // Progress Bar Percentage
  const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  const pct = Math.min(100, Math.max(0, (numVal / maxVal) * 100));

  if (isLoading || value === undefined) {
    return (
      <div className={`sensor-card theme-${color} skeleton-card`}>
        <div className="skeleton-box" style={{ height: 24, width: '40%', marginBottom: 16 }} />
        <div className="skeleton-box" style={{ height: 40, width: '60%', marginBottom: 12 }} />
        <div className="skeleton-box" style={{ height: 8, width: '100%', borderRadius: 10 }} />
      </div>
    );
  }

  return (
    <div className={`sensor-card theme-${color} ${isUpdating ? 'value-bump' : ''}`}>
      <div className="sensor-card-top">
        <div className={`sensor-icon-wrapper icon-bg-${color}`}>
          {Icon && <Icon size={20} className={`sensor-icon icon-color-${color} pulse-icon`} />}
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      <div className="sensor-card-body">
        <span className="sensor-title">{title}</span>
        <div className="sensor-value-group">
          <span className={`sensor-value ${isUpdating ? 'animating' : ''}`}>
            {displayValue !== null && displayValue !== undefined ? displayValue : '--'}
          </span>
          <span className="sensor-unit">{unit}</span>
        </div>

        {/* Progress Bar Indicator */}
        <div className="sensor-progress-track">
          <div
            className={`sensor-progress-fill fill-${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="sensor-card-footer">
        <div className="trend-group">
          {renderTrendIcon()}
          <span className={`trend-value ${trendType}`}>{trend}</span>
          <span className="trend-label">vs past 24h</span>
        </div>
      </div>
    </div>
  );
};
