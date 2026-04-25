"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Check, Lock } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();

  if (!activeSignal) return (
    <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#EAB308]" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
          Scanning Institutional Footprints (FVG + Liquidity)...
        </span>
      </div>
      <div className="flex gap-6">
        {['PDH/PDL Sweep', 'FVG Confirmation', 'Killzone Active'].map((text) => (
          <div key={text} className="flex items-center gap-2 opacity-20">
            <Lock className="w-3 h-3" />
            <span className="text-[8px] font-black uppercase tracking-widest">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const isShort = activeSignal.direction === 'SELL';
  const colorClass = isShort ? 'text-bear' : 'text-bull';
  const bgClass = isShort ? 'bg-bear/10 border-bear/20' : 'bg-bull/10 border-bull/20';
  
  return (
    <div className={`bg-black border-b ${isShort ? 'border-b-bear' : 'border-b-bull'} overflow-hidden relative`}>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5">
        <div 
          className={`h-full transition-all duration-1000 ${isShort ? 'bg-bear' : 'bg-bull'}`} 
          style={{ width: `${activeSignal.confidence}%` }}
        />
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-4 p-6 border-r border-white/5 bg-[#050505]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bgClass} border`}>
                {isShort ? <ArrowDown className={`w-6 h-6 ${colorClass}`} /> : <ArrowUp className={`w-6 h-6 ${colorClass}`} />}
              </div>
              <div>
                <h2 className={`text-2xl font-black tracking-tighter uppercase ${colorClass}`}>
                  {activeSignal.direction} {activeSignal.asset}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">SMC Strategy</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[7px] h-4">INSTITUTIONAL A+</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              { label: 'Liquidity Swept (PDH/PDL)', checked: true },
              { label: 'FVG / Imbalance Found', checked: true },
              { label: 'MSS / CHoCH Confirmed', checked: true },
              { label: 'Killzone Time Aligned', checked: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-none border border-bull/50 flex items-center justify-center bg-bull/10">
                  <Check className="w-2 h-2 text-bull" />
                </div>
                <span className="text-[8px] font-bold text-white/70 uppercase tracking-tighter">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 grid grid-cols-4 divide-x divide-white/5">
          <PriceBlock label="ENTRY (FVG RETEST)" value={activeSignal.entry} color="text-primary" />
          <PriceBlock label="STOP LOSS" value={activeSignal.sl} color="text-bear" sub={`-${activeSignal.sl_pips.toFixed(1)} PIPS`} />
          <PriceBlock label="TAKE PROFIT 1" value={activeSignal.tp1} color="text-bull" sub={`+${activeSignal.tp1_pips.toFixed(1)} PIPS`} />
          <PriceBlock label="TAKE PROFIT 2" value={activeSignal.tp2} color="text-bull" sub={`+${activeSignal.tp2_pips.toFixed(1)} PIPS`} />
        </div>
      </div>
    </div>
  );
};

const PriceBlock = ({ label, value, color, sub }: { label: string, value: number, color: string, sub?: string }) => (
  <div className="p-6 flex flex-col justify-center hover:bg-white/[0.02] transition-colors group">
    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2 group-hover:text-white transition-colors">{label}</span>
    <div className="flex flex-col">
      <span className={`text-2xl font-mono font-black tracking-tighter ${color}`}>{value.toFixed(5)}</span>
      {sub && <span className="text-[9px] font-mono font-bold text-muted-foreground/50 mt-1">{sub}</span>}
    </div>
  </div>
);