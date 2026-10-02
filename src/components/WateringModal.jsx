import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Droplets, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './WateringModal.css';

export const WateringModal = () => {
  const {
    isWateringModalOpen,
    setIsWateringModalOpen,
    activeActionPlant,
    handleWaterPlant
  } = usePlantora();

  const [waterAmount, setWaterAmount] = useState(150);
  const [isWatering, setIsWatering] = useState(false);
  const [commandSent, setCommandSent] = useState(false);

  if (!isWateringModalOpen || !activeActionPlant) return null;

  const { nickname, soilMoisture } = activeActionPlant;

  const startWateringProcess = async () => {
    setIsWatering(true);
    const success = await handleWaterPlant(activeActionPlant.id, waterAmount);
    setIsWatering(false);

    if (success) {
      setCommandSent(true);
      setTimeout(() => {
        setCommandSent(false);
        setIsWateringModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsWateringModalOpen(false)}>
      <motion.div
        className="watering-modal-card organic-card"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon"
          onClick={() => setIsWateringModalOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="modal-state-container">
          <div className="modal-header-icon-box blue-icon-box">
            <Droplets size={28} className="blue-droplet-icon" />
          </div>

          <h3 className="serif-heading modal-title">Watering {nickname}</h3>
          <p className="modal-subtitle-text">
            Current soil moisture: <strong>{soilMoisture}%</strong>. Target: 70%.
          </p>

          <div className="amount-selector-box">
            <label className="amount-label">Select Water Volume:</label>
            <div className="amount-chips">
              {[75, 150, 225, 300].map((amt) => (
                <button
                  key={amt}
                  className={`amount-chip ${waterAmount === amt ? 'active' : ''}`}
                  onClick={() => setWaterAmount(amt)}
                >
                  {amt} mL ({Math.round(amt / 15)}s)
                </button>
              ))}
            </div>
          </div>

          {commandSent && (
            <div className="command-sent-badge">
              <CheckCircle2 size={18} />
              <span>✓ Watering command sent</span>
            </div>
          )}

          <div className="modal-action-footer">
            <button
              className="btn-plantora btn-plantora-secondary"
              onClick={() => setIsWateringModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn-plantora btn-plantora-terracotta action-water-btn"
              onClick={startWateringProcess}
              disabled={isWatering || commandSent}
            >
              <Droplets size={18} />
              <span>{isWatering ? 'Sending Command...' : '💧 Water Now'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
