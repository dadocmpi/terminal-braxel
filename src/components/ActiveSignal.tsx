import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ShieldCheck, ArrowDown, ArrowUp, Zap, AlertTriangle, MousePointer2 } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal, premiumPct } = useTrading();
  const signal = activeSignal;

  if (!signal) return (
    <div className="p-12 text-center border-b border-white/5 bg-black">
      <p className="text-primary font-black text-[10px] animate-pulse uppercase tracking-[0.4em]">
        SCANNING INSTITUTIONAL FLOW...
      </p>
    </div>
  );

  const isShort = signal.direction === 'SELL';
  // Validação lógica: Buy deve ser em Discount (<50), Sell deve ser em Premium (>50)
  const isPdAligned = isShort ? premiumPct > 50 : premiumPct < 50;

  return (
    <Card className={`bg-black border-x-0 border-t-0 border-b-4 rounded-none overflow-hidden ${isShort ? 'border-b-bear' : 'border-b-bull'}`}>
      <div className="bg-primary/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">High Probability Execution Window</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 bg-bull/10 px-3 py-1 border border-bull/20">
            <MousePointer2 className="w-3 h-3 text-bull animate-bounce" />
            <span className="text-[9px] font-black text-bull uppercase tracking-widest">Execução Instantânea</span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Detected: {new Date().toLocaleTimeString()}</span>
      </div>

      <div className="grid grid-cols-12">
        {/* Header Info */}
        <div className="col-span-12 lg:col-span-3 p-8 border-r border-white/5 bg-[#050505]">
          <div className="flex items-center gap-3 mb-6">
            {isShort ? (
              <ArrowDown className="w-10 h-10 text-bear animate-bounce" />
            ) : (
              <ArrowUp className="w-10 h-10 text-bull animate-bounce" />
            )}
            <span className={`text-4xl font-black tracking-tighter ${isShort ? 'text-bear' : 'text-bull'}`}>
              {isShort ? 'SELL' : 'BUY'} {signal.asset}
            </span>
          </div>
          
          <div className="space-y-2 mb-8">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Algorithm Classification</p>
            <Badge className="bg-primary text-black font-black rounded-none px-3 py-1 text-[10px] tracking-widest">
              {signal.type_code === 'A' ? 'INSTITUTIONAL ELITE' : 'PRIME SETUP'}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-muted-foreground">Confluences</span>
              <span className="text-primary">{signal.gate.pillars_count}/3</span>
            </div>
            <div className="flex gap-1.5">
              <PillarBadge label="STOP HUNT" active={signal.gate.stop_hunt} />
              <PillarBadge label="CHoCH" active={signal.gate.choch} />
              <PillarBadge label="FLOW" active={signal.gate.of_aligned} />
            </div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-0 border-r border-white/5">
          <PriceBlock label="EXECUTE AT" value={signal.entry} type="entry" />
          <PriceBlock label="STOP LOSS" value={signal.sl} type="sl" sub={`-${signal.sl_pips.toFixed(1)} pips`} />
          <PriceBlock label="TARGET 1" value={signal.tp1} type="tp" sub={`+${signal.tp1_pips.toFixed(1)} pips`} />
          <PriceBlock label="TARGET 2" value={signal.tp2} type="tp" sub={`+${signal.tp2_pips.toFixed(1)} pips`} />
          
          <div className="col-span-full grid grid-cols-3 border-t border-white/5">
            <div className="p-6 border-r border-white/5 flex flex-col justify-center bg-black">
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-2">Risk:Reward</span>
              <span className="text-2xl font-mono font-black text-primary">1:{signal.rr}</span>
            </div>
            <div className="p-6 border-r border-white/5 flex flex-col justify-center bg-black">
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-2">Accuracy Score</span>
              <span className="text-2xl font-mono font-black text-bull">{signal.confidence}%</span>
            </div>
            <div className="p-6 flex flex-col justify-center relative bg-primary/[0.02]">
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-2">Market Pattern</span>
              <span className="text-sm font-mono font-black text-primary uppercase tracking-widest">{signal.manipulation.wyckoff_pattern}</span>
              <Zap className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-primary/10" />
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="col-span-12 lg:col-span-3 p-8 bg-[#030303]">
          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Validation
          </h3>
          <div className="space-y-4">
            <CheckItem label="D1 Bias Aligned" checked={signal.checklist.d1_aligned} />
            <CheckItem label="HTF Structure" checked={signal.checklist.htf_aligned} />
            <CheckItem label="Liquidity Swept" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow" checked={signal.checklist.of_confirmed} />
            <CheckItem label="P/D Matrix OK" checked={isPdAligned} />
          </div>
        </div>
      </div>
    </Card>
  );
};

const PillarBadge = ({ label, active }: { label: string, active: boolean }) => (
  <div className={`px-2 py-1 rounded-none text-[8px] font-black border tracking-tighter ${active ? 'bg-bull/20 border-bull/50 text-bull' : 'bg-white/5 border-white/10 text-muted-foreground'}`}>
    {label}
  </div>
);

const PriceBlock = ({ label, value, type, sub }: { label: string, value: number, type: 'entry' | 'sl' | 'tp', sub?: string }) => {
  const styles = {
    entry: "bg-primary/[0.03] border-l-primary",
    sl: "bg-bear/[0.03] border-l-bear",
    tp: "bg-bull/[0.03] border-l-bull"
  };
  
  const textColors = {
    entry: "text-primary",
    sl: "text-bear",
    tp: "text-bull"
  };

  return (
    <div className={`p-8 border-l-4 ${styles[type]} flex flex-col justify-center border-r border-white/5`}>
      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-3">{label}</span>
      <span className={`text-2xl font-mono font-black tracking-tighter ${textColors[type]}`}>
        {value.toFixed(5)}
      </span>
      {sub && <span className="text-[10px] text-muted-foreground font-mono mt-2 opacity-60">{sub}</span>}
    </div>
  );
};

const CheckItem = ({ label, checked }: { label: string, checked: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{label}</span>
    {checked ? (
      <CheckCircle2 className="w-4 h-4 text-bull" />
    ) : (
      <XCircle className="w-4 h-4 text-bear" />
    )}
  </div>
);