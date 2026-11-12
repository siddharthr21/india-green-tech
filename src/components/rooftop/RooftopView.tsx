import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  MapPin, 
  Calculator, 
  Home, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard, 
  HelpCircle,
  Plus,
  Trash2,
  Maximize2
} from 'lucide-react';
import { calculateRooftop } from '../../lib/api';
import { RooftopCalculationInput, RooftopCalculationResult } from '../../../shared/types';

export const RooftopView: React.FC = () => {
  const [address, setAddress] = useState<string>('Rohini Sector 15, New Delhi');
  const [stateCode, setStateCode] = useState<string>('DL');
  const [monthlyBillRs, setMonthlyBillRs] = useState<number>(3500);
  const [roofAreaSqM, setRoofAreaSqM] = useState<number>(85);
  const [tiltDeg, setTiltDeg] = useState<number>(20);
  const [obstacles, setObstacles] = useState<Array<{
    id: string;
    type: 'water_tank' | 'staircase' | 'parapet' | 'custom';
    x: number;
    y: number;
    width: number;
    height: number;
    shadowBuffer: number;
  }>>([
    { id: '1', type: 'water_tank', x: 20, y: 30, width: 2, height: 2, shadowBuffer: 1.5 },
    { id: '2', type: 'staircase', x: 50, y: 20, width: 3.5, height: 3, shadowBuffer: 2.0 }
  ]);
  const [result, setResult] = useState<RooftopCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const statesList = [
    { code: 'DL', name: 'Delhi (DERC - ₹6.5/kWh + ₹10,000/kW State Top-up)' },
    { code: 'MH', name: 'Maharashtra (MSEDCL - ₹8.2/kWh)' },
    { code: 'KA', name: 'Karnataka (BESCOM - ₹7.4/kWh)' },
    { code: 'TN', name: 'Tamil Nadu (TANGEDCO - ₹6.8/kWh)' },
    { code: 'GJ', name: 'Gujarat (UGVCL/DGVCL - ₹6.2/kWh)' },
    { code: 'RJ', name: 'Rajasthan (JVVNL - ₹7.1/kWh)' },
    { code: 'UP', name: 'Uttar Pradesh (UPPCL - ₹6.9/kWh + ₹15,000 State Top-up)' },
    { code: 'WB', name: 'West Bengal (WBSEDCL - ₹7.8/kWh)' }
  ];

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const input: RooftopCalculationInput = {
        address,
        lat: 28.7041,
        lng: 77.1025,
        stateCode,
        monthlyBillRs,
        roofAreaSqM,
        usableAreaSqM: roofAreaSqM * 0.85,
        obstacles,
        tiltDeg,
        panelWattageW: 550
      };
      const res = await calculateRooftop(input);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [stateCode, monthlyBillRs, roofAreaSqM, tiltDeg, obstacles]);

  const addObstacle = (type: 'water_tank' | 'staircase') => {
    const newObs = {
      id: Date.now().toString(),
      type,
      x: 30 + Math.random() * 20,
      y: 30 + Math.random() * 20,
      width: type === 'water_tank' ? 2 : 3.5,
      height: type === 'water_tank' ? 2 : 3,
      shadowBuffer: type === 'water_tank' ? 1.5 : 2.0
    };
    setObstacles([...obstacles, newObs]);
  };

  const removeObstacle = (id: string) => {
    setObstacles(obstacles.filter(o => o.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SuryaCheck Integration
            </span>
            <span className="text-xs text-slate-400">PM Surya Ghar: Muft Bijli Yojana Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Rooftop Solar & Subsidy Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Will solar actually fit on your roof? Place water tanks and mumty stairs, subtract shadow zones, auto-pack 550W panels, and calculate exact national + state subsidies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 block uppercase">Max Central Subsidy</span>
            <span className="text-lg font-bold text-yellow-400 font-mono">₹78,000 CFA</span>
          </div>
        </div>
      </div>

      {/* Main Form & Interactive Roof Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            1. Home & Roof Parameters
          </h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Address / Locality</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">State / DISCOM Tariff</label>
            <select
              value={stateCode}
              onChange={e => setStateCode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {statesList.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Monthly Electricity Bill</label>
              <div className="relative">
                <span className="text-slate-400 text-xs absolute left-3 top-2">₹</span>
                <input
                  type="number"
                  value={monthlyBillRs}
                  onChange={e => setMonthlyBillRs(Math.max(500, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Total Roof Area (m²)</label>
              <input
                type="number"
                value={roofAreaSqM}
                onChange={e => setRoofAreaSqM(Math.max(20, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">≈ {Math.round(roofAreaSqM * 10.76)} sq.ft</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Panel Tilt Angle</span>
              <span className="font-mono text-amber-400 font-bold">{tiltDeg}° South</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="5"
              value={tiltDeg}
              onChange={e => setTiltDeg(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>5° (Low flat)</span>
              <span>20° (Ideal Delhi/Mumbai)</span>
              <span>35° (High latitude)</span>
            </div>
          </div>

          {/* Roof Obstacle Controls */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Rooftop Obstacles & Shadows</label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => addObstacle('water_tank')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 border border-slate-700"
                >
                  <Plus className="w-3 h-3 text-amber-400" /> + Water Tank
                </button>
                <button
                  type="button"
                  onClick={() => addObstacle('staircase')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1 border border-slate-700"
                >
                  <Plus className="w-3 h-3 text-blue-400" /> + Mumty Room
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {obstacles.map((obs, idx) => (
                <div key={obs.id} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                  <span className="capitalize text-slate-300 font-medium">
                    {obs.type === 'water_tank' ? '🚰 Water Tank (2m x 2m)' : '🚪 Staircase Mumty (3.5m x 3m)'}
                  </span>
                  <span className="text-slate-500">+{obs.shadowBuffer}m shadow clearance</span>
                  <button
                    onClick={() => removeObstacle(obs.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Interactive Roof 2D Layout & Financials (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Roof Packing Canvas */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Real Roof Shadow & Panel Packing Simulation
                </h3>
                <p className="text-[11px] text-slate-400">
                  Visual representation of usable roof space after excluding obstacle shadow zones
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {result?.panelCount || 0} × 550W Panels Fitted
              </span>
            </div>

            {/* Schematic Roof Box */}
            <div className="relative w-full h-56 bg-slate-900/90 rounded-lg border-2 border-dashed border-slate-700 overflow-hidden flex flex-wrap content-start p-4 gap-1.5">
              {/* Obstacles placed */}
              {obstacles.map((obs, idx) => (
                <div
                  key={obs.id}
                  className={`absolute p-1 text-[10px] font-bold rounded flex items-center justify-center border ${
                    obs.type === 'water_tank' 
                      ? 'bg-blue-900/60 border-blue-500 text-blue-300' 
                      : 'bg-red-900/60 border-red-500 text-red-300'
                  }`}
                  style={{
                    left: `${obs.x}%`,
                    top: `${obs.y}%`,
                    width: `${obs.width * 14}px`,
                    height: `${obs.height * 14}px`
                  }}
                >
                  {obs.type === 'water_tank' ? 'Tank' : 'Mumty'}
                </div>
              ))}

              {/* Render packed solar panels */}
              {Array.from({ length: Math.min(24, result?.panelCount || 8) }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-8 rounded-sm bg-gradient-to-br from-blue-600 to-indigo-900 border border-blue-400/80 shadow-sm flex items-center justify-center text-[9px] text-blue-200 font-mono"
                  title="550W TopCon Monocrystalline Panel"
                >
                  550W
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-blue-600 inline-block border border-blue-400"></span> Solar Panel (550W)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-blue-900 border border-blue-500 inline-block"></span> Water Tank
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded bg-red-900 border border-red-500 inline-block"></span> Mumty Staircase
              </span>
            </div>
          </div>

          {/* Financial Breakdown & Subsidy Cards */}
          {result && (
            <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Recommended System Size</span>
                  <div className="text-2xl font-bold text-white">
                    {result.systemSizeKw} kW <span className="text-xs text-slate-400 font-normal">({result.panelCount} panels)</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Annual Generation</span>
                  <div className="text-2xl font-bold text-emerald-400">
                    {result.estimatedAnnualKwh.toLocaleString('en-IN')} kWh/yr
                  </div>
                </div>
              </div>

              {/* Subsidy & Cost Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">GROSS BENCHMARK COST</span>
                  <span className="text-base font-bold text-slate-300">₹{result.grossCostRs.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20">
                  <span className="text-emerald-400 block text-[10px]">TOTAL SUBSIDY (CFA + STATE)</span>
                  <span className="text-base font-bold text-emerald-400">-₹{result.totalSubsidyRs.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-amber-500/30 bg-amber-950/20">
                  <span className="text-amber-400 block text-[10px]">NET OUT-OF-POCKET COST</span>
                  <span className="text-base font-bold text-amber-300">₹{result.netCostRs.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">PAYBACK PERIOD</span>
                  <span className="text-base font-bold text-cyan-400">{result.paybackYears} Years</span>
                </div>
              </div>

              {/* PM Surya Ghar Concessional Loan Callout */}
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-0.5">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Concessional Green Loan Option (~7% interest p.a.)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pay only 10% upfront margin money. Estimated monthly EMI: <strong className="text-white">₹{result.loanEmiMonthlyRs}/mo</strong> vs monthly bill savings of <strong className="text-emerald-400">₹{Math.round(result.annualSavingsRs / 12)}/mo</strong>!
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold whitespace-nowrap">
                  Cash Flow Positive Month 1
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
