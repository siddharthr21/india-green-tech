import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Zap, 
  Leaf, 
  Flame, 
  Wind, 
  Sun, 
  Droplets, 
  Atom, 
  Info,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { fetchLiveGrid, fetchStateHistory } from '../../lib/api';
import { NationalGridSummary, StateGridData } from '../../../shared/types';

export const NationalGridView: React.FC = () => {
  const [data, setData] = useState<{ summary: NationalGridSummary; states: StateGridData[] } | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('IN-DL');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMeasuredOnly, setFilterMeasuredOnly] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const grid = await fetchLiveGrid();
      setData(grid);
      const hist = await fetchStateHistory(selectedZone, 24);
      setHistory(hist);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleZoneSelect = async (zone: string) => {
    setSelectedZone(zone);
    try {
      const hist = await fetchStateHistory(zone, 24);
      setHistory(hist);
    } catch (e) {
      console.error(e);
    }
  };

  const selectedState = data?.states.find(s => s.zone === selectedZone) || data?.states[0];

  const filteredStates = (data?.states || []).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMeasured = filterMeasuredOnly ? !s.ciEstimated : true;
    return matchesSearch && matchesMeasured;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              National Grid Telemetry Integration
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>30-second live refresh</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Indian National Grid & State Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time demand met, generation mix (Thermal, Solar, Wind, Hydro, Nuclear), and carbon intensity across all 32 Indian States and Union Territories.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-medium transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Freshness Ladder Notice */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-300">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>
            <strong>Credibility & Freshness Ladder:</strong> Four states (<strong className="text-white">Punjab, Delhi, Karnataka, Chhattisgarh</strong>) publish real-time per-fuel generation via SLDC SCADA and are tagged as <span className="text-emerald-400 font-semibold underline">measured</span>. Other states are calculated using official MERIT dispatch & NPP models.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block"></span> SCADA Measured
          <span className="h-2 w-2 rounded-full bg-amber-400 inline-block ml-2"></span> MERIT Estimated
        </div>
      </div>

      {/* Main Grid Layout: Left State List, Right Selected State Details & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: State Selection List */}
        <div className="lg:col-span-5 glass-panel p-4 rounded-xl border border-slate-800 flex flex-col h-[700px]">
          <div className="space-y-3 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search state (e.g. Maharashtra, Delhi, Tamil Nadu)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterMeasuredOnly}
                  onChange={e => setFilterMeasuredOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                />
                <span>Only show SCADA measured</span>
              </label>
              <span>{filteredStates.length} states</span>
            </div>
          </div>

          <div className="overflow-y-auto space-y-2 flex-grow pr-1">
            {filteredStates.map((state) => {
              const isSelected = state.zone === selectedZone;
              const isMeasured = !state.ciEstimated;
              return (
                <div
                  key={state.zone}
                  onClick={() => handleZoneSelect(state.zone)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{state.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({state.zone})</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      isMeasured ? 'badge-measured' : 'badge-estimated'
                    }`}>
                      {isMeasured ? 'measured' : 'estimated'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Demand Met</span>
                      <span className="font-bold text-white">{(state.demandMetMw).toLocaleString('en-IN')} MW</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Carbon Intensity</span>
                      <span className="font-medium text-amber-400">{state.carbonIntensity} gCO2/kWh</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Data Age</span>
                      <span className="text-slate-400">{state.dataAgeMin}m ago</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected State Telemetry & Fuel Mix */}
        <div className="lg:col-span-7 space-y-6">
          {selectedState && (
            <>
              {/* State Header Card */}
              <div className="glass-panel p-6 rounded-xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{selectedState.name}</h2>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono ${
                        !selectedState.ciEstimated ? 'badge-measured' : 'badge-estimated'
                      }`}>
                        {!selectedState.ciEstimated ? 'SCADA Measured' : `Estimated · ${selectedState.ciBasis}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Zone Code: {selectedState.zone} · Market Price: ₹{selectedState.exchangePriceRsKwh}/kWh</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Generation</span>
                    <div className="text-2xl font-bold text-emerald-400">
                      {selectedState.generationTotalMw.toLocaleString('en-IN')} MW
                    </div>
                  </div>
                </div>

                {/* Key State Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">DEMAND MET</span>
                    <span className="text-lg font-bold text-white">{selectedState.demandMetMw.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 ml-1">MW</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">CARBON INTENSITY</span>
                    <span className="text-lg font-bold text-amber-400">{selectedState.carbonIntensity}</span>
                    <span className="text-[10px] text-slate-500 ml-1">gCO2/kWh</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">NET IMPORT / (EXPORT)</span>
                    <span className={`text-lg font-bold ${selectedState.netImportMw >= 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                      {selectedState.netImportMw >= 0 ? `+${selectedState.netImportMw}` : selectedState.netImportMw}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">MW</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">RENEWABLE TOTAL</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {(selectedState.fuels.solar + selectedState.fuels.wind + selectedState.fuels.hydro).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1">MW</span>
                  </div>
                </div>

                {/* Fuel Mix Breakdown Bars */}
                <div className="mt-6">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Live Generation Fuel Mix</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-500"><Flame className="w-4 h-4" /></div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Thermal / Coal</span>
                        <span className="font-bold text-white">{selectedState.fuels.coal} MW</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
                      <div className="p-2 rounded bg-yellow-500/10 text-yellow-400"><Sun className="w-4 h-4" /></div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Solar PV</span>
                        <span className="font-bold text-yellow-400">{selectedState.fuels.solar} MW</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
                      <div className="p-2 rounded bg-cyan-500/10 text-cyan-400"><Wind className="w-4 h-4" /></div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Wind Power</span>
                        <span className="font-bold text-cyan-400">{selectedState.fuels.wind} MW</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
                      <div className="p-2 rounded bg-blue-500/10 text-blue-400"><Droplets className="w-4 h-4" /></div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Hydro Dispatch</span>
                        <span className="font-bold text-blue-400">{selectedState.fuels.hydro} MW</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 24-Hour Timeseries Chart */}
              <div className="glass-panel p-6 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">24-Hour Dispatch & Demand Profile</h3>
                    <p className="text-xs text-slate-400">Hourly generation stack vs state demand</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                    Live Dispatch Curve
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="solarColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="windColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="hydroColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="thermalColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64748b" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="thermalMw" stackId="1" stroke="#64748b" fill="url(#thermalColor)" name="Thermal" />
                      <Area type="monotone" dataKey="hydroMw" stackId="1" stroke="#3b82f6" fill="url(#hydroColor)" name="Hydro" />
                      <Area type="monotone" dataKey="windMw" stackId="1" stroke="#06b6d4" fill="url(#windColor)" name="Wind" />
                      <Area type="monotone" dataKey="solarMw" stackId="1" stroke="#eab308" fill="url(#solarColor)" name="Solar" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
