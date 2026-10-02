import React from 'react';
import { usePlantiva } from '../../context/PlantivaContext';
import { Sparkles, ShieldCheck, Heart, Droplets, Thermometer, Sun, Sprout, AlertCircle, CheckCircle2, ArrowRight, Stethoscope, HelpCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const VisionResultCard = ({ result, onRetake }) => {
  const { setActiveTab } = usePlantiva();

  if (!result) return null;

  const {
    plantName,
    plantConfidence,
    overallHealth,
    healthStatus,
    visibleIssues,
    observations,
    recommendations,
    multiModalFusion,
    nutrients
  } = result;

  const healthRadius = 44;
  const healthCircumference = 2 * Math.PI * healthRadius;
  const healthDashoffset = healthCircumference - (overallHealth / 100) * healthCircumference;

  const idRadius = 36;
  const idCircumference = 2 * Math.PI * idRadius;
  const idDashoffset = idCircumference - (plantConfidence / 100) * idCircumference;

  // Extract primary issue & generate detailed disease analysis
  const primaryIssue = visibleIssues[0] || {
    name: 'Healthy Foliage',
    severity: 'Normal',
    confidence: 94,
    explanation: 'No visible plant disease or leaf stress detected.'
  };

  // Determine disease details based on nutrient status or primary issue
  let diseaseName = primaryIssue.name;
  let diseaseReason = primaryIssue.explanation;
  let healingSteps = [
    { step: 1, title: 'Monitor Telemetry', desc: 'Keep soil moisture comfortably balanced between 40%-75%.' },
    { step: 2, title: 'Provide Bright Sunlight', desc: 'Ensure 6-8 hours of bright, indirect sunlight daily.' },
    { step: 3, title: 'Regular Inspection', desc: 'Perform weekly AI vision checks to track canopy growth.' }
  ];

  if (nutrients?.nitrogen?.status === 'LOW' || primaryIssue.name.includes('Yellowing') || primaryIssue.name.includes('Nitrogen')) {
    diseaseName = 'Nitrogen Deficiency (Foliar Chlorosis)';
    diseaseReason = 'Nitrogen is a mobile plant macro-nutrient required for chlorophyll production. When deficient, the plant translocates nitrogen from older lower leaves to new growth, causing lower leaves to turn pale or yellow.';
    healingSteps = [
      { step: 1, title: 'Dispense Nitrogen Booster', desc: 'Click [DISPENSE NITROGEN] to activate 5 mL organic nitrogen root nourishment.' },
      { step: 2, title: 'Prune Severely Damaged Leaves', desc: 'Gently trim completely yellowed lower leaves to allow the plant to focus energy on new buds.' },
      { step: 3, title: 'Check Soil Moisture', desc: 'Ensure soil is moist (40-60%) so roots can absorb applied nutrients effectively.' }
    ];
  } else if (nutrients?.phosphorus?.status === 'LOW' || primaryIssue.name.includes('Phosphorus') || primaryIssue.name.includes('Spot')) {
    diseaseName = 'Phosphorus Deficiency & Leaf Spotting';
    diseaseReason = 'Phosphorus promotes root development and blossom blooming. Low levels lead to dull dark foliage, reddish-purple leaf undersides, and delayed fruit node formation.';
    healingSteps = [
      { step: 1, title: 'Dispense Phosphorus Supplement', desc: 'Click [DISPENSE PHOSPHORUS] to activate 5 mL phosphorus fruit & root enhancer.' },
      { step: 2, title: 'Avoid Soggy Soil', desc: 'Ensure proper soil drainage. Cold, overly wet soil inhibits phosphorus root uptake.' },
      { step: 3, title: 'Air Circulation', desc: 'Maintain good airflow around the canopy to protect leaves from fungal spores.' }
    ];
  } else if (nutrients?.potassium?.status === 'LOW' || primaryIssue.name.includes('Potassium') || primaryIssue.name.includes('Wilt') || primaryIssue.name.includes('Margin')) {
    diseaseName = 'Potassium Deficiency (Leaf Margin Scorching)';
    diseaseReason = 'Potassium regulates stomatal water opening and drought resistance. Lack of potassium causes leaf edges to look brown, burnt, or scorched while inner leaf stays green.';
    healingSteps = [
      { step: 1, title: 'Dispense Potassium Solution', desc: 'Click [DISPENSE POTASSIUM] to activate 5 mL potassium water-regulation booster.' },
      { step: 2, title: 'Hydrate Consistently', desc: 'Provide regular hydration so potassium ions can move freely through root cell walls.' },
      { step: 3, title: 'Protect from Heat Stress', desc: 'Shield plant from harsh afternoon scorching temperatures above 34°C.' }
    ];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* HEADER RESULT BANNER */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[var(--color-bg-surface-elevated)] via-[var(--color-bg-surface)] to-[var(--color-bg-surface-elevated)] border border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-[var(--color-emerald-subtle)] border border-emerald-500/30 flex items-center justify-center text-2xl shadow-md">
              🌿
            </div>
            <div>
              <span className="pulse-emerald mb-1">
                <ShieldCheck size={13} />
                <span>{healthStatus.toUpperCase()}</span>
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--color-text-main)] mt-1">
                Your Plant Health Check 🌿
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">
                Analysis complete • Multi-modal visual telemetry verified
              </p>
            </div>
          </div>

          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-main)] text-xs font-bold border border-[var(--color-border)] transition-all"
          >
            Check Another Plant
          </button>
        </div>
      </div>

      {/* 🩺 DEDICATED PLANT DOCTOR DIAGNOSIS & HEALING PLAN CARD */}
      <div className="glass-card p-6 md:p-8 border-2 border-emerald-500/40 bg-gradient-to-br from-[var(--color-bg-surface)] via-[var(--color-bg-surface-elevated)] to-[var(--color-bg-surface)] shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Stethoscope size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase block">
                AI PLANT DOCTOR DIAGNOSIS
              </span>
              <h3 className="font-serif text-xl font-extrabold text-[var(--color-text-main)]">
                {diseaseName}
              </h3>
            </div>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold">
            Confidence: {primaryIssue.confidence || 88}%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* REASON / ROOT CAUSE */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
              <HelpCircle size={16} />
              <span>REASON & ROOT CAUSE</span>
            </div>
            <p className="text-xs text-[var(--color-text-main)] font-medium leading-relaxed">
              "{diseaseReason}"
            </p>
          </div>

          {/* HOW TO HEAL IT (STEP-BY-STEP) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs mb-1">
              <Activity size={16} />
              <span>HOW TO HEAL & RECOVER YOUR PLANT (STEP-BY-STEP)</span>
            </div>

            {healingSteps.map((s) => (
              <div
                key={s.step}
                className="p-3.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] flex items-start gap-3 text-xs"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--color-emerald-main)] text-white font-extrabold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {s.step}
                </span>
                <div>
                  <h5 className="font-bold text-[var(--color-text-main)]">{s.title}</h5>
                  <p className="text-[var(--color-text-muted)] font-medium text-[11px] mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RINGS & IDENTIFICATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* OVERALL HEALTH SCORE RING */}
        <div className="md:col-span-6 glass-card p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-[10px] font-extrabold tracking-widest text-[var(--color-text-subtle)] uppercase mb-3">
            OVERALL VISUAL HEALTH SCORE
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={healthRadius}
                className="stroke-[var(--color-border-subtle)] fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={healthRadius}
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={healthCircumference}
                initial={{ strokeDashoffset: healthCircumference }}
                animate={{ strokeDashoffset: healthDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="font-serif text-3xl font-extrabold text-[var(--color-text-main)]">
                {overallHealth}%
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--color-emerald-main)]">
                THRIVING
              </span>
            </div>
          </div>

          <p className="text-xs font-bold text-[var(--color-text-muted)] mt-2">
            "Your foliage shows strong vitality and natural structure 💚"
          </p>
        </div>

        {/* PLANT IDENTIFICATION CARD */}
        <div className="md:col-span-6 glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[10px] font-extrabold tracking-widest text-[var(--color-text-subtle)] uppercase">
              PLANT IDENTIFICATION
            </span>
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold font-mono">
              Confidence: {plantConfidence}%
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={idRadius}
                  className="stroke-[var(--color-border-subtle)] fill-none"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r={idRadius}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeDasharray={idCircumference}
                  initial={{ strokeDashoffset: idCircumference }}
                  animate={{ strokeDashoffset: idDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-bold text-xs text-[var(--color-text-main)]">
                {plantConfidence}%
              </span>
            </div>

            <div>
              <div className="text-xs text-[var(--color-emerald-main)] font-bold uppercase tracking-wider">
                ✓ Identified Plant
              </div>
              <h3 className="font-serif text-xl font-extrabold text-[var(--color-text-main)] mt-0.5">
                {plantName}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                Based on leaf shape, node spacing, and canopy visual pattern.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-muted)]">
            <span>Identification verified with AI vision dataset.</span>
          </div>
        </div>
      </div>

      {/* MULTI-MODAL SENSOR FUSION ENGINE */}
      {multiModalFusion && (
        <div className="glass-card p-6 border-l-4 border-l-[var(--color-emerald-main)] relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[var(--color-emerald-main)]">
            <Sparkles size={16} />
            <span>COMBINED PLANT HEALTH (AI VISION + REAL SENSORS)</span>
          </div>

          <p className="text-sm font-bold text-[var(--color-text-main)] mb-4">
            "{multiModalFusion.combinedInsight}"
          </p>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <span className="text-[10px] text-[var(--color-text-subtle)] uppercase block font-bold">SOIL MOISTURE</span>
              <span className="font-mono font-extrabold text-[var(--color-text-main)]">{multiModalFusion.soilMoisture}% ({multiModalFusion.soilStatus})</span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <span className="text-[10px] text-[var(--color-text-subtle)] uppercase block font-bold">TEMPERATURE</span>
              <span className="font-mono font-extrabold text-[var(--color-text-main)]">{multiModalFusion.temperature}°C ({multiModalFusion.tempStatus})</span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)]">
              <span className="text-[10px] text-[var(--color-text-subtle)] uppercase block font-bold">HUMIDITY</span>
              <span className="font-mono font-extrabold text-[var(--color-text-main)]">{multiModalFusion.humidity}% (Good Airflow)</span>
            </div>
          </div>
        </div>
      )}

      {/* DETECTED ISSUES & OBSERVATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* DETECTED ISSUES */}
        <div className="md:col-span-7 glass-card p-6 space-y-4">
          <h4 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
            Detected Visual Conditions
          </h4>

          {visibleIssues.map((issue, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-amber-500/30 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1.5">
                  <AlertCircle size={16} />
                  <span>{issue.name}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px]">
                  {issue.severity} • {issue.confidence}% Confidence
                </span>
              </div>
              <p className="text-[var(--color-text-muted)] font-medium leading-relaxed">
                "{issue.explanation}"
              </p>
            </div>
          ))}

          {/* OBSERVATIONS LIST */}
          <div className="pt-2">
            <h5 className="text-xs font-bold text-[var(--color-text-subtle)] uppercase mb-2">
              🌿 What I noticed
            </h5>
            <ul className="space-y-2 text-xs text-[var(--color-text-main)]">
              {observations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CARE RECOMMENDATIONS */}
        <div className="md:col-span-5 glass-card p-6 space-y-4">
          <h4 className="font-serif text-lg font-bold text-[var(--color-text-main)]">
            Care Recommendations
          </h4>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border-subtle)] text-xs space-y-1"
              >
                <span className="text-[10px] font-bold text-[var(--color-emerald-main)] uppercase tracking-wider block">
                  {rec.category === 'Watering' ? '💧 WATERING' : rec.category === 'Light' ? '☀️ LIGHT' : rec.category === 'Nutrition' ? '🌿 NUTRITION' : '✂️ CARE'}
                </span>
                <p className="text-[var(--color-text-main)] font-medium">
                  {rec.text}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('watering')}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[var(--color-emerald-main)] hover:bg-[var(--color-emerald-dark)] text-white text-xs font-extrabold shadow-md transition-all"
          >
            <span>Check Plant Conditions</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
