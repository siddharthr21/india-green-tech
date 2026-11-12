import React from 'react';
import { Zap, Github, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 text-xs text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-slate-200 text-sm">INDIA GREEN TECH</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            A comprehensive, unified clean energy intelligence platform combining live national grid telemetry, regional renewable forecasting, smart city optimization, residential rooftop solar planning, and precision PV yield engineering.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-sm">Integrated Applications</h4>
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-slate-300">National Grid Telemetry</span>
              <p className="text-[11px] text-slate-500">Live 32-state demand & fuel mix telemetry</p>
            </li>
            <li>
              <span className="font-medium text-slate-300">Regional Energy Planner Platform</span>
              <p className="text-[11px] text-slate-500">Regional forecasting & Smart City simulator</p>
            </li>
            <li>
              <span className="font-medium text-slate-300">Rooftop Solar Planner</span>
              <p className="text-[11px] text-slate-500">Rooftop solar, shadow modeling & PM Surya Ghar subsidy</p>
            </li>
            <li>
              <span className="font-medium text-slate-300">PV Array Yield Studio</span>
              <p className="text-[11px] text-slate-500">Multi-string azimuth & PVGIS engineering</p>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-sm">Data & Standards</h4>
          <ul className="space-y-2 text-slate-400">
            <li>• Ministry of Power (MoP) / POSOCO / Grid-India</li>
            <li>• Central Electricity Authority (CEA) Reports</li>
            <li>• State Load Despatch Centres (SLDC SCADA)</li>
            <li>• PM Surya Ghar: Muft Bijli Yojana (MNRE)</li>
            <li>• European Commission PVGIS Irradiance</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-sm">Repository & Open Source</h4>
          <p className="text-slate-400 mb-3">
            Open-source Indian energy transition tooling for planners, researchers, engineers, and citizens.
          </p>
          <a
            href="https://github.com/siddharthr21/india-green-tech"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Github className="w-4 h-4 text-emerald-400" />
            <span>siddharthr21/india-green-tech</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
        <p>© 2026 India Green Tech. Released under the MIT License.</p>
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Supporting India's 500 GW Non-Fossil Fuel 2030 Target</span>
        </div>
      </div>
    </footer>
  );
};
