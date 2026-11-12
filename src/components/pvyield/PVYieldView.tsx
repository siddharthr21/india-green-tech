import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sun, 
  Maximize, 
  RotateCw, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Layers, 
  Plus, 
  Trash2,
  Sliders,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { simulatePVYield } from '../../lib/api';
import { PVString, PVSimulationInput, PVSimulationResult } from '../../../shared/types';

export const PVYieldView: React.FC = () => {
  const [strings, setStrings] = useState<PVString[]>([
    {
      id: 'str-1',
      name: 'South Array (Main Roof)',
      panelCount: 10,
      panelWattage: 550,
      capacityKwp: 5.5,
      tiltDeg: 20,
      azimuthDeg: 180, // True South
      systemLossPct: 14
    },
    {
      id: 'str-2',
      name: 'East Array (Morning Boost)',
      panelCount: 6,
      panelWattage: 550,
      capacityKwp: 3.3,
      tiltDeg: 15,
      azimuthDeg: 90, // True East
      systemLossPct: 14
    }
  ]);

  const [activeStringId, setActiveStringId] = useState<string>('str-1');
  const [result, setResult] = useState<PVSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSimulate = async () => {
    setIsLoading(true);
    try {
      const input: PVSimulationInput = {
        lat: 28.6139,
        lng: 77.2090,
        strings,
        economicAssumptions: {
          importTariffRsPerKwh: 7.2,
          exportTariffRsPerKwh: 3.15,
          inflationRatePct: 4.5
        }
      };
      const res = await simulatePVYield(input);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [strings]);

  const updateActiveString = (field: keyof PVString, val: any) => {
    setStrings(strings.map(s => {
      if (s.id !== activeStringId) return s;
      const updated = { ...s, [field]: val };
      if (field === 'panelCount' || field === 'panelWattage') {
        const count = field === 'panelCount' ? val : s.panelCount;
        const watt = field === 'panelWattage' ? val : s.panelWattage;
        updated.capacityKwp = Number(((count * watt) / 1000).toFixed(2));
      }
      return updated;
    }));
  };

  const addString = () => {
    const newId = `str-${Date.now()}`;
    const newStr: PVString = {
      id: newId,
      name: `Array ${strings.length + 1}`,
      panelCount: 4,
      panelWattage: 550,
      capacityKwp: 2.2,
      tiltDeg: 20,
      azimuthDeg: 270, // West
      systemLossPct: 14
    };
    setStrings([...strings, newStr]);
    setActiveStringId(newId);
  };

  const removeString = (id: string) => {
    if (strings.length <= 1) return;
    const remaining = strings.filter(s => s.id !== id);
    setStrings(remaining);
    setActiveStringId(remaining[0].id);
  };

  const activeString = strings.find(s => s.id === activeStringId) || strings[0];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Solar PV Yield Integration
            </span>
            <span className="text-xs text-slate-400">Multi-Array Compass & PVGIS Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Precision PV Yield & Multi-String Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure multi-string roof orientations (East, South, West arrays), rotate true-north azimuth arrows, adjust tilts, and calculate monthly yield against PVGIS European Commission solar models.
          </p>
        </div>

        <button
          onClick={addString}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-cyan-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add PV String</span>
        </button>
      </div>

      {/* Array String Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {strings.map((str, idx) => (
          <button
            key={str.id}
            onClick={() => setActiveStringId(str.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
              str.id === activeStringId
                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span>{str.name}</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
              {str.capacityKwp} kWp
            </span>
            {strings.length > 1 && (
              <span 
                onClick={(e) => { e.stopPropagation(); removeString(str.id); }}
                className="hover:text-red-400 ml-1"
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Grid: Left String Controls & Compass, Right Yield Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left String Controls (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {activeString.name} Settings
            </h3>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              {activeString.capacityKwp} kWp Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Number of Panels</label>
              <input
                type="number"
                value={activeString.panelCount}
                onChange={e => updateActiveString('panelCount', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Panel Rating (W)</label>
              <select
                value={activeString.panelWattage}
                onChange={e => updateActiveString('panelWattage', parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value={400}>400 W (Standard)</option>
                <option value={450}>450 W (Bifacial)</option>
                <option value={550}>550 W (TopCon Mono)</option>
                <option value={600}>600 W (Utility Tier-1)</option>
              </select>
            </div>
          </div>

          {/* Compass & Azimuth Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-cyan-400" /> True-North Azimuth</span>
              <span className="font-mono text-cyan-400 font-bold">
                {activeString.azimuthDeg}° {activeString.azimuthDeg === 180 ? '(True South - Optimal)' : activeString.azimuthDeg === 90 ? '(East)' : activeString.azimuthDeg === 270 ? '(West)' : ''}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={activeString.azimuthDeg}
              onChange={e => updateActiveString('azimuthDeg', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
            </div>
          </div>

          {/* Tilt Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Roof Tilt Angle</span>
              <span className="font-mono text-amber-400 font-bold">{activeString.tiltDeg}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={activeString.tiltDeg}
              onChange={e => updateActiveString('tiltDeg', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* System Losses */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Estimated System Losses (DC/AC/Soiling)</span>
              <span className="font-mono text-slate-300 font-bold">{activeString.systemLossPct}%</span>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              value={activeString.systemLossPct}
              onChange={e => updateActiveString('systemLossPct', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
            />
          </div>

          {/* Compass Visual Representation */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-center">
            <div className="relative w-28 h-28 rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-900 shadow-inner">
              <span className="absolute top-1 text-[9px] font-bold text-slate-400">N (0°)</span>
              <span className="absolute right-1.5 text-[9px] font-bold text-slate-400">E</span>
              <span className="absolute bottom-1 text-[9px] font-bold text-emerald-400">S (180°)</span>
              <span className="absolute left-1.5 text-[9px] font-bold text-slate-400">W</span>

              {/* Needle pointing in Azimuth direction */}
              <div
                className="absolute w-1 h-12 bg-cyan-400 origin-bottom rounded-full shadow-lg shadow-cyan-400/50"
                style={{
                  transform: `translateY(-50%) rotate(${activeString.azimuthDeg}deg)`,
                  transformOrigin: 'bottom center'
                }}
              />
              <div className="w-3 h-3 rounded-full bg-white z-10" />
            </div>
          </div>
        </div>

        {/* Right Yield Breakdown & Monthly Charts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <>
              {/* Overall KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">Combined Capacity</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {result.totalCapacityKwp} <span className="text-xs text-slate-400 font-normal">kWp</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">Annual Expected Yield</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">
                    {(result.annualYieldKwh).toLocaleString('en-IN')} <span className="text-xs text-slate-400 font-normal">kWh/yr</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">Specific Yield</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {result.specificYieldKwhPerKwp} <span className="text-xs text-slate-400 font-normal">kWh/kWp</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">Annual Savings & Feed-in</span>
                  <div className="text-2xl font-bold text-amber-400 mt-1">
                    ₹{(result.economics.annualRevenueRs).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Monthly Production Bar Chart */}
              <div className="glass-panel p-6 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Monthly PV Generation Profile (PVGIS)</h3>
                    <p className="text-xs text-slate-400">Monthly energy yield factoring azimuth angles and Indian insolation</p>
                  </div>
                  <span className="text-xs text-cyan-400 font-mono bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
                    PR: {result.performanceRatioPct}%
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.monthlyBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Bar dataKey="yieldKwh" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Expected Yield (kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Array Strings Summary Table */}
              <div className="glass-panel p-5 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Individual Strings Production Breakdown</h4>
                <div className="space-y-2">
                  {result.stringsSummary.map((strSummary) => (
                    <div key={strSummary.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="font-semibold text-slate-200 block">{strSummary.name}</span>
                        <span className="text-slate-500 text-[11px]">{strSummary.capacityKwp} kWp capacity</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-cyan-400 font-mono text-sm">{strSummary.annualKwh.toLocaleString('en-IN')} kWh/yr</span>
                        <span className="text-[10px] text-slate-500 block">≈ {Math.round((strSummary.annualKwh / result.annualYieldKwh) * 100)}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
