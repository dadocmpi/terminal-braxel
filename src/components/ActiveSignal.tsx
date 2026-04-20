"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();

  if (!activeSignal) return (
    <div className="px-6 py-2 border-b border-white/5 bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#EAB308]" />
        <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em]">
          Neural Engine: Scanning Institutional Liquidity...
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => <div key={i} className="w-1 h-1 bg-white/5 rounded-full" />)}
      </div>
    </div>
  );

  const isShort = activeSignal.direction === 'SELL';

  return (
    <div className={`bg-black border-b ${isShort ? 'border-b-bear' : 'border-b-bull'} overflow-hidden`}>
      <div className="grid grid-cols-12 divide-x divide-white/5">
        <div className="col-span-3 p-2 bg-[#050505] flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isShort ? <ArrowDown className="w-3 h-3 text-bear" /> : <ArrowUp className="w-3 h-3 text-bull" />}
            <span className={`text-base font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {activeSignal.direction} {activeSignal.asset}
            </span>
          </div>
          <Badge className="bg-primary text-black font-black rounded-none px-1 py-0 text-[7px] tracking-widest h-3">
            ELITE
          </Badge>
        </div>

        <div className="col-span-6 grid grid-cols-3 divide-x divide-white/5">
          <PriceMiniBlock label="ENTRY" value={activeSignal.entry} color="text-primary" />
          <PriceMiniBlock label="STOP" value={activeSignal.sl} color="text-bear" sub={`-${activeSignal.sl_pips.toFixed(1)}`} />
          <PriceMiniBlock label="TARGET" value={activeSignal.tp1} color="text-bull" sub={`+${activeSignal.tp1_pips.toFixed(1)}`} />
        </div>

        <div className="col-span-3 p-2 flex items-center justify-around bg-primary/[0.02]">
          <div className="flex flex-col">
            <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest">Lot</span>
            <span className="text-[10px] font-mono font-black text-white">{activeSignal.lot_size}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest">Conf</span>
            <span className="text-[10px] font-mono font-black text-bull">{activeSignal.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceMiniBlock = ({ label, value, color, sub }: { label: string, value: number, color: string, sub?: string }) => (
  <div className="p-1.5 flex flex-col justify-center">
    <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest mb-0">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-xs font-mono font-black ${color}`}>{value.toFixed(5)}</span>
      {sub && <span className="text-[7px] text-muted-foreground font-mono opacity-50">{sub}</span>}
    </div>
  </div>
);