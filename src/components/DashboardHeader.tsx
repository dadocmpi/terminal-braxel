import React from 'react';
import { Calculator } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { WorldClocks } from './WorldClocks';
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const { isLoading, currentSession } = useTrading();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          {/* Logo Oficial Braxel Markets */}
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <img 
              src="dyad-media://media/cozy-beaver-jump/.dyad/media/58060039f5db88e06eea8c30bfc87c68.png" 
              alt="Braxel Markets Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback caso a imagem falhe novamente
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none text-white italic">BRAXEL</h1>
            <p className="text-[8px] font-bold text-primary tracking-[0.4em] mt-1 uppercase">Institutional</p>
          </div>
        </div>

        <div className="flex items-center bg-[#0a0a0a] border border-white/10 px-4 py-2 rounded-none">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2">SESSION:</span>
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