import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { AlertTriangle, CheckCircle2, Timer } from 'lucide-react';

export const StatusCards = () => {
  const { d1Bias, premiumPct, currentSession } = useTrading();
  
  const getMarketCondition = () => {
    const isPremium = premiumPct > 60;
    const isDiscount = premiumPct < 40;
    const isEquilibrium = !isPremium && !isDiscount;

    if (d1Bias === 'BUY') {
      if (isDiscount) return { label: "OPTIMAL BUY ZONE", sub: "INSTITUTIONAL DISCOUNT", color: "text-bull", icon: <CheckCircle2 className="w-4 h-4" /> };
      if (isPremium) return { label: "OVEREXTENDED - WAIT", sub: "PREMIUM LIQUIDITY AREA", color: "text-yellow-500", icon: <AlertTriangle className="w-4 h-4" /> };
      return { label: "EQUILIBRIUM", sub: "FAIR VALUE AREA", color: "text-primary", icon: <Timer className="w-4 h-4" /> };
    } else {
      if (isPremium) return { label: "OPTIMAL SELL ZONE", sub: "INSTITUTIONAL PREMIUM", color: "text-bear", icon: <CheckCircle2 className="w-4 h-4" /> };
      if (isDiscount) return { label: "OVEREXTENDED - WAIT", sub: "DISCOUNT LIQUIDITY AREA", color: "text-yellow-500", icon: <AlertTriangle className="w-4 h-4" /> };
      return { label: "EQUILIBRIUM", sub: "FAIR VALUE AREA", color: "text-primary", icon: <Timer className="w-4 h-4" /> };
    }
  };

  const condition = getMarketCondition();

  return (
    <div className="grid grid-cols-12 gap-0 border-b border-white/5">
      {/* Session Bias Card */}
      <div className="col-span-12 lg:col-span-6 p-10 border-r border-white/5 bg-[#050401]">
        <span className="text-[11px] text-primary uppercase tracking-[0.3em] font-black">{currentSession} BIAS</span>
        <div className="mt-6">
          <h2 className={`text-7xl font-black tracking-tighter uppercase ${d1Bias === 'BUY' ? 'text-bull glow-text-bull' : 'text-bear glow-text-bear'}`}>
            {d1Bias === 'BUY' ? 'BULLISH' : 'BEARISH'}
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <div className={`w-2 h-2 rounded-full animate-pulse ${d1Bias === 'BUY' ? 'bg-bull' : 'bg-bear'}`} />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">Order Flow Directional</p>
          </div>
        </div>
      </div>

      {/* Session Premium/Discount Card */}
      <div className="col-span-12 lg:col-span-6 p-10 bg-black">
        <div className="flex justify-between items-end mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-white uppercase tracking-[0.3em] font-black">P/D MATRIX</span>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${condition.color}`}>
              {condition.icon}
              {condition.label}
            </div>
          </div>
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
        
        <p className={`text-[10px] mt-6 text-center font-black tracking-[0.2em] uppercase opacity-60`}>
          {condition.sub}
        </p>
      </div>
    </div>
  );
};