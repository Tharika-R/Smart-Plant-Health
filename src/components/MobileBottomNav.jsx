import React from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Flower2, Heart, Plus, BookOpen, Settings } from 'lucide-react';
import './MobileBottomNav.css';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab, setSelectedPlantId, setIsAddPlantOpen } = usePlantora();

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setSelectedPlantId(null);
  };

  return (
    <div className="mobile-bottom-nav">
      <button
        className={`mobile-nav-btn ${activeTab === 'garden' ? 'active' : ''}`}
        onClick={() => handleNavClick('garden')}
      >
        <Flower2 size={20} />
        <span>Garden</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
        onClick={() => handleNavClick('favorites')}
      >
        <Heart size={20} />
        <span>Favorites</span>
      </button>

      <button
        className="mobile-nav-btn add-btn-highlight"
        onClick={() => setIsAddPlantOpen(true)}
      >
        <div className="plus-icon-circle">
          <Plus size={22} />
        </div>
        <span>Add</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'diary' ? 'active' : ''}`}
        onClick={() => handleNavClick('diary')}
      >
        <BookOpen size={20} />
        <span>Diary</span>
      </button>

      <button
        className={`mobile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => handleNavClick('settings')}
      >
        <Settings size={20} />
        <span>Settings</span>
      </button>
    </div>
  );
};
