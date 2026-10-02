import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { ConfirmationModal } from './ConfirmationModal';
import { Sprout, X, AlertTriangle, Sparkles, FlaskConical, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './NutritionModal.css';

export const NutritionModal = () => {
  const {
    isNutritionModalOpen,
    setIsNutritionModalOpen,
    activeActionPlant,
    handleFeedPlant
  } = usePlantora();

  const [doseAmount, setDoseAmount] = useState(5);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [commandSent, setCommandSent] = useState(false);

  if (!isNutritionModalOpen || !activeActionPlant) return null;

  const { id, nickname, growthStage, nutrientName, soilMoisture } = activeActionPlant;
  const isSoilTooDry = soilMoisture < 30;

  const handleDispenseClick = () => {
    if (isSoilTooDry) return;
    setIsConfirming(true);
  };

  const executeDispense = async () => {
    setIsConfirming(false);
    setIsFeeding(true);
    const success = await handleFeedPlant(id, doseAmount);
    setIsFeeding(false);

    if (success) {
      setCommandSent(true);
      setTimeout(() => {
        setCommandSent(false);
        setIsNutritionModalOpen(false);
      }, 1500);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setIsNutritionModalOpen(false)}>
        <motion.div
          className="nutrition-modal-card organic-card"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-icon"
            onClick={() => setIsNutritionModalOpen(false)}
          >
            <X size={20} />
          </button>

          <div className="modal-state-container">
            <div className="modal-header-icon-box green-icon-box">
              <FlaskConical size={28} className="green-sprout-icon" />
            </div>

            <h3 className="serif-heading modal-title">🧪 Fertilizer Feed for {nickname}</h3>

            <div className="nutrition-reason-card">
              <div className="stage-tag-badge">
                <Sparkles size={13} />
                <span>Recommended dose: {doseAmount} mL</span>
              </div>
              <p className="reason-body-text">
                Your <strong>{nickname}</strong> is currently in the active <strong>{growthStage}</strong> stage.
                Based on growth stage and conditions, <strong>{nutrientName || 'Organic Nutrient Feed'}</strong> is recommended.
              </p>
            </div>

            {isSoilTooDry ? (
              <div className="dry-soil-warning-box">
                <AlertTriangle size={20} className="warning-icon" />
                <div>
                  <strong>Soil is too dry 💧</strong>
                  <p>Soil moisture is below 30% ({soilMoisture}%). Water your plant before fertilizing to protect root health.</p>
                </div>
              </div>
            ) : (
              <div className="dose-selector-box">
                <label className="amount-label">Select Dose Volume (mL):</label>
                <div className="amount-chips">
                  {[5, 10, 15, 25].map((amt) => (
                    <button
                      key={amt}
                      className={`amount-chip ${doseAmount === amt ? 'active' : ''}`}
                      onClick={() => setDoseAmount(amt)}
                    >
                      {amt} mL
                    </button>
                  ))}
                </div>
              </div>
            )}

            {commandSent && (
              <div className="command-sent-badge">
                <CheckCircle2 size={18} />
                <span>✓ Fertilizer command sent</span>
              </div>
            )}

            <div className="modal-action-footer">
              <button
                className="btn-plantora btn-plantora-secondary"
                onClick={() => setIsNutritionModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn-plantora btn-plantora-primary action-water-btn"
                onClick={handleDispenseClick}
                disabled={isSoilTooDry || isFeeding || commandSent}
              >
                <FlaskConical size={18} />
                <span>{isFeeding ? 'Dispensing...' : 'Dispense Fertilizer'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fertilizer Dispense Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={executeDispense}
        title={`Ready to dispense ${doseAmount} mL of fertilizer?`}
        icon={FlaskConical}
        confirmText="Dispense"
        variant="primary"
      >
        <p className="modal-description">
          This will issue a <strong>FERTILIZE</strong> command to the ESP32 to open the fertilizer valve and run the peristaltic pump for {doseAmount} mL.
        </p>
      </ConfirmationModal>
    </>
  );
};
