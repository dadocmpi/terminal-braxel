"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const TickerTape = () => {
  const { allAssetsData } = useTrading();
  const assets = Object.keys(allAssetsData);

  return (
    <div className="w-full bg-black border-b border-white/10 overflow-hidden whitespace-nowrap py-1.5">
      <div className="inline-block animate-marquee">
        {assets.concat(assets).map((asset, i) => {
          const data = allAssetsData[asset];
          const price = data?.candles.slice(-1)[0]?.close || 0;
          const isUp = Math.random() > 0.5; // Simulação de variação
          
          return (
            <div key={`${asset}-${i}`} className="inline-flex items-center gap-2 px-6 border-r border-white/5">
              <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">{asset}</span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {price.toFixed(asset.includes('JPY') ? 3 : 5)}
              </span>
              {isUp ? (
                <TrendingUp className="w-2.5 h-2.5 text-bull" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 text-bear" />
              )}
            </div>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
};