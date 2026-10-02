import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { BookOpen, Plus, Camera, Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import './PlantDiaryPage.css';

export const PlantDiaryPage = () => {
  const { diaryEntries, setIsAddDiaryOpen, plants } = usePlantora();

  return (
    <div className="plant-diary-page">
      <div className="page-header flex justify-between items-center">
        <div>
          <h2 className="serif-heading page-title">Plant Care Diary 📖</h2>
          <p className="page-subtitle">
            A personal memory log of growth milestones, leaf splits, misting, and care notes.
          </p>
        </div>

        <button
          className="btn-plantora btn-plantora-primary"
          onClick={() => setIsAddDiaryOpen(true)}
        >
          <Plus size={18} />
          <span>Add Memory</span>
        </button>
      </div>

      <div className="diary-feed-container">
        {diaryEntries.length > 0 ? (
          diaryEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="organic-card diary-card"
            >
              <div className="diary-card-header">
                <div className="diary-title-group">
                  <span className="diary-tag-pill font-mono">{entry.tag || 'Care Note'}</span>
                  <h3 className="serif-heading diary-entry-title">{entry.title}</h3>
                </div>

                <div className="diary-date-badge font-mono">
                  <Calendar size={13} />
                  <span>{entry.date} • {entry.time}</span>
                </div>
              </div>

              <div className="diary-plant-badge font-mono">
                <span>Companion: <strong>{entry.plantName}</strong></span>
              </div>

              <p className="diary-note-text">{entry.note}</p>
            </motion.div>
          ))
        ) : (
          <div className="organic-card empty-diary-state">
            <div className="empty-state-icon">📖</div>
            <h3 className="serif-heading empty-state-title">No diary entries yet 🌱</h3>
            <p className="empty-state-desc">Start recording your plant's journey, growth notes, and leaf milestones.</p>
            <button
              className="btn-plantora btn-plantora-primary"
              onClick={() => setIsAddDiaryOpen(true)}
            >
              <Plus size={18} />
              <span>Add Your First Memory</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
