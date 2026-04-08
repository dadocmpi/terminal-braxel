import React, { useState, useEffect } from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Radar, Timer, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const ActiveSignal = () => {
  const { signalsData } = useTrading();
  const signal = signalsData.active_signal;

  // Gating logic: All 6 checks must be true + confidence >= 75
  const isApproved = signal && 
    Object.values(signal.checklist).every(v => v === true) && 
    signal.confidence >= 75;

  if (!isApproved) {
    return (
      <Card className="bg-card/50 border-border/50 p-8 flex flex-col items-center justify-center min-h-[300px] terminal-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <Radar className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 border-2 border-primary rounded-full animate-ping opacity-20" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter mb-2">⟳ SCANNING MARKET</h2>
          <p className="text-muted-foreground text-sm mb-6">Nenhum sinal será emitido sem 6/6 ✓ e confiança ≥ 75%</p>
          
          <div className="flex gap-4">
            {['D1 Bias', 'HTF Bias', 'Zone', 'Order Flow', 'Premium', 'Confidence'].map((check, i) => (
              <div key={check} className="flex flex-col items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-bull' : 'bg-secondary'}`} />
                <span className="text-[8px] text-muted-foreground uppercase font-bold">{check}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 w-64 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '66%' }} />
          </div>
          <span className="mt-2 text-[10px] font-mono text-primary">4/6 CONFIRMED</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-primary/30 border-2 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
        <Timer className="w-4 h-4 text-bull" />
        <span className="text-xs font-mono font-bold text-bull">04:22</span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Signal Header */}
        <div className="col-span-3 flex flex-col justify-between">
          <div>
            <Badge className={`text-lg px-4 py-1 mb-2 ${signal.direction === 'BUY' ? 'bg-bull text-white' : 'bg-bear text-white'}`}>
              {signal.direction === 'BUY' ? '▲ LONG' : '▼ SHORT'}
            </Badge>
            <h2 className="text-4xl font-black tracking-tighter">{signal.asset}</h2>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{signal.zone_kind} • {signal.zone_tf}</p>
          </div>
          
          <div className="bg-secondary/50 p-3 rounded-lg border border-border/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</span>
              <span className="text-xs font-mono font-bold text-primary">{signal.confidence}%</span>
            </div>
            <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${signal.confidence}%` }} />
            </div>
          </div>
        </div>

        {/* Center: Price Levels */}
        <div className="col-span-6 grid grid-cols-4 gap-3">
          <PriceCard label="ENTRY" value={signal.entry} color="primary" />
          <PriceCard label="STOP LOSS" value={signal.sl} color="bear" sub={`-${signal.sl_pips} pips`} />
          <PriceCard label="TP 1" value={signal.tp1} color="bull" sub={`+${signal.tp1_pips} pips`} />
          <PriceCard label="TP 2" value={signal.tp2} color="bull" sub={`+${signal.tp2_pips} pips`} />
          
          <div className="col-span-4 grid grid-cols-3 gap-3 mt-2">
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Lot Size</span>
              <span className="text-xl font-mono font-bold text-foreground">{signal.lot_size}</span>
              <span className="text-[8px] text-muted-foreground uppercase">Risk: 2% ($10k)</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">R:R Ratio</span>
              <span className="text-xl font-mono font-bold text-primary">{signal.rr}</span>
              <span className="text-[8px] text-muted-foreground uppercase">Institutional Grade</span>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg border border-border/50 flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">HTF Context</span>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-[8px] border-bull text-bull">D1 BUY</Badge>
                <Badge variant="outline" className="text-[8px] border-bull text-bull">H4 BUY</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Checklist */}
        <div className="col-span-3 bg-secondary/20 p-4 rounded-xl border border-border/50">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Execution Checklist
          </h3>
          <div className="space-y-2">
            <CheckItem label="D1 Bias Aligned" checked={signal.checklist.d1_aligned} />
            <CheckItem label="HTF Bias Confirmed" checked={signal.checklist.htf_aligned} />
            <CheckItem label="Zone Touched" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow Confirmed" checked={signal.checklist.of_confirmed} />
            <CheckItem label="Premium/Discount OK" checked={signal.checklist.premium_ok} />
            <CheckItem label="M1 Candle Pattern" checked={signal.checklist.m1_candle} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const PriceCard = ({ label, value, color, sub }: { label: string, value: number, color: string, sub?: string }) => (
  <div className={`bg-secondary/50 p-3 rounded-lg border border-border/50 flex flex-col items-center justify-center`}>
    <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">{label}</span>
    <span className={`text-lg font-mono font-bold text-${color}`}>{value.toFixed(5)}</span>
    {sub && <span className="text-[9px] text-muted-foreground font-mono mt-1">{sub}</span>}
  </div>
);

const CheckItem = ({ label, checked }: { label: string, checked: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-foreground/80">{label}</span>
    {checked ? <CheckCircle2 className="w-3 h-3 text-bull" /> : <XCircle className="w-3 h-3 text-bear" />}
  </div>
);