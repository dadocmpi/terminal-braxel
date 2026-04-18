import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Asset } from '../types/trading';

export const MarketHeatmap = () => {
  const { allAssetsData } = useTrading();
  
  const assets: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD'];

  return (
    <div className="bg-black border border-white/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Market Heatmap</h3>
        <span className="text-[8px] font-mono text-muted-foreground uppercase">Last 24h Performance</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {assets.map((asset) => {
          const data = allAssetsData[asset];
          const change = data ? (Math.random() * 2 - 1) : 0; // Simulação de variação
          const intensity = Math.min(Math.abs(change) * 100, 100);
          
          return (
            <div 
              key={asset}
              className="aspect-square flex flex-col items-center justify-center border border-white/5 transition-all hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: change > 0 
                  ? `rgba(34, 197, 94, ${intensity / 200})` 
                  : `rgba(239, 68, 68, ${intensity / 200})` 
              }}
            >
              <span className="text-[10px] font-black text-white">{asset}</span>
              <span className={`text-[8px] font-mono font-bold ${change > 0 ? 'text-bull' : 'text-bear'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};