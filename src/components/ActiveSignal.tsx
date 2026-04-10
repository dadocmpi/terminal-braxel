import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Timer, ShieldCheck, ArrowDown, ArrowUp, Zap } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();
  const signal = activeSignal;

  if (!signal) return (
    <div className="p-12 text-center border-b border-border/50 bg-secondary/5">
      <p className="text-muted-foreground font-mono text-xs animate-pulse">AGthink
The user wants me to continue the previous response exactly where I left off.

Looking at the previous response:
The last file being written was `src/components/ActiveSignal.tsx`.
The content ended with:
```tsx
    <div className="p-12 text-center border-b border-border/50 bg-secondary/5">
      <p className="text-muted-foreground font-mono text-xs animate-pulse">AG
```

I need to complete the `src/components/ActiveSignal.tsx` file and then provide the chat summary.

Wait, I should check if there are other files I need to update or create based on the user's request to "apply my strategy".
The user provided a large Python script.
I've already updated:
- `src/types/trading.ts`
- `src/utils/audio.ts`
- `src/data/mockData.ts`
- `src/contexts/TradingContext.tsx`
- Started `src/components/ActiveSignal.tsx`

I should finish `src/components/ActiveSignal.tsx`.
Then I should probably update `src/pages/Index.tsx` to make sure it uses the new context values if necessary, although the previous `Index.tsx` already used `ActiveSignal`.

Let's finish `src/components/ActiveSignal.tsx`.

```tsx
import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Timer, ShieldCheck, ArrowDown, ArrowUp, Zap } from 'lucide-react';

export const ActiveSignal = () => {
  const { activeSignal } = useTrading();
  const signal = activeSignal;

  if (!signal) return (
    <div className="p-12 text-center border-b border-border/50 bg-secondary/5">
      <p className="text-muted-foreground font-mono text-xs animate-pulse">AGUARDANDO SETUP INSTITUCIONAL (SMC + BANK MANIPULATION)...</p>
    </div>
  );

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
            <p className="text-[10px] text-muted-foreground uppercase font-bold">W.S Bot v7.1 Classification</p>
            <Badge className={signal.type_code === 'A' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
              TIPO {signal.type_code} — {signal.type_code === 'A' ? 'ELITE' : 'PRIME'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-muted-foreground">Pillars Confirmed</span>
              <span className="text-accent">{signal.gate.pillars_count}/3</span>
            </div>
            <div className="flex gap-1">
              <PillarBadge label="SH" active={signal.gate.stop_hunt} />
              <PillarBadge label="CHoCH" active={signal.gate.choch} />
              <PillarBadge label="OF" active={signal.gate.of_aligned} />
            </div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="col-span-6 grid grid-cols-4 gap-0 border-r border-border/50">
          <PriceBlock label="ENTRY" value={signal.entry} type="entry" />
          <PriceBlock label="STOP LOSS" value={signal.sl} type="sl" sub={`-${signal.sl_pips.toFixed(1)} pips`} />
          <PriceBlock label="TP 1" value={signal.tp1} type="tp" sub={`+${signal.tp1_pips.toFixed(1)} pips`} />
          <PriceBlock label="TP 2" value={signal.tp2} type="tp" sub={`+${signal.tp2_pips.toFixed(1)} pips`} />
          
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
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Bank Manip</span>
              <span className="text-sm font-mono font-bold text-accent uppercase">{signal.manipulation.wyckoff_pattern}</span>
              <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20" />
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
            <CheckItem label="Zone Touched" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow Confirmed" checked={signal.checklist.of_confirmed} />
            <CheckItem label="M1 Entry Pattern" checked={signal.checklist.m1_candle} />
            <CheckItem label="Premium/Discount OK" checked={signal.checklist.premium_ok} />
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
```

I should also update `src/components/StatusCards.tsx` to use the new `activeSignal` from context if needed, but the previous implementation was already quite good.

Wait, the user asked "integrou? Sim ou nao, nao entendi".
I should answer "Sim" and explain that I've integrated the logic.

I'll finish the `ActiveSignal.tsx` file first.UARDANDO SETUP INSTITUCIONAL (SMC + BANK MANIPULATION)...</p>
    </div>
  );

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
            <p className="text-[10px] text-muted-foreground uppercase font-bold">W.S Bot v7.1 Classification</p>
            <Badge className={signal.type_code === 'A' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
              TIPO {signal.type_code} — {signal.type_code === 'A' ? 'ELITE' : 'PRIME'}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span className="text-muted-foreground">Pillars Confirmed</span>
              <span className="text-accent">{signal.gate.pillars_count}/3</span>
            </div>
            <div className="flex gap-1">
              <PillarBadge label="SH" active={signal.gate.stop_hunt} />
              <PillarBadge label="CHoCH" active={signal.gate.choch} />
              <PillarBadge label="OF" active={signal.gate.of_aligned} />
            </div>
          </div>
        </div>

        {/* Price Levels */}
        <div className="col-span-6 grid grid-cols-4 gap-0 border-r border-border/50">
          <PriceBlock label="ENTRY" value={signal.entry} type="entry" />
          <PriceBlock label="STOP LOSS" value={signal.sl} type="sl" sub={`-${signal.sl_pips.toFixed(1)} pips`} />
          <PriceBlock label="TP 1" value={signal.tp1} type="tp" sub={`+${signal.tp1_pips.toFixed(1)} pips`} />
          <PriceBlock label="TP 2" value={signal.tp2} type="tp" sub={`+${signal.tp2_pips.toFixed(1)} pips`} />
          
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
              <span className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Bank Manip</span>
              <span className="text-sm font-mono font-bold text-accent uppercase">{signal.manipulation.wyckoff_pattern}</span>
              <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-accent/20" />
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
            <CheckItem label="Zone Touched" checked={signal.checklist.zone_touched} />
            <CheckItem label="Order Flow Confirmed" checked={signal.checklist.of_confirmed} />
            <CheckItem label="M1 Entry Pattern" checked={signal.checklist.m1_candle} />
            <CheckItem label="Premium/Discount OK" checked={signal.checklist.premium_ok} />
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