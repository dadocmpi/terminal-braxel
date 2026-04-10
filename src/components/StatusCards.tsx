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
      <div className="col-span-4 p-8 border-r border-white/5 bg-primary/5">
        <span className="text-[10px] text-primary uppercase tracking-[0.3em] font-black">{currentSession} BIAS</span>
        <div className="mt-3">
          <h2 className={`text-5xl font-black tracking-tighter glow-text-gold ${d1Bias === 'BUY' ? 'text-bull' : 'text-bear'}`}>
            {d1Bias === 'BUY' ? 'BULLISH' : 'BEARISH'}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-2 font-mono uppercase tracking-widest">Order Flow Directional</p>
        </div>
      </div>

      {/* Session Premium/Discount Card */}
      <div className="col-span-4 p-8 border-r border-white/5">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black">P/D Matrix</span>
          <span className="text-2xl font-mono font-bold text-primary">{premiumPct.toFixed(1)}%</span>
        </div>
        <div className="relative h-10 flex items-center bg-white/5 border border-white/10">
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/3 border-r border-white/5 flex items-center justify-center">
              <span className="text-[7px] text-bull font-black uppercase opacity-30">Disc</span>
            </div>
            <div className="h-full w-1/3 border-r border-white/5 flex items-center justify-center">
              <span className="text-[7px] text-muted-foreground font-black uppercase opacity-30">Eq</span>
            </div>
            <div className="h-full w-1/3 flex items-center justify-center">
              <span className="text-[7px] text-bear font-black uppercase opacity-30">Prem</span>
            </div>
          </div>
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_15px_#EAB308] z-10 transition-all duration-700" 
            style={{ left: `${premiumPct}%` }} 
          />
        </div>
        <p className={`text-[9px] mt-4 text-center font-black tracking-widest uppercase ${zone.color}`}>
          {zone.label}
        </p>
      </div>

      {/* Session Performance */}
      <div className="col-span-4 p-8 flex items-center gap-10">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/5" strokeWidth="2" />
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="2" strokeDasharray="72, 100" strokeLinecap="square" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-white">72%</span>
            <span className="text-[7px] text-primary uppercase font-black tracking-tighter">Win Rate</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Session P&L</p>
            <p className="text-3xl font-mono font-black text-bull">+85.4 <span className="text-xs opacity-50">pips</span></p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bull" />
              <span className="text-[10px] font-black">12 WINS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-bear" />
              <span className="text-[10px] font-black">4 LOSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};