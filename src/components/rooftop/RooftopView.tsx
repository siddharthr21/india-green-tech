import React from 'react';
import RooftopApp from './App';

export const RooftopView: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-sand text-ink rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <RooftopApp />
    </div>
  );
};

export default RooftopView;
