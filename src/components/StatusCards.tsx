import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";

export const StatusCards = () => {
  const { d1Bias, premiumPct, signalsData } = useTrading();
  const signal = signalsData.active_signal;

  return (
    <div className="grid grid-cols-12 gap-0 border-b border-border/50">
      {/* Main Bias Card */}
      <div className="col-span-4 p-6 border-r border-border/50 bg-bull/5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">D1 Bias</span>
        <div className="mt-2">
          <h2 className={`text-4xl font-black tracking-tighter glow-text-bull ${d1Bias === 'BUY' ? 'text-bull' : 'text-bear'}`}>
            {d1Bias === 'BUY' ? 'COMPRA' : 'VENDA'}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">EMA 100 + STRUCTURE FILTER</p>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] font-bold">
            <span className="text-muted-foreground">CONFIDENCE</span>
            <span className="text-bull">78.4%</span>
          </div>
          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-bull" style={{ width: '78.4%' }} />
          </div>
        </div>
      </div>

      {/* Premium/Discount Card */}
      <div className="col-span-4 p-6 border-r border-border/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Premium / Discount</span>
          <span className="text-xl font-mono font-bold text-primary">{premiumPct.toFixed(1)}%</span>
        </div>
        <div className="relative h-12 flex items-center">
          <div className="absolute inset-0 flex">
            <div className="h-full w-1/3 bg-bear/10 border-r border-border/30 flex items-center justify-center">
              <span className="text-[8px] text-bear font-bold uppercase opacity-50">Premium</span>
            </div>
            <div className="h-full w-1/3 bg-secondary/20 border-r border-border/30 flex items-center justify-center">
              <span className="text-[8px] text-muted-foreground font-bold uppercase opacity-50">Equilibrium</span>
            </div>
            <div className="h-full w-1/3 bg-bull/10 flex items-center justify-center">
              <span className="text-[8px] text-bull font-bold uppercase opacity-50">Discount</span>
            </div>
          </div>
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10 transition-all duration-500" 
            style={{ left: `${premiumPct}%` }} 
          />
        </div>
        <p className="text-[9px] text-muted-foreground mt-3 text-center font-mono">PRICE IS IN DISCOUNT ZONE</p>
      </div>

      {/* Performance Summary */}
      <div className="col-span-4 p-6 flex items-center gap-8">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="3" />
            <circle cx="18" cy="18" r="16" fill="none" className="stroke-bull" strokeWidth="3" strokeDasharray="72, 100" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black">72%</span>
            <span className="text-[7px] text-muted-foreground uppercase font-bold">Win Rate</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Weekly P&L</p>
            <p className="text-2xl font-mono font-black text-bull">+85.4 <span className="text-xs">pips</span></p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bull" />
              <span className="text-[10px] font-bold">12W</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bear" />
              <span className="text-[10px] font-bold">4L</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="text-[10px] font-bold">2B</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};