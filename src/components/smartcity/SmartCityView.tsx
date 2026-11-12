import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  Leaf, 
  Smile, 
  Award, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  Sun,
  Wind,
  Droplets,
  BatteryCharging
} from 'lucide-react';
import { runSmartCitySimulation } from '../../lib/api';
import { SmartCityResult } from '../../../shared/types';

export const SmartCityView: React.FC = () => {
  const [city, setCity] = useState<string>('Jodhpur');
  const [budgetCr, setBudgetCr] = useState<number>(100);
  const [allocations, setAllocations] = useState<{ solar: number; wind: number; hydro: number; storage: number }>({
    solar: 40,
    wind: 30,
    hydro: 15,
    storage: 15
  });
  const [simYear, setSimYear] = useState<number>(2026);
  const [result, setResult] = useState<SmartCityResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cities = ['Jodhpur', 'Bangalore', 'Chennai', 'Kutch', 'Satara'];

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const res = await runSmartCitySimulation(city, budgetCr, allocations, simYear);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (key: keyof typeof allocations, val: number) => {
    setAllocations(prev => ({ ...prev, [key]: val }));
  };

  const totalAllocated = allocations.solar + allocations.wind + allocations.hydro + allocations.storage;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              EnerJee Smart City Simulator
            </span>
            <span className="text-xs text-slate-400">Municipal Clean Energy Capital Allocation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Smart City Clean Energy Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Allocate a municipal clean energy capital budget across Solar, Wind, Hydro, and Battery Storage. Stress-test the city grid against monsoon floods, heatwaves, and peak load surges.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-purple-600/20"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isLoading ? 'Simulating Year...' : 'Run Simulation'}</span>
        </button>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City and Budget Controls */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Municipality Settings</h3>
            <span className="text-xs text-purple-400 font-mono">₹{budgetCr} Crores Budget</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Smart City</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Simulation Year</label>
              <select
                value={simYear}
                onChange={e => setSimYear(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value={2026}>2026 (Near-term)</option>
                <option value={2028}>2028 (Mid-term)</option>
                <option value={2030}>2030 (COP28 500GW Goal)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-2">
              <span>Total Municipal Capex Budget</span>
              <span className="font-mono font-bold text-white">₹{budgetCr} Cr</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={budgetCr}
              onChange={e => setBudgetCr(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>₹20 Cr</span>
              <span>₹250 Cr</span>
              <span>₹500 Cr</span>
            </div>
          </div>
        </div>

        {/* Capex Allocation Sliders */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Resource Budget Split (%)</h3>
            <span className={`text-xs font-mono font-bold ${totalAllocated === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              Total: {totalAllocated}% {totalAllocated !== 100 && '(Auto-normalized)'}
            </span>
          </div>

          {/* Solar */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Rooftop & Utility Solar PV</span>
              <span className="font-mono font-bold text-amber-400">{allocations.solar}% (₹{Math.round((budgetCr * allocations.solar) / (totalAllocated || 1))} Cr)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.solar}
              onChange={e => handleSliderChange('solar', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Wind */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-cyan-400" /> Onshore & Industrial Wind Turbines</span>
              <span className="font-mono font-bold text-cyan-400">{allocations.wind}% (₹{Math.round((budgetCr * allocations.wind) / (totalAllocated || 1))} Cr)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.wind}
              onChange={e => handleSliderChange('wind', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Hydro */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Small Hydro / Pumped Storage (PSP)</span>
              <span className="font-mono font-bold text-blue-400">{allocations.hydro}% (₹{Math.round((budgetCr * allocations.hydro) / (totalAllocated || 1))} Cr)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.hydro}
              onChange={e => handleSliderChange('hydro', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><BatteryCharging className="w-3.5 h-3.5 text-purple-400" /> Battery Storage (BESS) Feeder Buffer</span>
              <span className="font-mono font-bold text-purple-400">{allocations.storage}% (₹{Math.round((budgetCr * allocations.storage) / (totalAllocated || 1))} Cr)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={allocations.storage}
              onChange={e => handleSliderChange('storage', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Simulation Results Section */}
      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Annual Clean Energy</span>
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {result.energyOutputGwh} <span className="text-xs text-slate-400 font-normal">GWh/yr</span>
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">Saves ₹{(result.energyOutputGwh * 4.2).toFixed(1)} Cr in power purchase</p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>CO2 Offset</span>
                <Coins className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-teal-400">
                {(result.co2SavedTonnes).toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">Tonnes/yr</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Equivalent to 45,000 mature trees</p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Public Satisfaction</span>
                <Smile className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {result.publicSatisfactionPct}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Zero residential blackout hours</p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>National Green Rank</span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-400">
                {result.sustainabilityRank}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1">Tier-1 Clean Energy Leader</p>
            </div>
          </div>

          {/* Triggered Climate Events & Feeder Logs */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Simulated Climate & Weather Stress Events ({city} · Year {simYear})</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-world stress-test events evaluated dynamically based on municipal generation and storage diversity.
            </p>

            <div className="space-y-2 text-xs">
              {result.eventsTriggered.map((evt, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center gap-3 text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{evt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
