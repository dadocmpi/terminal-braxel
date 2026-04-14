import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import { Asset } from '../types/trading';
import { useTrading } from '../contexts/TradingContext';
import { Lock } from 'lucide-react';

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
      height: 750, // Aumentado significativamente para esticar o terminal
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: 'rgba(255, 255, 255, 0.03)' } },
      timeScale: { visible: false, borderVisible: false },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      handleScroll: false,
      handleScale: false,
      watermark: { visible: false }
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

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [isClosed]);

  useEffect(() => {
    if (seriesRef.current && assetData?.candles && !isClosed) {
      seriesRef.current.setData(assetData.candles as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [assetData, isClosed]);

  return (
    <div className="bg-transparent overflow-hidden group transition-colors hover:bg-white/[0.02] relative h-full flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tighter text-white group-hover:text-primary transition-colors">
            {isClosed ? '---' : asset}
          </span>
          <span className={`text-[8px] font-mono px-2 py-0.5 rounded-none border ${status === 'live' && !isClosed ? 'text-bull border-bull/20 bg-bull/5' : 'text-muted-foreground border-white/10 bg-white/5'}`}>
            {isClosed ? 'OFFLINE' : status === 'live' ? 'M1 LIVE' : 'CONNECTING...'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-primary tabular-nums">
            {!isClosed && currentPrice > 0 ? currentPrice.toFixed(asset.includes('JPY') ? 2 : 5) : '---'}
          </span>
          <div className={`w-1 h-1 rounded-full ${status === 'live' && !isClosed ? 'bg-bull animate-pulse' : 'bg-muted'}`} />
        </div>
      </div>
      
      <div className="relative w-full flex-1 min-h-[750px]">
        {isClosed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
            <Lock className="w-8 h-8 text-primary/40 mb-3" />
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Esperando abertura</span>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-full" />
        )}
      </div>
      
      <div className="p-3 bg-black/40 flex justify-between items-center border-t border-white/5">
        <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Institutional Feed</span>
        <span className="text-[8px] font-mono text-white/40">SYNC: {assetData && !isClosed ? 'OK' : 'WAIT'}</span>
      </div>
    </div>
  );
};