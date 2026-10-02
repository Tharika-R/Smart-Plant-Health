import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Calendar } from 'lucide-react';
import './ChartCard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="tooltip-header">
          <Calendar size={12} />
          <span>Time: {label}</span>
        </div>
        <div className="tooltip-body">
          {payload.map((item, index) => (
            <div key={index} className="tooltip-row">
              <span className="tooltip-color-dot" style={{ backgroundColor: item.color }} />
              <span className="tooltip-name">{item.name}:</span>
              <span className="tooltip-val font-mono">{item.value} {item.unit || '%'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ChartCard = ({
  title,
  subtitle,
  data,
  dataKey = 'moisture',
  color = '#52796F',
  unit = '%'
}) => {
  const { isDarkMode } = usePlantora();
  const [timeRange, setTimeRange] = useState('24h');

  // Dynamic Theme Colors for Charts
  const strokeColor = isDarkMode ? '#689785' : color;
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#E6E0D6';
  const tickColor = isDarkMode ? '#9EB5A5' : '#7D8880';

  if (!data || data.length === 0) {
    return (
      <div className="organic-card chart-card empty-chart-card">
        <div className="card-header">
          <h3 className="serif-heading card-title">{title}</h3>
        </div>
        <div className="empty-state-box">
          <span className="empty-state-icon">🌱</span>
          <h4 className="empty-state-title">No sensor data yet</h4>
          <p className="empty-state-desc">Your plant hasn't sent its historical sensor readings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="organic-card chart-card">
      <div className="card-header">
        <div>
          <h3 className="serif-heading card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>

        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === '24h' ? 'active' : ''}`}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </button>
          <button
            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
          <button
            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="chart-container" style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 12 }}
              domain={[0, 100]}
              unit={unit}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={dataKey}
              name={title}
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
              unit={unit}
              activeDot={{ r: 6, stroke: isDarkMode ? '#1B2420' : '#FFFFFF', strokeWidth: 2, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
