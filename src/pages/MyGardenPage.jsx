import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { PlantCard } from '../components/PlantCard';
import { Search, Sparkles, Droplets, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import './MyGardenPage.css';

export const MyGardenPage = () => {
  const {
    plants,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    setIsAddPlantOpen,
    openWateringModal
  } = usePlantora();

  const thrivingCount = plants.filter((p) => p.healthState === 'Thriving' || p.healthState === 'Happy').length;
  const attentionCount = plants.filter((p) => p.healthState === 'Needs Water' || p.healthState === 'Needs Attention').length;

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'thriving') return plant.healthState === 'Thriving' || plant.healthState === 'Happy';
    if (filterStatus === 'attention') return plant.healthState === 'Needs Water' || plant.healthState === 'Needs Attention';
    if (filterStatus === 'favorites') return plant.isFavorite;
    return true;
  });

  const needsWaterPlant = plants.find((p) => p.healthState === 'Needs Water' || p.soilMoisture < 40);

  // Staggered Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="my-garden-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. HEADER & GREETING BANNER */}
      <motion.section className="emotional-greeting-hero" variants={itemVariants}>
        <div className="greeting-text-container">
          <span className="garden-status-tag font-mono">
            <Sparkles size={14} />
            <span>DAILY GARDEN SUMMARY</span>
          </span>
          <h2 className="serif-heading greeting-title">Good morning, Maya 🌿</h2>
          <p className="greeting-subtitle">Your garden is looking happy today.</p>

          <div className="thriving-summary-pills">
            <span className="summary-pill green-pill">
              🌿 {thrivingCount} plants are thriving
            </span>
            {attentionCount > 0 && (
              <span className="summary-pill terracotta-pill">
                💧 {attentionCount} plant needs attention
              </span>
            )}
          </div>
        </div>

        {/* TODAY'S CARE ACTION CARD */}
        {needsWaterPlant && (
          <div className="todays-care-card organic-card">
            <div className="care-card-header">
              <Droplets size={18} className="text-terracotta" />
              <span className="care-header-label">TODAY'S CARE</span>
            </div>
            <p className="care-card-title">Your plants need 1 action today</p>

            <div className="care-action-chips">
              <button
                className="btn-plantora btn-plantora-terracotta care-chip-btn"
                onClick={(e) => openWateringModal(needsWaterPlant, e)}
              >
                💧 Water {needsWaterPlant.nickname} ({needsWaterPlant.soilMoisture}% soil)
              </button>
            </div>
          </div>
        )}
      </motion.section>

      {/* 2. GALLERY FILTER & SEARCH BAR */}
      <motion.section className="gallery-controls-section" variants={itemVariants}>
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search your garden by plant name or variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs-group">
          <button
            className={`filter-tab-pill ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Plants ({plants.length})
          </button>
          <button
            className={`filter-tab-pill ${filterStatus === 'thriving' ? 'active' : ''}`}
            onClick={() => setFilterStatus('thriving')}
          >
            🌿 Thriving ({thrivingCount})
          </button>
          <button
            className={`filter-tab-pill ${filterStatus === 'attention' ? 'active' : ''}`}
            onClick={() => setFilterStatus('attention')}
          >
            💧 Needs Attention ({attentionCount})
          </button>
          <button
            className={`filter-tab-pill ${filterStatus === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilterStatus('favorites')}
          >
            ❤️ Favorites
          </button>
        </div>
      </motion.section>

      {/* 3. MULTI-PLANT GALLERY GRID */}
      <motion.section className="plant-gallery-section" variants={itemVariants}>
        {filteredPlants.length > 0 ? (
          <div className="plant-gallery-grid">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          /* BEAUTIFUL EMPTY STATE */
          <div className="empty-garden-state organic-card">
            <div className="empty-state-icon">🌱</div>
            <h3 className="serif-heading empty-state-title">Your garden is waiting</h3>
            <p className="empty-state-text">Your plant hasn't sent its first sensor reading yet.</p>
            <button
              className="btn-plantora btn-plantora-primary"
              onClick={() => setIsAddPlantOpen(true)}
              style={{ marginTop: 16 }}
            >
              <Plus size={18} />
              <span>Add Your First Plant</span>
            </button>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};
