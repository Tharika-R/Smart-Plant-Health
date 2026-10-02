import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import {
  Flower2,
  Heart,
  BookOpen,
  LineChart,
  Droplets,
  Sprout,
  Settings,
  Plus,
  Sun,
  Moon,
  Leaf
} from 'lucide-react';
import './PlantoraSidebar.css';

export const PlantoraSidebar = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedPlantId,
    setIsAddPlantOpen,
    hardwareBridge,
    theme,
    toggleTheme,
    isDarkMode
  } = usePlantora();

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSelectedPlantId(null);
  };

  return (
    <aside className="plantora-sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand-box">
        <div className="brand-icon-circle">
          <Leaf size={24} className="brand-flower" />
        </div>
        <div className="brand-text-wrapper">
          <h1 className="brand-title">PLANTORA</h1>
          <p className="brand-subtext">Your plants. Your little garden.</p>
        </div>
      </div>

      {/* Primary Add Plant Action Button */}
      <div className="sidebar-action-box">
        <button
          className="btn-plantora btn-plantora-primary add-plant-nav-btn"
          onClick={() => setIsAddPlantOpen(true)}
        >
          <Plus size={18} />
          <span>Add New Plant</span>
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav-groups">
        <div className="nav-group">
          <div className="nav-group-label">GARDEN HUB</div>

          <button
            className={`sidebar-link ${activeTab === 'garden' ? 'active' : ''}`}
            onClick={() => handleNavClick('garden')}
          >
            <Flower2 size={18} className="link-icon" />
            <span>My Garden</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleNavClick('favorites')}
          >
            <Heart size={18} className="link-icon" />
            <span>Favorites</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'diary' ? 'active' : ''}`}
            onClick={() => handleNavClick('diary')}
          >
            <BookOpen size={18} className="link-icon" />
            <span>Plant Diary</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => handleNavClick('journey')}
          >
            <LineChart size={18} className="link-icon" />
            <span>Plant Journey</span>
          </button>
        </div>

        <div className="nav-group">
          <div className="nav-group-label">CARE</div>

          <button
            className={`sidebar-link ${activeTab === 'watering' ? 'active' : ''}`}
            onClick={() => handleNavClick('watering')}
          >
            <Droplets size={18} className="link-icon" />
            <span>Watering</span>
          </button>

          <button
            className={`sidebar-link ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => handleNavClick('nutrition')}
          >
            <Sprout size={18} className="link-icon" />
            <span>Nutrition</span>
          </button>
        </div>

        <div className="nav-group">
          <div className="nav-group-label">PREFERENCES</div>

          <button
            className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <Settings size={18} className="link-icon" />
            <span>Settings</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="sidebar-link theme-toggle-sidebar-btn"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun size={18} className="link-icon text-amber-400" /> : <Moon size={18} className="link-icon" />}
            <span>{isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
          </button>
        </div>
      </nav>

      {/* Connection Status & Pulse */}
      <div className="sidebar-connection-footer">
        <div className="connection-pill">
          <span className="live-pulse-green" />
          <span className="connection-text">{hardwareBridge.statusText}</span>
        </div>
      </div>
    </aside>
  );
};
