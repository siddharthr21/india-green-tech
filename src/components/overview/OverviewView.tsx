import React from 'react';
import { 
  Activity, 
  Sliders, 
  Building2, 
  Sun, 
  Compass, 
  Bot, 
  ArrowRight, 
  TrendingUp, 
  Leaf, 
  Award, 
  Cpu, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { NavTab } from '../common/Header';
import { NationalGridSummary } from '../../../shared/types';

interface OverviewViewProps {
  setActiveTab: (tab: NavTab) => void;
  gridSummary: NationalGridSummary | null;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab, gridSummary }) => {
  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/20 p-8 lg:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>Unified Indian Energy Transition Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            India's Clean Energy & Grid Intelligence Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            One unified project bringing together live national grid telemetry for 32 Indian states, regional renewable forecasting, smart city investment simulations, residential rooftop solar with PM Surya Ghar subsidies, and multi-string PV engineering.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('grid')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <span>Explore Live National Grid</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('rooftop')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all text-sm"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Rooftop Solar & Subsidy</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold px-5 py-3 rounded-xl border border-slate-700 transition-all text-sm"
            >
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Regional Planner</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-level KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>All-India Demand Met</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {gridSummary ? `${(gridSummary.demandMetMw / 1000).toFixed(1)} GW` : '224.8 GW'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Peak summer resilience</span>
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Clean Energy Share</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {gridSummary?.renewableSharePct || 31.4}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Solar + Wind + Hydro + Nuclear</p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Avg Grid Carbon Intensity</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {gridSummary?.carbonIntensityGco2 || 684} <span className="text-xs text-slate-400 font-normal">gCO2/kWh</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Down 14% vs 2020 baseline</p>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>PM Surya Ghar Subsidy</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            Up to ₹78,000
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Central CFA for 3 kW rooftop</p>
        </div>
      </div>

      {/* Integrated Modules Cards */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>Integrated Core Applications</span>
          <span className="text-xs font-normal text-slate-400">· 5 modules seamlessly linked</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: National Grid Telemetry */}
          <div 
            onClick={() => setActiveTab('grid')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">National Grid Telemetry</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">National Grid Telemetry</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                State-wise live electricity demand, generation mix (coal, solar, wind, hydro, nuclear), carbon intensity for all 32 states/UTs with freshness ladder.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live SLDC SCADA feeds</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 24h & 48h historical charts</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>View National Grid</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: Regional Energy Planner Planner */}
          <div 
            onClick={() => setActiveTab('planner')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">Regional Renewable Planner</h3>
                <span className="text-[10px] bg-teal-950 text-teal-400 border border-teal-800 px-2 py-0.5 rounded font-mono">Regional Energy Planner</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Forecast solar, wind, and hydro for Indian regions (Jodhpur, Bangalore, Chennai, Kutch, Uttarakashi, Satara). Trade cost against emissions with Pareto optimization.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> 5 forecasting methods (24h/90d/1y)</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Interactive Cost vs Emissions slider</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Run Regional Optimizer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Rooftop Solar Planner Rooftop */}
          <div 
            onClick={() => setActiveTab('rooftop')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">Rooftop Solar & Subsidy</h3>
                <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">Rooftop Solar Planner</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Calculate how many panels fit on real flat Indian roofs with water tanks and staircase mumties. Exact PM Surya Ghar subsidies and 25-year ROI.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Obstacle shadow modeling</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> State DISCOM tariffs & loan EMI</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Calculate My Roof</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: PV Yield Studio */}
          <div 
            onClick={() => setActiveTab('pv-yield')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">Precision PV Yield Studio</h3>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">PV Array Yield Studio</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Multi-string array engineering (East, North, South strings), true-north azimuth compass, PVGIS hourly solar modeling, and self-consumption economics.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Multi-array compass orientation</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Monthly solar irradiance & losses</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Design Solar Arrays</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 5: Smart City Sim */}
          <div 
            onClick={() => setActiveTab('smart-city')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">Smart City Simulator</h3>
                <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-mono">Regional Energy Planner Sim</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Municipal energy budget allocation across Solar, Wind, Hydro, and Storage. Test city resilience against simulated heatwaves, monsoons, and grid events.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Capital allocation & public satisfaction</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Climate stress test events</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 6: AI Mentor */}
          <div 
            onClick={() => setActiveTab('mentor')}
            className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white mb-1">AI Energy Mentor</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">Clean Energy Advisor</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Specialized clean energy advisory assistant trained on Indian grid codes, CERC merit order dispatch, DISCOM tariffs, and PM Surya Ghar subsidies.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Tariff & subsidy eligibility help</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Grid dispatch & sizing Q&A</div>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Chat with Mentor</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
