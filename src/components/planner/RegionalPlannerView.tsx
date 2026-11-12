import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MapPin, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets,
  Download,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { runRegionalOptimization } from '../../lib/api';
import { OptimizationResult } from '../../../shared/types';

export const RegionalPlannerView: React.FC = () => {
  const [region, setRegion] = useState<string>('Jodhpur');
  const [forecastMethod, setForecastMethod] = useState<string>('24h');
  const [energyFocus, setEnergyFocus] = useState<string[]>(['solar', 'wind', 'hydro']);
  const [costWeight, setCostWeight] = useState<number>(0.5); // 0 = Lowest Emissions, 1 = Lowest Cost
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const regions = [
    { id: 'Jodhpur', name: 'Jodhpur (Rajasthan)', desc: 'Thar Desert Solar Capital (Highest Irradiance)' },
    { id: 'Bangalore', name: 'Bangalore (Karnataka)', desc: 'Tech load center with high distributed rooftop potential' },
    { id: 'Chennai', name: 'Chennai (Tamil Nadu)', desc: 'Coastal wind corridor & industrial hub' },
    { id: 'Kutch', name: 'Kutch (Gujarat)', desc: 'World’s largest renewable hybrid energy park' },
    { id: 'Uttarakashi', name: 'Uttarakashi (Uttarakhand)', desc: 'Himalayan hydro & pumped storage champion' },
    { id: 'Satara', name: 'Satara (Maharashtra)', desc: 'Western Ghats wind & pumped storage hydro cluster' },
    { id: 'Delhi NCR', name: 'Delhi NCR', desc: 'Dense metropolitan demand & rooftop solar mandate' }
  ];

  const handleRunOptimization = async () => {
    setIsLoading(true);
    try {
      const res = await runRegionalOptimization(region, forecastMethod, energyFocus, costWeight);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRunOptimization();
  }, [region, forecastMethod, costWeight]);

  const toggleFocus = (fuel: string) => {
    if (energyFocus.includes(fuel)) {
      if (energyFocus.length > 1) {
        setEnergyFocus(energyFocus.filter(f => f !== fuel));
      }
    } else {
      setEnergyFocus([...energyFocus, fuel]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
              EnerJee Integration
            </span>
            <span className="text-xs text-slate-400">Multi-objective Pareto Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Regional Renewable Energy Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulate hourly solar, wind, hydro generation and demand profiles across Indian regions. Trade off generation cost against carbon emissions.
          </p>
        </div>

        <button
          onClick={handleRunOptimization}
          disabled={isLoading}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-600/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Optimizing...' : 'Re-run Optimization'}</span>
        </button>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Region & Horizon */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Select Region / Clean Energy Hub
          </label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
          >
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <p className="text-[11px] text-teal-400 italic">
            {regions.find(r => r.id === region)?.desc}
          </p>

          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block pt-2">
            2. Projection Horizon
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '24h', label: '24 Hours' },
              { id: '90d', label: '90 Days' },
              { id: '1y', label: '1 Year' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setForecastMethod(m.id)}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  forecastMethod === m.id
                    ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Energy Focus Toggles */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            3. Prioritized Generation Sources
          </label>
          <div className="space-y-2">
            {[
              { id: 'solar', label: 'Solar PV (Midday Peaking)', icon: Sun, color: 'text-amber-400' },
              { id: 'wind', label: 'Wind Farms (Evening Peaking)', icon: Wind, color: 'text-cyan-400' },
              { id: 'hydro', label: 'Hydro Dispatch (Flexible Peaking)', icon: Droplets, color: 'text-blue-400' }
            ].map(f => {
              const Icon = f.icon;
              const active = energyFocus.includes(f.id);
              return (
                <div
                  key={f.id}
                  onClick={() => toggleFocus(f.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    active
                      ? 'bg-slate-900 border-teal-500/60 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs text-white">
                    <Icon className={`w-4 h-4 ${f.color}`} />
                    <span>{f.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={active}
                    readOnly
                    className="rounded border-slate-700 bg-slate-900 text-teal-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Cost vs Emissions Priority Slider */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Optimization Objective
              </label>
              <span className="text-xs font-mono font-bold text-teal-400">
                {costWeight === 0.5 ? 'Balanced' : costWeight > 0.5 ? `${Math.round(costWeight * 100)}% Cost Priority` : `${Math.round((1 - costWeight) * 100)}% Emissions Priority`}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              Slide to the left to minimize carbon emissions at all costs, or slide to the right to achieve the lowest levelized cost of energy (Rs/MWh).
            </p>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={costWeight}
              onChange={e => setCostWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />

            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span className="text-emerald-400">🌱 Min Emissions</span>
              <span>50/50</span>
              <span className="text-amber-400">💰 Lowest Cost</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <span className="font-semibold text-white block">Current Optimization Target:</span>
            <span>Cost Weight: {costWeight.toFixed(2)} | Emissions Weight: {(1 - costWeight).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Results Comparison KPI Cards */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Levelized Cost</span>
            <div className="text-2xl font-bold text-white mt-1">
              ₹{result.optimized.cost} <span className="text-xs text-slate-400 font-normal">/MWh</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{Math.round(((result.baseline.cost - result.optimized.cost) / result.baseline.cost) * 100)}% cheaper than baseline</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Carbon Emissions</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {result.optimized.emissions} <span className="text-xs text-slate-400 font-normal">gCO2/kWh</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{Math.round(((result.baseline.emissions - result.optimized.emissions) / result.baseline.emissions) * 100)}% lower emissions</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Clean Energy Share</span>
            <div className="text-2xl font-bold text-teal-400 mt-1">
              {result.optimized.renewableShare}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Baseline: {result.baseline.renewableShare}%
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-xs block">Grid Reliability Index</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">
              {result.optimized.reliability}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              LOLE (Loss of Load Expectation): Safe
            </div>
          </div>
        </div>
      )}

      {/* Main Charts: Stacked Energy Mix & Price Comparison */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy Mix Stacked Chart */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1">Optimized Hourly Generation Mix</h3>
            <p className="text-xs text-slate-400 mb-4">Simulated solar, wind and hydro profiles meeting regional demand</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.energyMix} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="hydro" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Hydro (MW)" />
                  <Area type="monotone" dataKey="wind" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Wind (MW)" />
                  <Area type="monotone" dataKey="solar" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.7} name="Solar (MW)" />
                  <Line type="monotone" dataKey="demand" stroke="#f43f5e" strokeWidth={2} dot={false} name="Demand (MW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Market Price Analysis */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1">Electricity Tariff & Cost Curve</h3>
            <p className="text-xs text-slate-400 mb-4">Optimized dispatch tariff (₹/kWh) vs unoptimized greedy baseline</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.priceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="optimized" stroke="#14b8a6" strokeWidth={2.5} name="Optimized Mix (₹/kWh)" />
                  <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} name="Greedy Baseline (₹/kWh)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {result && (
        <div className="glass-panel p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-3">Optimization Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Performance Metric</th>
                  <th className="p-3 text-teal-400">Optimized Energy Mix</th>
                  <th className="p-3 text-slate-400">Greedy Coal Baseline</th>
                  <th className="p-3 text-emerald-400">Net Improvement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3 font-medium text-slate-200">Levelized Cost of Generation</td>
                  <td className="p-3 font-bold text-white">₹{result.optimized.cost} / MWh</td>
                  <td className="p-3 text-slate-400">₹{result.baseline.cost} / MWh</td>
                  <td className="p-3 font-semibold text-emerald-400">₹{result.baseline.cost - result.optimized.cost} / MWh saved</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-200">Carbon Intensity per Unit</td>
                  <td className="p-3 font-bold text-white">{result.optimized.emissions} gCO2/kWh</td>
                  <td className="p-3 text-slate-400">{result.baseline.emissions} gCO2/kWh</td>
                  <td className="p-3 font-semibold text-emerald-400">{result.baseline.emissions - result.optimized.emissions} gCO2/kWh avoided</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-200">Renewable Penetration Ratio</td>
                  <td className="p-3 font-bold text-teal-400">{result.optimized.renewableShare}%</td>
                  <td className="p-3 text-slate-400">{result.baseline.renewableShare}%</td>
                  <td className="p-3 font-semibold text-emerald-400">+{result.optimized.renewableShare - result.baseline.renewableShare}% RE increase</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-200">Grid Reliability & Up-time</td>
                  <td className="p-3 font-bold text-white">{result.optimized.reliability}%</td>
                  <td className="p-3 text-slate-400">{result.baseline.reliability}%</td>
                  <td className="p-3 text-slate-300">Within statutory grid frequency tolerance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
