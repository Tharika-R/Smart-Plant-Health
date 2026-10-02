import React from 'react';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, HeartPulse } from 'lucide-react';
import './HealthCard.css';

export const HealthCard = ({ healthStatus }) => {
  if (!healthStatus) return null;

  const { overall, score, explanation, factors } = healthStatus;

  return (
    <div className="card health-card">
      <div className="card-header">
        <div className="card-title">
          <HeartPulse size={20} className="health-icon" />
          <span>Plant Health Index</span>
        </div>
        <StatusBadge status={overall} size="md" />
      </div>

      <div className="health-score-banner">
        <div className="score-ring">
          <span className="score-number">{score}</span>
          <span className="score-label">/ 100</span>
        </div>
        <div className="score-info">
          <div className="score-title">
            <ShieldCheck size={16} className="shield-icon" />
            <span>{overall === 'Healthy' ? 'Optimal Growth State' : 'Action Required'}</span>
          </div>
          <p className="score-explanation">{explanation}</p>
        </div>
      </div>

      <div className="health-factors">
        <h4 className="factors-title">Health Factors Analysis</h4>
        <div className="factors-list">
          {factors && factors.map((factor, idx) => (
            <div key={idx} className="factor-item">
              <div className="factor-header">
                <span className="factor-name">{factor.name}</span>
                <span className="factor-val font-mono">{factor.value}</span>
              </div>
              
              <div className="factor-progress-bar">
                <div
                  className={`factor-progress-fill status-${factor.status.toLowerCase()}`}
                  style={{ width: `${factor.percentage || 75}%` }}
                />
              </div>

              <div className="factor-footer">
                <span className="factor-target">Target: {factor.target}</span>
                <span className="factor-note">{factor.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
