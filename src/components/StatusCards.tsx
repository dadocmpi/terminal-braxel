import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const StatusCards = () => {
  const { d1Bias, premiumPct, atr } = useTrading();

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-card/50 border-border/50 p-4 flex flex-col justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">D1 Bias</span>
        <div className="flex items-end justify-between mt-2">
          <span className={`text-2xl font-black ${d1Bias === 'BUY' ? 'text-bull' : d1Bias === 'SELL' ? 'text-bear' : 'text-muted-foreground'}`}>
            {d1Bias}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">EMA 100 Filter</span>
        </div>
      </Card>

      <Card className="bg-card/50 border-border/50 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Premium / Discount</span>
          <span className="text-[10px] font-mono text-primary">{premiumPct.toFixed(1)}%</span>
        </div>
        <div className="mt-3">
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
            <div className="h-full bg-bear" style={{ width: '30%' }} />
            <div className="h-full bg-muted" style={{ width: '40%' }} />
            <div className="h-full bg-bull" style={{ width: '30%' }} />
          </div>
          <div className="relative mt-1 h-1">
            <div 
              className="absolute top-0 w-1 h-3 bg-white -translate-y-1/2 rounded-full shadow-lg" 
              style={{ left: `${premiumPct}%` }} 
            />
          </div>
        </div>
      </Card>

      <Card className="bg-card/50 border-border/50 p-4 flex flex-col justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">ATR (H4)</span>
        <div className="flex items-end justify-between mt-2">
          <span className="text-2xl font-mono font-bold text-foreground">
            {(atr * 10000).toFixed(1)} <span className="text-xs text-muted-foreground font-normal">pips</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Volatility Index</span>
        </div>
      </Card>
    </div>
  );
};