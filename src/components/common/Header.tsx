import React from 'react';
import { 
  Zap, 
  Activity, 
  Sliders, 
  Building2, 
  Sun, 
  Compass, 
  Bot, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { NationalGridSummary } from '../../../shared/types';

export type NavTab = 'overview' | 'grid' | 'planner' | 'smart-city' | 'rooftop' | 'pv-yield' | 'mentor';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  gridSummary: NationalGridSummary | null;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, gridSummary }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'grid', label: 'National Grid', icon: Activity, badge: 'Live' },
    { id: 'planner', label: 'Regional Planner', icon: Sliders },
    { id: 'smart-city', label: 'Smart City Sim', icon: Building2 },
    { id: 'rooftop', label: 'Rooftop Solar', icon: Sun, badge: 'PM Surya' },
    { id: 'pv-yield', label: 'PV Yield Studio', icon: Compass },
    { id: 'mentor', label: 'AI Mentor', icon: Bot }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Top micro-bar: Live Indian Grid Stats */}
      <div className="border-b border-slate-800/70 bg-slate-900/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">INDIAN NATIONAL GRID TELEMETRY</span>
            <span className="text-slate-500">|</span>
            <span>Freq: <strong className="text-slate-100">{gridSummary?.frequencyHz || 50.02} Hz</strong></span>
            <span className="text-slate-500">|</span>
            <span>Demand Met: <strong className="text-slate-100">{gridSummary ? `${(gridSummary.demandMetMw / 1000).toFixed(1)} GW` : '224.8 GW'}</strong></span>
            <span className="text-slate-500">|</span>
            <span>Renewable Share: <strong className="text-emerald-400">{gridSummary?.renewableSharePct || 31.4}%</strong></span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>4 States SCADA Measured</span>
            </span>
            <span className="text-slate-600">·</span>
            <span>28 States MERIT Estimated</span>
            <span className="text-slate-600">·</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono">COP28 500GW Target</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                INDIA GREEN TECH
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Integrated Clean Energy & Grid Intelligence</p>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 gap-2 border-t border-slate-800 bg-slate-950">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NavTab)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 bg-slate-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
