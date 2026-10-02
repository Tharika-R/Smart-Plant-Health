import React from 'react';
import './StatusBadge.css';

export const StatusBadge = ({ status = 'Optimal', size = 'md' }) => {
  const getStatusClass = () => {
    const s = String(status).toLowerCase();
    if (s.includes('optimal') || s.includes('healthy') || s.includes('online') || s.includes('ready') || s.includes('success')) {
      return 'badge-healthy';
    }
    if (s.includes('low') || s.includes('attention') || s.includes('warning') || s.includes('cooldown')) {
      return 'badge-warning';
    }
    if (s.includes('critical') || s.includes('high') || s.includes('error') || s.includes('offline')) {
      return 'badge-critical';
    }
    if (s.includes('active') || s.includes('info')) {
      return 'badge-info';
    }
    return 'badge-neutral';
  };

  return (
    <span className={`status-badge ${getStatusClass()} badge-${size}`}>
      <span className="badge-dot" />
      <span className="badge-text">{status}</span>
    </span>
  );
};
