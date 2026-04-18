import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Asset } from '../types/trading';
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

export const Watchlist = () => {
  const { allAssetsData, setAsset } = useTrading();
  const assets: Asset[] = ['EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY'];

  return (
    <div className="bg-black border border-white/10 h-full flex flex-col">
      <div className="terminal-header flex justify-between items-center">
        <span className="flex items-center gap-2">
          <Plus className="w-2.5 h-2.5" />
          INSTITUTIONAL WATCHLIST
        </span>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-white/5">
            {assets.map((a) => {
              const price = allAssetsData[a]?.candles.slice(-1)[0]?.close || 0;
              return (
                <tr key={a} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setAsset(a)}>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-white">{a}</span>
                      <span className="text-[8px] text-muted-foreground font-mono">M1 FEED</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[10px] font-mono font-bold text-primary">
                      {price > 0 ? price.toFixed(a.includes('JPY') ? 3 : 5) : '---'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="icon" className="h-6 w-6 rounded-none border-bull/30 bg-bull/10 hover:bg-bull hover:text-black">
                        <TrendingUp className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-6 w-6 rounded-none border-bear/30 bg-bear/10 hover:bg-bear hover:text-black">
                        <TrendingDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};