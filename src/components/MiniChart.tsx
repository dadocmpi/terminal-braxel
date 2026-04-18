import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import { Asset } from '../types/trading';
import { useTrading } from '../contexts/TradingContext';
import { Lock, BarChart2 } from 'lucide-react';

export const MiniChart = ({ asset }: { asset: Asset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const chartRef = useRef<any>(null);
  const { allAssetsData, currentSession } = useTrading();
  
  const assetData = allAssetsData[asset];
  const currentPrice = assetData?.candles[assetData.candles.length - 1]?.close || 0;
  const status = assetData ? 'live' : 'loading';
  const isClosed = currentSession === 'CLOSE';

  useEffect(() => {
    if (!chartContainerRef.current || isClosed) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 220,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#475569',
        fontSize: 9,
      },
      grid: { vertLines: { color: 'rgba(255, 255, 255, 0.02)' }, horzLines: { color: 'rgba(255, 255, 255, 0.02)' } },
      timeScale: { visible: false },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.2, bottom: 0.2 } },
      handleScroll: false,
      handleScale: false,
    } as any);

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    seriesRef.current = series;
    chartRef.current = chart;

    return () => chart.remove();
  }, [isClosed]);

  useEffect(() => {
    if (seriesRef.current && assetData?.candles && !isClosed) {
      seriesRef.current.setData(assetData.candles as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [assetData, isClosed]);

  return (
    <div className="bg-black border-r border-white/5 relative h-full flex flex-col">
      <div className="terminal-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-2.5 h-2.5" />
          <span>{asset} // M1_FEED</span>
        </div>
        <span className="text-primary font-mono">{currentPrice > 0 ? currentPrice.toFixed(asset.includes('JPY') ? 3 : 5) : '---'}</span>
      </div>
      
      <div className="relative flex-1 min-h-[220px]">
        {isClosed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
            <Lock className="w-4 h-4 text-muted-foreground mb-2" />
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Market Offline</span>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-full" />
        )}
      </div>
      
      <div className="px-3 py-1 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-1 h-1 bg-bull" />
          <div className="w-1 h-1 bg-bear" />
          <div className="w-1 h-1 bg-primary" />
        </div>
        <span className="text-[7px] font-mono text-muted-foreground uppercase">Institutional Liquidity: High</span>
      </div>
    </div>
  );
};