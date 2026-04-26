import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useTrading } from '../contexts/TradingContext';
import { BarChart2, Activity } from 'lucide-react';

export const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const { candles, asset, isLoading } = useTrading();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 500,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 10,
        fontFamily: 'JetBrains Mono, monospace',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { labelBackgroundColor: '#EAB308', color: 'rgba(234, 179, 8, 0.5)' },
        horzLine: { labelBackgroundColor: '#EAB308', color: 'rgba(234, 179, 8, 0.5)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && candles.length > 0) {
      seriesRef.current.setData(candles as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [candles]);

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      <div className="terminal-header flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-3 h-3 text-primary" />
          <span className="tracking-[0.2em] font-black uppercase">{asset} // INSTITUTIONAL FEED</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-bull animate-pulse" />
            <span className="text-bull font-black text-[9px]">LIVE</span>
          </div>
          <span className="text-white font-mono text-xs tabular-nums">
            {candles[candles.length-1]?.close.toFixed(asset.includes('JPY') ? 3 : 5)}
          </span>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Syncing Market Data...</span>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};