import React from 'react';
import { useTrading } from '../contexts/TradingContext';

export const PremiumDiscountGrid = () => {
  const { allAssetsData, activeAssets } = useTrading();

  return (
    <div className="bg-black border border-white/10 p-6 h-full flex flex-col justify-center">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Session Matrix</h3>
        <span className="text-[8px] font-mono text-primary uppercase animate-pulse">Active Pairs</span>
      </div>

      <div className="space-y-8">
        {activeAssets.map((asset) => {
          const data = allAssetsData[asset];
          const premium = data?.analysis?.premiumPct || 50;
          const bias = data?.analysis?.d1Bias || 'NEUTRAL';

          return (
            <div key={asset} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-white tracking-widest">{asset}</span>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 border ${
                  bias === 'BUY' ? 'text-bull border-bull/30 bg-bull/5' : 
                  bias === 'SELL' ? 'text-bear border-bear/30 bg-bear/5' : 
                  'text-muted-foreground border-white/10'
                }`}>
                  {bias}
                </span>
              </div>
              <div className="relative h-2.5 bg-white/5 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 border-r border-white/5" />
                </div>
                <div 
                  className={`absolute top-0 bottom-0 w-1.5 transition-all duration-1000 ${
                    premium > 60 ? 'bg-bear shadow-[0_0_10px_#ef4444]' : 
                    premium < 40 ? 'bg-bull shadow-[0_0_10px_#22c55e]' : 
                    'bg-primary shadow-[0_0_10px_#EAB308]'
                  }`}
                  style={{ left: `${premium}%` }}
                />
              </div>
              <div className="flex justify-between text-[7px] font-black text-muted-foreground/40 uppercase tracking-widest">
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