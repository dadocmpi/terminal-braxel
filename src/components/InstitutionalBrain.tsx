import React from 'react';
import { Brain, Database, Cpu, Network } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';

export const InstitutionalBrain = () => {
  const { isMarketOpen, signalsData } = useTrading();
  const signalCount = signalsData.signals.length;

  return (
    <div className="bg-black border border-white/10 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Network className="w-20 h-20 text-primary" />
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-none border ${isMarketOpen ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-white/5'}`}>
          <Brain className={`w-6 h-6 ${isMarketOpen ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Neural Engine</h3>
          <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">
            {isMarketOpen ? 'Processing Live Flow' : 'Memory Retention Mode'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/[0.02] border border-white/5">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block mb-2">Stored Signals</span>
          <span className="text-2xl font-mono font-black text-primary">{signalCount}</span>
        </div>
        <div className="p-4 bg-white/[0.02] border border-white/5">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block mb-2">Data Integrity</span>
          <span className="text-2xl font-mono font-black text-bull">99.9%</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Synaptic Load</span>
          <span className="text-[8px] font-mono text-primary">{isMarketOpen ? '42%' : '2%'}</span>
        </div>
        <div className="h-1 bg-white/5 w-full">
          <div 
            className="h-full bg-primary transition-all duration-1000" 
            style={{ width: isMarketOpen ? '42%' : '2%' }} 
          />
        </div>
      </div>
    </div>
  );
};