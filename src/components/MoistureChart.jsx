import React, { useState } from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Calendar, Droplets, Heart, Info, Sparkles } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 shadow-xl border border-[var(--color-border)] text-xs flex flex-col gap-1.5 min-w-36">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-subtle)] pb-1 border-b border-[var(--color-border-subtle)]">
          <Calendar size={12} />
          <span>Time: {label}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-[var(--color-text-main)]">
          <span className="text-blue-500">Soil Moisture:</span>
          <span className="font-mono">{payload[0].value}%</span>
        </div>
        {payload[0].payload.temp && (
          <div className="flex items-center justify-between font-bold text-[var(--color-text-muted)] text-[11px]">
            <span>Temperature:</span>
            <span className="font-mono">{payload[0].payload.temp}°C</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const MoistureChart = () => {
  const { hourlyReadings, isDarkMode } = usePlantiva();
  const [timeRange, setTimeRange] = useState('24H');

  const strokeColor = isDarkMode ? '#34D399' : '#10B981';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(17, 33, 25, 0.08)';
  const tickColor = isDarkMode ? '#A3BDAD' : '#53695D';

  return (
    <div className="glass-card p-6 md:p-8 flex flex-col justify-between">
      {/* CHART HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500 fill-rose-500" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
              How your plant has been feeling
            </h3>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] font-medium mt-0.5">
            Hydration & comfort curves over time
          </p>
        </div>

        {/* TIME RANGE SELECTOR */}
        <div className="flex items-center gap-1 bg-[var(--color-bg-surface-elevated)] p-1 rounded-2xl border border-[var(--color-border-subtle)] self-start sm:self-auto">
          {['24H', '7D', '30D'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-main)] shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">CURRENT MOISTURE</span>
          <div className="text-lg font-extrabold text-[var(--color-text-main)] font-mono">48%</div>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">COMFORT AVERAGE</span>
          <div className="text-lg font-extrabold text-[var(--color-text-main)] font-mono">51%</div>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">DAILY MINIMUM</span>
          <div className="text-lg font-extrabold text-[var(--color-text-main)] font-mono">45%</div>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
          <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase">DAILY MAXIMUM</span>
          <div className="text-lg font-extrabold text-[var(--color-text-main)] font-mono">54%</div>
        </div>
      </div>

      {/* RECHARTS AREA CHART */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyReadings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 11 }}
              domain={[20, 90]}
              unit="%"
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={40}
              stroke="#E07A5F"
              strokeDasharray="4 4"
              label={{
                value: 'Watering threshold: 40%',
                fill: '#E07A5F',
                fontSize: 11,
                position: 'insideTopRight'
              }}
            />

            <Area
              type="monotone"
              dataKey="moisture"
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#moistureGradient)"
              activeDot={{ r: 6, stroke: isDarkMode ? '#12221B' : '#FFFFFF', strokeWidth: 2, fill: strokeColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* MEANINGFUL INSIGHT BELOW CHART */}
      <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium mt-2">
        <Sparkles size={14} className="text-[var(--color-emerald-main)]" />
        <span>Your plant's moisture has stayed within its comfort zone for the last 7 days 💚</span>
      </div>
    </div>
  );
};
