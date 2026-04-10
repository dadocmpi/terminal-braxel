import React from 'react';
import { Shield, Calculator } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { WorldClocks } from './WorldClocks';
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const { isLoading, currentSession } = useTrading();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[#0a0d12]/90 backdrop-blur-md px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter leading-none">BRAXEL MARKETS</h1>
            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] mt-0.5">Institutional Terminal v2.4</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-1 bg-secondary/20 rounded border border-border/50">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Session:</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{currentSession}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <WorldClocks />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-bull/10 rounded border border-bull/20">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull shadow-[0_0_5px_#22c55e]'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-bull">Live</span>
          </div>
          
          <Button variant="outline" size="sm" className="h-8 gap-2 border-border/50 text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all">
            <Calculator className="w-3.5 h-3.5" />
            Calculator
          </Button>
        </div>
      </div>
    </header>
  );
};