import React from 'react';
import { Calculator } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { WorldClocks } from './WorldClocks';
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const { isLoading, currentSession } = useTrading();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/90 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 flex items-center justify-center">
            <img 
              src="dyad-media://media/cozy-beaver-jump/.dyad/media/b2eee0c01707592ac5eed94cf5b9ed19.png" 
              alt="Braxel Logo" 
              className="w-full h-full object-contain brightness-125"
            />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tighter leading-none text-white">BRAXEL MARKETS</h1>
            <p className="text-[9px] text-primary uppercase tracking-[0.4em] mt-1 font-bold">Institutional Algorithm</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-sm border border-white/10">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Session:</span>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{currentSession}</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <WorldClocks />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-bull/10 rounded-sm border border-bull/20">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull shadow-[0_0_8px_#22c55e]'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-bull">Live Feed</span>
          </div>
          
          <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-black transition-all rounded-none">
            <Calculator className="w-3.5 h-3.5" />
            Risk Calc
          </Button>
        </div>
      </div>
    </header>
  );
};