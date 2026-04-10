import React from 'react';
import { useTrading } from '../contexts/TradingContext';

export const StatusCards = () => {
  const { d1Bias, premiumPct, currentSession } = useTrading();
  
  const getZoneStatus = (pct: number) => {
    if (pct < 40) return { label: "INSTITUTIONAL DISCOUNT", color: "text-bull" };
    if (pct > 60) return { label: "INSTITUTIONAL PREMIUM", color: "text-bear" };
    return { label: "EQUILIBRIUM ZONE", color: "text-primary" };
  };

  const zone = getZoneStatus(premiumPct);

  return (
    <div className="grid grid-cols-12 gap-0 border-b border-white/5">
      {/* Session Bias Card */}
      <div className="col-span-6 p-10 border-r border-white/5 bg-[#050401]">
        <span className="text-[11px] text-primary uppercase tracking-[0.3em] font-black">{currentSession} BIAS</span>
        <div className="mt-6">
          <h2 className={`text-7xl font-black tracking-tighter uppercase ${d1Bias === 'BUY' ? 'text-bull glow-text-bull' : 'text-bear glow-text-bear'}`}>
            {d1Bias === 'BUY' ? 'BULLISH' : 'BEARISH'}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-4 font-mono uppercase tracking-widest opacity-60">Order Flow Directional</p>
        </div>
      </div>

      {/* Session Premium/Discount Card */}
      <div className="col-span-6 p-10 bg-black">
        <div className="flex justify-between items-end mb-8">
          <span className="text-[11px] text-white uppercase tracking-[0.3em] font-black">P/D MATRIX</span>
          <span className="text-5xl font-mono font-black text-primary">{premiumPct.toFixed(1)}%</span>
        </div>
        
        <div className="relative h-14 flex items-center bg-[#080808] border border-white/10">
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/3 border-r border-white/5 flex items-center justify-center">
              <span className="text-[8px] text-bull font-black uppercase opacity-40">DISC</span>
            </div>
            <div className="h-full w-1/3 border-r border-white/5 flex items-center justify-center">
              <span className="text-[8px] text-muted-foreground font-black uppercase opacity-40">EQ</span>
            </div>
            <div className="h-full w-1/3 flex items-center justify-center">
              <span className="text-[8px] text-bear font-black uppercase opacity-40">PREM</span>
            </div>
          </div>
          
          {/* Indicator Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-primary shadow-[0_0_20px_#EAB308] z-10 transition-all duration-1000 ease-in-out" 
            style={{ left: `${premiumPct}%`, transform: 'translateX(-50%)' }} 
          />
        </div>
        
        <p className={`text-[10px] mt-6 text-center font-black tracking-[0.2em] uppercase ${zone.color}`}>
          {zone.label}
        </p>
      </div>
    </div>
  );
};