import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MarketBiasSummary = () => {
  const { signalsData } = useTrading();

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-secondary/30 border-b border-border/50">
            <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset</th>
            <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bias</th>
            <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Premium%</th>
            <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Zones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {signalsData.market_context.pairs.map((pair) => (
            <tr key={pair.asset} className="hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-2 font-mono text-xs font-bold">{pair.asset}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-1">
                  {pair.bias === 'BUY' ? (
                    <ArrowUpRight className="w-3 h-3 text-bull" />
                  ) : pair.bias === 'SELL' ? (
                    <ArrowDownRight className="w-3 h-3 text-bear" />
                  ) : (
                    <Minus className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={`text-[10px] font-bold ${pair.bias === 'BUY' ? 'text-bull' : pair.bias === 'SELL' ? 'text-bear' : 'text-muted-foreground'}`}>
                    {pair.bias}
                  </span>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${pair.premium > 70 ? 'bg-bear' : pair.premium < 30 ? 'bg-bull' : 'bg-primary'}`} 
                    style={{ width: `${pair.premium}%` }} 
                  />
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <span className="text-[10px] text-bull font-bold">{pair.zones.buy}B</span>
                  <span className="text-[10px] text-bear font-bold">{pair.zones.sell}S</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};