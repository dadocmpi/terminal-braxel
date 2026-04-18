import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

export const MarketSentimentBubble = () => {
  const { marketSentiment } = useTrading();
  const { buyers, sellers } = marketSentiment;

  return (
    <div className="bg-black border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
      
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-3 h-3 text-primary animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Order Flow Pressure</span>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Círculo de Fundo */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        
        {/* Arco de Compradores */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="552.92"
            strokeDashoffset={552.92 * (1 - buyers / 100)}
            className="text-bull transition-all duration-1000 ease-in-out"
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <span className="text-4xl font-black tracking-tighter text-white">{buyers.toFixed(0)}%</span>
          <span className="text-[9px] font-black text-bull uppercase tracking-widest">Buyers</span>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full mt-8 gap-4">
        <div className="flex flex-col items-center p-3 bg-bull/5 border border-bull/20">
          <TrendingUp className="w-4 h-4 text-bull mb-1" />
          <span className="text-xs font-mono font-bold text-bull">{buyers.toFixed(1)}%</span>
          <span className="text-[7px] font-black text-muted-foreground uppercase">Longs</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-bear/5 border border-bear/20">
          <TrendingDown className="w-4 h-4 text-bear mb-1" />
          <span className="text-xs font-mono font-bold text-bear">{sellers.toFixed(1)}%</span>
          <span className="text-[7px] font-black text-muted-foreground uppercase">Shorts</span>
        </div>
      </div>
    </div>
  );
};