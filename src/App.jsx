import React from 'react';
import { PlantivaProvider, usePlantiva } from './context/PlantivaContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { OfflineOverlay } from './components/OfflineOverlay';

// Pages
import { Dashboard } from './pages/Dashboard';
import { PlantHealth } from './pages/PlantHealth';
import { PlantVisionPage } from './pages/PlantVisionPage';
import { Watering } from './pages/Watering';
import { Fertilizer } from './pages/Fertilizer';
import { Analytics } from './pages/Analytics';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

const ContentWrapper = () => {
  const { activeTab, toast } = usePlantiva();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'plant-vision':
        return <PlantVisionPage />;
      case 'plant-health':
        return <PlantHealth />;
      case 'watering':
        return <Watering />;
      case 'fertilizer':
        return <Fertilizer />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-app)] text-[var(--color-text-main)] transition-colors duration-300">
      {/* DESKTOP SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full animate-fadeIn">
          {renderTabContent()}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileNav />

      {/* OFFLINE OVERLAY SCREEN IF DISCONNECTED */}
      <OfflineOverlay />

      {/* TOAST FEEDBACK NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 ${
              toast.type === 'warning'
                ? 'bg-amber-500 text-white border-amber-600'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-[var(--color-emerald-main)] text-white border-emerald-600'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <PlantivaProvider>
      <ContentWrapper />
    </PlantivaProvider>
  );
}

export default App;
