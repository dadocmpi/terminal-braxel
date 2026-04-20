"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowDown, ArrowUp, Zap, AlertTriangle, DollarSign } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();

  if (!activeSignal) return (
    <div className="px-6 py-3 border-t border-white/5 bg-black/40 flex items-center justify-between">
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
    <div className={`bg-black border-t-2 ${isShort ? 'border-t-bear' : 'border-t-bull'} overflow-hidden`}>
      <div className="grid grid-cols-12 divide-x divide-white/5">
        <div className="col-span-3 p-4 bg-[#050505]">
          <div className="flex items-center gap-2 mb-1">
            {isShort ? <ArrowDown className="w-4 h-4 text-bear" /> : <ArrowUp className="w-4 h-4 text-bull" />}
            <span className={`text-lg font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {activeSignal.direction} {activeSignal.asset}
            </span>
          </div>
          <Badge className="bg-primary text-black font-black rounded-none px-1.5 py-0 text-[8px] tracking-widest h-4">
            ELITE SETUP
          </Badge>
        </div>

        <div className="col-span-6 grid grid-cols-3 divide-x divide-white/5">
          <PriceMiniBlock label="ENTRY" value={activeSignal.entry} color="text-primary" />
          <PriceMiniBlock label="STOP" value={activeSignal.sl} color="text-bear" sub={`-${activeSignal.sl_pips.toFixed(1)}`} />
          <PriceMiniBlock label="TARGET" value={activeSignal.tp1} color="text-bull" sub={`+${activeSignal.tp1_pips.toFixed(1)}`} />
        </div>

        <div className="col-span-3 p-4 flex flex-col justify-center bg-primary/[0.02]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Lot Size</span>
            <span className="text-xs font-mono font-black text-white">{activeSignal.lot_size}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Confidence</span>
            <span className="text-xs font-mono font-black text-bull">{activeSignal.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceMiniBlock = ({ label, value, color, sub }: { label: string, value: number, color: string, sub?: string }) => (
  <div className="p-3 flex flex-col justify-center">
    <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-sm font-mono font-black ${color}`}>{value.toFixed(5)}</span>
      {sub && <span className="text-[8px] text-muted-foreground font-mono opacity-50">{sub}</span>}
    </div>
  </div>
);