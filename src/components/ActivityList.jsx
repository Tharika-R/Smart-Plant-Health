import React from 'react';
import { usePlant } from '../context/PlantContext';
import { Droplets, FlaskConical, AlertTriangle, Cpu, History } from 'lucide-react';
import './ActivityList.css';

export const ActivityList = () => {
  const { activities } = usePlant();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'watering':
        return <Droplets size={16} className="activity-icon water" />;
      case 'fertilizer':
        return <FlaskConical size={16} className="activity-icon fert" />;
      case 'alert':
        return <AlertTriangle size={16} className="activity-icon alert" />;
      default:
        return <Cpu size={16} className="activity-icon system" />;
    }
  };

  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="card-title">
          <History size={20} className="history-icon" />
          <span>Recent System Activity</span>
        </div>
        <span className="activity-count-badge">{activities.length} Events</span>
      </div>

      <div className="activity-timeline">
        {activities && activities.length > 0 ? (
          activities.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className={`timeline-marker type-${item.type}`}>
                {getActivityIcon(item.type)}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4 className="timeline-title">{item.title}</h4>
                  <span className="timeline-time">{item.timestamp}</span>
                </div>
                <p className="timeline-desc">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-activities">
            <p>No recent activity recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};
