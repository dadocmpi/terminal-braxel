import React from 'react';
import { Calculator } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { Button } from "@/components/ui/button";
import Logo from './Logo';

export const DashboardHeader = () => {
  const { isLoading, currentSession } = useTrading();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Logo />
        <div className="h-6 w-px bg-white/10" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{currentSession}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull shadow-[0_0_8px_#22c55e]'}`} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">LIVE</span>
        </div>
        
        <Button variant="outline" size="sm" className="h-8 border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all rounded-none">
          <Calculator className="w-3 h-3 mr-2" />
          RISK
        </Button>
      </div>
    </header>
  );
};