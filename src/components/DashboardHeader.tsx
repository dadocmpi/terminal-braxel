import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';

export const DashboardHeader = () => {
  const { isLoading, currentSession } = useTrading();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Logo />
        <div className="h-6 w-px bg-white/10" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
          SESSÃO: {currentSession}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull shadow-[0_0_8px_#22c55e]'}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">LIVE</span>
        </div>
        
        <RiskCalculator />
      </div>
    </header>
  );
};