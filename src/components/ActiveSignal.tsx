import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShieldCheck, ArrowDown, ArrowUp, Zap, AlertTriangle, MousePointer2 } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();
  const signal = activeSignal;

  if (!signal) return (
    <div className="p-12 text-center border-b border-border/50 bg-secondary/5">
      <p className="text-muted-foreground font-mono text-xs animate-pulse uppercase tracking-widest">
        SCANNING INSTITUTIONAL FLOW... WAITING FOR BANK MANIPULATION
      </p>
    </div>
  );

  const isShort = signal.direction === 'SELL';

  return (
    <Card className={`bg-[#0d1117] border-x-0 border-t-0 border-b-4 rounded-none overflow-hidden ${isShort ? 'border-b-bear' : 'border-b-bull'}`}>
      <div className="bg-primary/10 px-6 py-2 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">High Probability Execution Window</span>
          </div>
          <div className="h-4 w-px bg-border/50" />
          <div className="flex items-center gap-2 bg-bull/20 px-2 py-0.5 rounded border border-bull/30">
            <MousePointer2 className="w-3 h-3 text-bull animate-bounce" />
            <span className="text-[9px] font-black text-bull uppercase tracking-widest">Execução Instantânea</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">Detected: {new Date().toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-12">
        {/* Header Info */}
        <div className="col-span-12 lg:col-span-3 p-6 border-r border-border/50">
          <div className="flex items-center gap-2 mb-4">
            {isShort ? (
              <ArrowDown className="w-8 h-8 text-bear animate-bounce" />
            ) : (
              <ArrowUp className="w-8 h-8 text-bull animate-bounce" />
            )}
            <span className={`text-3xl font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {isShort ? 'SELL' : 'BUY'} {signal.asset}
            </span>
          </div>
          
          <div className="space-y-1 mb-6">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Algorithm Classification</p>
            <Badge className={signal.type_code === 'A' ? 'bg-bull text-white' : 'bg-primary text-black'}>
              {signal.type_code === 'A' ? 'INSTITUTIONAL ELITE' : 'PRIME SETUP'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-muted-foreground">Confluences</span>
              <span className="text-accent">{signal.gate.pillars_count}/3</span>
            </div>
            <div className="flex gap-1">
              <PillarBadge label="STOP HUNT" active={signal.gate.stop_hunt} />
              <PillarBadge label="CHoCH" active={signal.gate.choch} />
              <PillarBadge label="FLOW" active={signal.gate.of_aligned} />
            </div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-0 border-r border-border/50">
          <PriceBlock label="EXECUTE AT" value={signal.entry} type="entry" />
          <PriceBlock label="STOP LOSS" value={signal.sl} type="sl" sub={`-${signal.sl_pips.toFixed(1)} pips`} />
          <PriceBlock label="TARGET 1" value={signal.tp1} type="tp" sub={`+${signal.tp1_pips.toFixed(1)} pips`} />
          <PriceBlock label="TARGET 2" value={signal.tp2} type="tp" sub={`+${signal.tp2_pips.toFixed(1)} pips`} />
          
          <div className="col-span-full grid grid-cols-3 border-t border-border/50">
            <div className="p-4 border-r border-border/50 flex flex-col justify-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Risk:Reward</span>
              <span className="text-xl font-mono font-bold text-primary">1:{signal.rr}</span>
            </div>
            <div className="p-4 border-r border-border/50 flex flex-col justify-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Accuracy Score</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono font-bold text-bull">{signal.confidence}%</span>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-center relative bg-accent/5">
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Market Pattern</span>
              <span className="text-sm font-mono font-bold text-accent uppercase">{signal.manipulation.wyckoff_pattern}</span>
              <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20" />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="col-span-12 lg:col-span-3 p-6 bg-secondary/10">
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Validation
          </h3>
          <div className="space-y-2.5">
            <CheckItem label="D1 Bias Aligned" checked={signal.checklist.d1_aligned} />
            <CheckItem label="HTF Structure" checked={signal.checklist.htf_aligned} />
            <CheckItem label="Liquidity Swept" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow" checked={signal.checklist.of_confirmed} />
            <CheckItem label="M1 Confirmation" checked={signal.checklist.m1_candle} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const PillarBadge = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${active ? 'bg-bull/20 border-bull/50 text-bull' : 'bg-secondary border-border text-muted-foreground'}`}>
    {label}
  </div>
);

const PriceBlock = ({ label, value, type, sub }: { label: string, value: number, type: 'entry' | 'sl' | 'tp', sub?: string }) => {
  const styles = {
    entry: "bg-primary/5 border-l-primary",
    sl: "bg-bear/5 border-l-bear",
    tp: "bg-bull/5 border-l-bull"
  };
  
  const textColors = {
    entry: "text-primary",
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
      <CheckCircle2 className="w-3.5 h-3.5 text-bull" />
    ) : (
      <XCircle className="w-3.5 h-3.5 text-bear" />
    )}
  </div>
);