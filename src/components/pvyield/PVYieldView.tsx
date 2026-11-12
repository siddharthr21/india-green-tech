import React from 'react';
import PVYieldApp from './PVYieldApp';

export const PVYieldView: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl p-2 sm:p-6 text-slate-100">
      <PVYieldApp />
    </div>
  );
};

export default PVYieldView;
