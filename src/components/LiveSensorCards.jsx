import React from 'react';
import { usePlantiva } from '../context/PlantivaContext';
import { Droplets, Thermometer, Wind, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveSensorCards = () => {
  const { activePlant } = usePlantiva();

  const cards = [
    {
      id: 'moisture',
      title: 'WATER & HYDRATION',
      value: `${activePlant?.soilMoisture || 48}%`,
      interpretation: activePlant?.soilMoisture < 40 ? 'Your plant is getting thirsty 💧' : 'Your plant is comfortably hydrated.',
      numVal: activePlant?.soilMoisture || 48,
      maxVal: 100,
      icon: Droplets,
      color: 'blue',
      strokeColor: '#3B82F6',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500'
    },
    {
      id: 'temp',
      title: 'TEMPERATURE',
      value: `${activePlant?.temperature || 27.4}°C`,
      interpretation: 'Perfect environment for growth.',
      numVal: activePlant?.temperature || 27.4,
      maxVal: 40,
      icon: Thermometer,
      color: 'amber',
      strokeColor: '#F59E0B',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500'
    },
    {
      id: 'humidity',
      title: 'HUMIDITY',
      value: `${activePlant?.humidity || 64}%`,
      interpretation: 'Nice and comfortable airflow.',
      numVal: activePlant?.humidity || 64,
      maxVal: 100,
      icon: Wind,
      color: 'emerald',
      strokeColor: '#10B981',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'health',
      title: 'PLANT WELLNESS',
      value: `${activePlant?.healthScore || 92}%`,
      interpretation: 'Your plant is thriving 💚',
      numVal: activePlant?.healthScore || 92,
      maxVal: 100,
      icon: HeartPulse,
      color: 'rose',
      strokeColor: '#10B981',
      bgColor: 'bg-rose-500/10',
      iconColor: 'text-rose-500'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const pct = Math.min(100, Math.max(0, (card.numVal / card.maxVal) * 100));
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (pct / 100) * circumference;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className="glass-card p-5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
          >
            {/* CARD TOP HEADER */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl ${card.bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon size={20} className={card.iconColor} />
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                OPTIMAL
              </span>
            </div>

            {/* CARD MAIN VALUE & CIRCULAR RING */}
            <div className="flex items-end justify-between my-2">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-[var(--color-text-subtle)] uppercase">
                  {card.title}
                </span>
                <div className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--color-text-main)] mt-1">
                  {card.value}
                </div>
              </div>

              {/* CIRCULAR PROGRESS GAUGE RING */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    className="stroke-[var(--color-border-subtle)] fill-none"
                    strokeWidth="5"
                  />
                  <motion.circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke={card.strokeColor}
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[var(--color-text-muted)] font-mono">
                  {Math.round(pct)}%
                </span>
              </div>
            </div>

            {/* HUMAN-FRIENDLY INTERPRETATION FOOTER */}
            <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <div className="flex items-center gap-1.5 font-medium text-[11px]">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>{card.interpretation}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
};
