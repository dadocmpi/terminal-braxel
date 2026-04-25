import React from 'react';
import { useTrading } from '../contexts/TradingContext';

export const StatusCards = () => {
  const { d1Bias, premiumPct } = useTrading();
  
  return (
    <div className="grid grid-cols-12 gap-0 border-b border-white/5">
      <div className="col-span-12 lg:col-span-6 p-4 border-r border-white/5 bg-[#050401]">
        <span className="text-[10px] text-primary/70 uppercase tracking-[0.3em] font-black">SESSION BIAS</span>
        <div className="mt-1 flex items-center justify-between">
          <h2 className={`text-2xl font-black tracking-tighter uppercase ${
            d1Bias === 'BUY' ? 'text-bull glow-text-bull' : 
            d1Bias === 'SELL' ? 'text-bear glow-text-bear' : 
            'text-white/20'
          }`}>
            {d1Bias === 'BUY' ? 'BULLISH' : d1Bias === 'SELL' ? 'BEARISH' : 'SCANNING'}
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-6 p-4 bg-black">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-white/70 uppercase tracking-[0.3em] font-black">P/D MATRIX</span>
          <span className="text-lg font-mono font-black text-primary/90">{premiumPct.toFixed(1)}%</span>
        </div>
        
        <div className="relative h-4 flex items-center bg-[#080808] border border-white/5">
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/3 border-r border-white/5" />
            <div className="h-full w-1/3 border-r border-white/5" />
            <div className="h-full w-1/3" />
          </div>
          
          <div 
            className="absolute top-0 bottom-0 w-0.5 z-10 transition-all duration-1000 ease-in-out bg-primary shadow-[0_0_10px_#EAB308]" 
            style={{ left: `${premiumPct}%`, transform: 'translateX(-50%)' }} 
          />
        </div>
      </div>
    </div>
  );
};