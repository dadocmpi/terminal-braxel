"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, ShieldCheck, Zap, Target } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();

  if (!activeSignal) return (
    <div className="px-6 py-3 border-b border-white/5 bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#EAB308]" />
        <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em]">
          Neural Engine: Monitoring Institutional Flow (Strict Mode Active)
        </span>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5 opacity-30">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase">Liquidity</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-30">
          <Zap className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase">MSS/CHoCH</span>
        </div>
      </div>
    </div>
  );

  const isShort = activeSignal.direction === 'SELL';

  return (
    <div className={`bg-black border-b ${isShort ? 'border-b-bear' : 'border-b-bull'} overflow-hidden`}>
      <div className="grid grid-cols-12 divide-x divide-white/5">
        <div className="col-span-12 lg:col-span-3 p-4 bg-[#050505] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-bull text-black font-black rounded-none px-1 py-0 text-[7px] tracking-widest h-3">
              CONFIRMED
            </Badge>
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Institutional Entry</span>
          </div>
          <div className="flex items-center gap-2">
            {isShort ? <ArrowDown className="w-4 h-4 text-bear" /> : <ArrowUp className="w-4 h-4 text-bull" />}
            <span className={`text-xl font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {activeSignal.direction} {activeSignal.asset}
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 grid grid-cols-3 divide-x divide-white/5">
          <PriceMiniBlock label="ENTRY" value={activeSignal.entry} color="text-primary" />
          <PriceMiniBlock label="STOP LOSS" value={activeSignal.sl} color="text-bear" sub={`-${activeSignal.sl_pips.toFixed(1)} pips`} />
          <PriceMiniBlock label="TAKE PROFIT" value={activeSignal.tp1} color="text-bull" sub={`+${activeSignal.tp1_pips.toFixed(1)} pips`} />
        </div>

        <div className="col-span-12 lg:col-span-3 p-4 flex items-center justify-around bg-primary/[0.02]">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-bull mb-1" />
            <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest">Liquidity</span>
            <span className="text-[9px] font-mono font-black text-white">SWEPT</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-4 h-4 text-bull mb-1" />
            <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest">Structure</span>
            <span className="text-[9px] font-mono font-black text-white">SHIFTED</span>
          </div>
          <div className="flex flex-col items-center">
            <Target className="w-4 h-4 text-primary mb-1" />
            <span className="text-[7px] text-muted-foreground font-black uppercase tracking-widest">Confidence</span>
            <span className="text-[9px] font-mono font-black text-primary">{activeSignal.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceMiniBlock = ({ label, value, color, sub }: { label: string, value: number, color: string, sub?: string }) => (
  <div className="p-4 flex flex-col justify-center">
    <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1">{label}</span>
    <div className="flex flex-col">
      <span className={`text-lg font-mono font-black ${color}`}>{value.toFixed(5)}</span>
      {sub && <span className="text-[8px] text-muted-foreground font-mono opacity-50 uppercase">{sub}</span>}
    </div>
  </div>
);