import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { X, Sprout, ChevronRight, ChevronLeft, Check, Sparkles, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AddPlantModal.css';

export const AddPlantModal = () => {
  const { isAddPlantOpen, setIsAddPlantOpen, handleAddPlant } = usePlantora();
  const [step, setStep] = useState(1);

  // Form State
  const [speciesType, setSpeciesType] = useState('Monstera');
  const [name, setName] = useState('My Monstera');
  const [location, setLocation] = useState('Indoor');
  const [ageDays, setAgeDays] = useState(30);
  const [deviceId, setDeviceId] = useState('ESP32-005');

  if (!isAddPlantOpen) return null;

  const plantTypes = [
    { type: 'Monstera', icon: '🌿', title: 'Monstera Deliciosa', desc: 'Swiss Cheese Plant' },
    { type: 'Tomato', icon: '🍅', title: 'Cherry Tomato', desc: 'Balcony Crop' },
    { type: 'Rose', icon: '🌹', title: 'Hybrid Rose', desc: 'Flowering Shrub' },
    { type: 'Chilli', icon: '🌶️', title: 'Birdseye Chilli', desc: 'Spicy Fruiting' },
    { type: 'Other', icon: '🌱', title: 'Other Houseplant', desc: 'Custom Botanical' }
  ];

  const locations = [
    { label: 'Indoor', icon: '🏠', desc: 'Living room or bedroom' },
    { label: 'Balcony', icon: '🌤️', desc: 'Outdoor balcony' },
    { label: 'Garden', icon: '🌳', desc: 'Outdoor garden soil' },
    { label: 'Greenhouse', icon: '🪴', desc: 'Controlled greenhouse' }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      handleAddPlant({ name, speciesType, location, ageDays, deviceId });
      setIsAddPlantOpen(false);
      setStep(1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddPlantOpen(false)}>
      <motion.div
        className="add-plant-modal organic-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon"
          onClick={() => setIsAddPlantOpen(false)}
        >
          <X size={20} />
        </button>

        {/* STEP PROGRESS BAR */}
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="wizard-content">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="wizard-step animate-fadeIn">
              <span className="step-tag font-mono">STEP 1 OF 5</span>
              <h3 className="serif-heading step-title">What are we growing? 🌿</h3>
              <p className="step-subtitle">Select the variety of your new plant companion.</p>

              <div className="options-grid">
                {plantTypes.map((pt) => (
                  <button
                    key={pt.type}
                    className={`option-card ${speciesType === pt.type ? 'active' : ''}`}
                    onClick={() => {
                      setSpeciesType(pt.type);
                      setName(`My ${pt.type}`);
                    }}
                  >
                    <span className="option-icon">{pt.icon}</span>
                    <div className="option-text">
                      <strong>{pt.title}</strong>
                      <span>{pt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="wizard-step animate-fadeIn">
              <span className="step-tag font-mono">STEP 2 OF 5</span>
              <h3 className="serif-heading step-title">Give your plant a name 💚</h3>
              <p className="step-subtitle">Choose a nickname for your plant companion.</p>

              <div className="form-input-group">
                <input
                  type="text"
                  className="wizard-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunny, Luna, Rosie..."
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="wizard-step animate-fadeIn">
              <span className="step-tag font-mono">STEP 3 OF 5</span>
              <h3 className="serif-heading step-title">Where does your plant live? 🌤️</h3>
              <p className="step-subtitle">This helps tailor ambient temperature & light guidance.</p>

              <div className="options-grid">
                {locations.map((loc) => (
                  <button
                    key={loc.label}
                    className={`option-card ${location === loc.label ? 'active' : ''}`}
                    onClick={() => setLocation(loc.label)}
                  >
                    <span className="option-icon">{loc.icon}</span>
                    <div className="option-text">
                      <strong>{loc.label}</strong>
                      <span>{loc.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="wizard-step animate-fadeIn">
              <span className="step-tag font-mono">STEP 4 OF 5</span>
              <h3 className="serif-heading step-title">How old is your plant? 📅</h3>
              <p className="step-subtitle">Enter estimated days since planting or adoption.</p>

              <div className="form-input-group">
                <input
                  type="number"
                  className="wizard-input font-mono"
                  value={ageDays}
                  onChange={(e) => setAgeDays(e.target.value)}
                  min="1"
                />
                <span className="unit-tag font-mono">Days with you</span>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="wizard-step animate-fadeIn">
              <span className="step-tag font-mono">STEP 5 OF 5</span>
              <h3 className="serif-heading step-title">Connect your plant 📡</h3>
              <p className="step-subtitle">Assign an ESP32 hardware device or demo gateway.</p>

              <div className="form-input-group">
                <div className="device-select-box">
                  <Wifi size={20} className="text-emerald" />
                  <input
                    type="text"
                    className="wizard-input font-mono"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="ESP32-005"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WIZARD ACTIONS FOOTER */}
          <div className="wizard-footer">
            {step > 1 ? (
              <button className="btn-plantora btn-plantora-secondary" onClick={handleBack}>
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button className="btn-plantora btn-plantora-primary" onClick={handleNext}>
              <span>{step === 5 ? 'Your new plant is ready 🌱' : 'Next Step'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
