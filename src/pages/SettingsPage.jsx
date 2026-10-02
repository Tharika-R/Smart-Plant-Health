import React, { useState } from 'react';
import { usePlantora } from '../context/PlantoraContext';
import { Settings, Wifi, Smartphone, Save, Sun, Moon } from 'lucide-react';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { hardwareBridge, setHardwareBridge, showToast, theme, toggleTheme, isDarkMode } = usePlantora();
  const [ipAddress, setIpAddress] = useState(hardwareBridge.ipAddress);
  const [useMock, setUseMock] = useState(hardwareBridge.useMock);

  const handleSave = (e) => {
    e.preventDefault();
    setHardwareBridge((prev) => ({
      ...prev,
      ipAddress,
      useMock,
      statusText: useMock ? 'Your garden is connected 🌿' : `Connected to ESP32 (${ipAddress})`
    }));
    showToast('Garden settings saved successfully! 🌿', 'success');
  };

  return (
    <div className="plantora-settings-page">
      <div className="page-header">
        <div>
          <h2 className="serif-heading page-title">Settings & Preferences ⚙</h2>
          <p className="page-subtitle">
            Configure garden theme, preferences, and physical ESP32 sensor connectivity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form-container">
        {/* THEME PREFERENCE CARD */}
        <div className="organic-card settings-card">
          <div className="card-header-row">
            <div className="title-with-icon">
              {isDarkMode ? <Moon size={20} className="text-emerald" /> : <Sun size={20} className="text-emerald" />}
              <h3 className="serif-heading">Theme Appearance</h3>
            </div>
            <span className="theme-current-tag">{isDarkMode ? '🌙 Dark Mode Active' : '☀️ Light Mode Active'}</span>
          </div>

          <div className="mode-tabs-grid">
            <button
              type="button"
              className={`mode-choice-btn ${!isDarkMode ? 'active' : ''}`}
              onClick={() => isDarkMode && toggleTheme()}
            >
              <Sun size={20} className="text-amber-500" />
              <div>
                <strong>☀️ Botanical Light Theme</strong>
                <p>Fresh, airy, cream background with soft sage accents</p>
              </div>
            </button>

            <button
              type="button"
              className={`mode-choice-btn ${isDarkMode ? 'active' : ''}`}
              onClick={() => !isDarkMode && toggleTheme()}
            >
              <Moon size={20} className="text-emerald" />
              <div>
                <strong>🌙 Deep Forest Dark Theme</strong>
                <p>Calm, luxurious, dark charcoal background with soft green highlights</p>
              </div>
            </button>
          </div>
        </div>

        {/* CONNECTION STATUS */}
        <div className="organic-card settings-card highlight-card">
          <div className="card-header-row">
            <div className="title-with-icon">
              <Wifi size={20} className="text-emerald" />
              <h3 className="serif-heading">Hardware & Sensor Connection</h3>
            </div>
            <span className="status-connection-pill">
              {hardwareBridge.statusText}
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group full-span">
              <label className="form-label">Data Source Mode</label>
              <div className="mode-tabs-grid">
                <button
                  type="button"
                  className={`mode-choice-btn ${useMock ? 'active' : ''}`}
                  onClick={() => setUseMock(true)}
                >
                  <span className="live-dot-pill green-dot" />
                  <div>
                    <strong>Simulated Telemetry Mode</strong>
                    <p>Ideal for demonstration and local testing</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`mode-choice-btn ${!useMock ? 'active' : ''}`}
                  onClick={() => setUseMock(false)}
                >
                  <span className="live-dot-pill blue-dot" />
                  <div>
                    <strong>Physical ESP32 REST Hardware API</strong>
                    <p>Connects directly to your local ESP32 IP</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">ESP32 IP Address / Base URL</label>
              <input
                type="text"
                className="form-input font-mono"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="http://192.168.1.104"
              />
            </div>
          </div>
        </div>

        {/* MOBILE APP PWA */}
        <div className="organic-card settings-card">
          <div className="card-header-row">
            <div className="title-with-icon">
              <Smartphone size={20} className="text-emerald" />
              <h3 className="serif-heading">Mobile Phone App Installation (PWA)</h3>
            </div>
          </div>

          <p className="pwa-text">
            PLANTORA supports <strong>Progressive Web App (PWA)</strong> installation. Add it directly to your iPhone or Android home screen to use it full-screen like a native app!
          </p>

          <div className="pwa-grid">
            <div className="pwa-guide-box">
              <strong>📱 Android (Chrome / Edge)</strong>
              <ol>
                <li>Open URL in Chrome</li>
                <li>Tap 3 dots (Menu)</li>
                <li>Tap "Add to Home screen"</li>
              </ol>
            </div>
            <div className="pwa-guide-box">
              <strong>🍏 iPhone (Safari)</strong>
              <ol>
                <li>Open URL in Safari</li>
                <li>Tap Share button</li>
                <li>Tap "Add to Home Screen"</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="settings-action-bar">
          <button type="submit" className="btn-plantora btn-plantora-primary">
            <Save size={18} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
