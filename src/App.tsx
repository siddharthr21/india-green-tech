import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OverviewView } from './components/overview/OverviewView';
import { NationalGridView } from './components/grid/NationalGridView';
import { RegionalPlannerView } from './components/planner/RegionalPlannerView';
import { SmartCityView } from './components/smartcity/SmartCityView';
import { RooftopView } from './components/rooftop/RooftopView';
import { PVYieldView } from './components/pvyield/PVYieldView';
import { MentorView } from './components/mentor/MentorView';
import { fetchLiveGrid } from './lib/api';
import { NationalGridSummary } from '../shared/types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [gridSummary, setGridSummary] = useState<NationalGridSummary | null>(null);

  useEffect(() => {
    fetchLiveGrid()
      .then(res => setGridSummary(res.summary))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Global Navigation & Live Grid Telemetry Bar */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        gridSummary={gridSummary} 
      />

      {/* Main Container */}
      <main className={`flex-grow w-full mx-auto ${
        activeTab === 'rooftop' || activeTab === 'pv-yield' || activeTab === 'grid'
          ? 'max-w-[1440px] px-2 sm:px-4 py-4 sm:py-6'
          : 'max-w-7xl px-4 py-8'
      }`}>
        {activeTab === 'overview' && (
          <OverviewView setActiveTab={setActiveTab} gridSummary={gridSummary} />
        )}

        {activeTab === 'grid' && (
          <NationalGridView />
        )}

        {activeTab === 'planner' && (
          <RegionalPlannerView />
        )}

        {activeTab === 'smart-city' && (
          <SmartCityView />
        )}

        {activeTab === 'rooftop' && (
          <RooftopView />
        )}

        {activeTab === 'pv-yield' && (
          <PVYieldView />
        )}

        {activeTab === 'mentor' && (
          <MentorView />
        )}
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
};

export default App;
