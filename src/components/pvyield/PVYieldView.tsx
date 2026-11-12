import React from 'react';
import PVYieldApp from './PVYieldApp';

export const PVYieldView: React.FC = () => {
  return (
    <div className="pvyield-container w-full min-h-screen bg-slate-100 text-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 p-4 sm:p-8">
      <PVYieldApp />
    </div>
  );
};

export default PVYieldView;
