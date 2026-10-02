import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { X, Camera, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './AddDiaryModal.css';

export const AddDiaryModal = () => {
  const { isAddDiaryOpen, setIsAddDiaryOpen, handleAddDiaryEntry, plants } = usePlantora();

  const [plantId, setPlantId] = useState(plants[0]?.id || 1);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [tag, setTag] = useState('Growth Milestone');

  if (!isAddDiaryOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const selPlant = plants.find((p) => p.id === Number(plantId)) || plants[0];
    handleAddDiaryEntry({
      plantId: selPlant.id,
      plantName: selPlant.name,
      title: title || `New memory for ${selPlant.name} 🌿`,
      note: note || 'Growth note recorded.',
      tag
    });
    setIsAddDiaryOpen(false);
    setTitle('');
    setNote('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddDiaryOpen(false)}>
      <motion.div
        className="add-diary-modal organic-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon"
          onClick={() => setIsAddDiaryOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="diary-modal-header">
          <div className="icon-box green-box">
            <BookOpen size={24} />
          </div>
          <h3 className="serif-heading modal-title">Add Plant Diary Memory 📖</h3>
          <p className="modal-subtitle">Capture milestone photos, notes, and care memories.</p>
        </div>

        <form onSubmit={handleSubmit} className="diary-form">
          <div className="form-group">
            <label className="form-label">Select Companion Plant</label>
            <select
              className="form-input"
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
            >
              {plants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.iconEmoji} {p.name} ({p.species})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Memory Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New leaf appeared! 🍃 or First flower bloom 🌼"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Growth Note</label>
            <textarea
              className="form-textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe your plant's progress, leaf shape, misting, or care observation..."
              rows={3}
            />
          </div>

          <div className="photo-upload-placeholder">
            <Camera size={24} className="camera-icon" />
            <span>Add a photo (Future feature preview) 📸</span>
          </div>

          <div className="modal-action-footer">
            <button
              type="button"
              className="btn-plantora btn-plantora-secondary"
              onClick={() => setIsAddDiaryOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-plantora btn-plantora-primary">
              <BookOpen size={16} />
              <span>Save Diary Memory</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
