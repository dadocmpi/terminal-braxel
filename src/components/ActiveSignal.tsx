import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Timer, ShieldCheck, ArrowDown, ArrowUp } from 'lucide-react';

export const ActiveSignal = () => {
  const { signalsData } = useTrading();
  const signal = signalsData.active_signal;

  if (!signal) return null;

  const isShort = signal.direction === 'SELL';

  return (
    <Card className="bg-[#0d1117] border-[#1e232d] p-0 overflow-hidden rounded-none border-x-0 border-t-0 border-b-2 border-b-destructive/30">
      <div className="grid grid-cols-12">
        {/* Header Info */}
        <div className="col-span-3 p-6 border-r border-border/50">
          <div className="flex items-center gap-2 mb-4">
            {isShort ? (
              <ArrowDown className="w-6 h-6 text-bear animate-bounce" />
            ) : (
              <ArrowUp className="w-6 h-6 text-bull animate-bounce" />
            )}
            <span className={`text-2xl font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {isShort ? 'SHORT' : 'LONG'} {signal.asset}
            </span>
          </div>
          
          <div className="space-y-1 mb-6">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Zone Context</p>
            <p className="text-sm font-mono">{signal.zone_kind} • {signal.zone_tf} • {signal.zone_quality}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-muted-foreground">Lot Size</span>
              <span className="text-accent">Recommended</span>
            </div>
            <div className="text-3xl font-black text-accent font-mono">{signal.lot_size} Lots</div>
            <p className="text-[10px] text-muted-foreground">Risk: 2% of $10,000.00 Balance</p>
          </div>
        </div>

        {/* Price Levels - The Big Boxes */}
        <div className="col-span-6 grid grid-cols-4 gap-0 border-r border-border/50">
          <PriceBlock label="ENTRY" value={signal.entry} type="entry" />
          <PriceBlock label="STOP LOSS" value={signal.sl} type="sl" sub={`-${signal.sl_pips} pips`} />
          <PriceBlock label="TP 1" value={signal.tp1} type="tp" sub={`+${signal.tp1_pips} pips`} />
          <PriceBlock label="TP 2" value={signal.tp2} type="tp" sub={`+${signal.tp2_pips} pips`} />
          
          <div className="col-span-4 grid grid-cols-3 border-t border-border/50">
            <div className="p-4 border-r border-border/50 flex flex-col justify-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">R:R Ratio</span>
              <span className="text-xl font-mono font-bold text-primary">{signal.rr}</span>
            </div>
            <div className="p-4 border-r border-border/50 flex flex-col justify-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Confidence</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold text-bull">{signal.confidence}%</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-bull" style={{ width: `${signal.confidence}%` }} />
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-center relative">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Signal Age</span>
              <span className="text-xl font-mono font-bold text-foreground">04:22 <span className="text-[10px] text-muted-foreground">m/s</span></span>
              <Timer className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground/10" />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="col-span-3 p-6 bg-secondary/10">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Execution Checklist
          </h3>
          <div className="space-y-2.5">
            <CheckItem label="D1 Bias Aligned" checked={signal.checklist.d1_aligned} />
            <CheckItem label="HTF Bias Confirmed" checked={signal.checklist.htf_aligned} />
            <CheckItem label="Zone Touched (Candle Closed)" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow Confirmed (Sell: 30%)" checked={signal.checklist.of_confirmed} />
            <CheckItem label="M1 Entry Candle: Pin Bar" checked={signal.checklist.m1_candle} />
            <CheckItem label="Premium/Discount Zone Correct" checked={signal.checklist.premium_ok} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const PriceBlock = ({ label, value, type, sub }: { label: string, value: number, type: 'entry' | 'sl' | 'tp', sub?: string }) => {
  const styles = {
    entry: "bg-secondary/20 border-l-primary",
    sl: "bg-destructive/5 border-l-destructive",
    tp: "bg-bull/5 border-l-bull"
  };
  
  const textColors = {
    entry: "text-foreground",
    sl: "text-bear",
    tp: "text-bull"
  };

  return (
    <div className={`p-6 border-l-4 ${styles[type]} flex flex-col justify-center border-r border-border/50`}>
      <span className="text-[9px] text-muted-foreground uppercase font-bold mb-2">{label}</span>
      <span className={`text-2xl font-mono font-bold tracking-tighter ${textColors[type]}`}>
        {value.toFixed(5)}
      </span>
      {sub && <span className="text-[10px] text-muted-foreground font-mono mt-1">{sub}</span>}
    </div>
  );
};

const CheckItem = ({ label, checked }: { label: string, checked: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-foreground/70 font-medium">{label}</span>
    {checked ? (
      <div className="flex items-center gap-1">
        <span className="text-[8px] text-bull font-bold uppercase">OK</span>
        <CheckCircle2 className="w-3.5 h-3.5 text-bull" />
      </div>
    ) : (
      <div className="flex items-center gap-1">
        <span className="text-[8px] text-bear font-bold uppercase">FAIL</span>
        <XCircle className="w-3.5 h-3.5 text-bear" />
      </div>
    )}
  </div>
);