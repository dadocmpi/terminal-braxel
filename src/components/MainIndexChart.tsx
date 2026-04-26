import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CrosshairMode } from 'lightweight-charts';
import { useTrading } from '../contexts/TradingContext';
import { Activity, Zap } from 'lucide-react';

export const MainIndexChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const chartRef = useRef<any>(null);
  const { sessionIndex } = useTrading();

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
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { labelBackgroundColor: '#EAB308', color: 'rgba(234, 179, 8, 0.3)' },
        horzLine: { labelBackgroundColor: '#EAB308', color: 'rgba(234, 179, 8, 0.3)' },
      },
      timeScale: { 
        borderVisible: false, 
        timeVisible: true, 
        secondsVisible: true,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: { 
        borderVisible: false, 
        scaleMargins: { top: 0.15, bottom: 0.15 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addAreaSeries({
      lineColor: '#EAB308',
      topColor: 'rgba(234, 179, 8, 0.25)',
      bottomColor: 'rgba(234, 179, 8, 0)',
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    seriesRef.current = series;
    chartRef.current = chart;

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
    if (seriesRef.current && sessionIndex.candles.length > 0) {
      const data = sessionIndex.candles.map(c => ({ time: c.time, value: c.close }));
      seriesRef.current.setData(data as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [sessionIndex]);

  const lastPrice = sessionIndex.candles[sessionIndex.candles.length - 1]?.close || 0;

  return (
    <div className="bg-black border border-white/10 h-full flex flex-col relative overflow-hidden">
      <div className="terminal-header flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-primary" />
          <span className="tracking-[0.2em] font-black uppercase">{sessionIndex.name} // 10S FEED</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-primary font-black text-[9px]">HIGH FREQUENCY</span>
          </div>
          <span className="text-white font-mono text-xs tabular-nums font-bold">
            {lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full h-full" />
      
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <div className="px-2 py-1 bg-black/80 border border-white/10 text-[8px] font-black text-muted-foreground uppercase tracking-widest">
          Interval: 10s
        </div>
        <div className="px-2 py-1 bg-black/80 border border-white/10 text-[8px] font-black text-bull uppercase tracking-widest">
          Status: Live
        </div>
      </div>
    </div>
  );
};