import React from 'react';
import { useTrading } from '../contexts/TradingContext';

export const PremiumDiscountGrid = () => {
  const { allAssetsData } = useTrading();
  const assets = ['EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY', 'AUDUSD', 'USDCAD'];

  return (
    <div className="bg-black border border-white/10 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">P/D Matrix Grid</h3>
        <span className="text-[8px] font-mono text-muted-foreground uppercase">Institutional Zones</span>
      </div>

      <div className="space-y-5">
        {assets.map((asset) => {
          const data = allAssetsData[asset];
          const premium = data?.analysis?.premiumPct || 50;
          const bias = data?.analysis?.d1Bias || 'NEUTRAL';

          return (
            <div key={asset} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-white">{asset}</span>
                <span className={`text-[8px] font-black uppercase ${bias === 'BUY' ? 'text-bull' : bias === 'SELL' ? 'text-bear' : 'text-muted-foreground'}`}>
                  {bias}
                </span>
              </div>
              <div className="relative h-2 bg-white/5 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 border-r border-white/5" />
                </div>
                <div 
                  className={`absolute top-0 bottom-0 w-1 transition-all duration-1000 ${premium > 60 ? 'bg-bear shadow-[0_0_8px_#ef4444]' : premium < 40 ? 'bg-bull shadow-[0_0_8px_#22c55e]' : 'bg-primary shadow-[0_0_8px_#EAB308]'}`}
                  style={{ left: `${premium}%` }}
                />
              </div>
              <div className="flex justify-between text-[7px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                <span>Discount</span>
                <span>Equilibrium</span>
                <span>Premium</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};