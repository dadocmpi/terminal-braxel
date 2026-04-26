import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi, CrosshairMode } from 'lightweight-charts';
import { useTrading } from '../contexts/TradingContext';
import { Activity, Zap, Lock, AlertCircle } from 'lucide-react';

export const MainIndexChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const chartRef = useRef<any>(null);
  const { sessionIndex, isMarketOpen, isLoading } = useTrading();

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
    });

    const series = chart.addAreaSeries({
      lineColor: isMarketOpen ? '#EAB308' : '#475569',
      topColor: isMarketOpen ? 'rgba(234, 179, 8, 0.25)' : 'rgba(71, 85, 105, 0.1)',
      bottomColor: 'rgba(0, 0, 0, 0)',
      lineWidth: 2,
      priceLineVisible: isMarketOpen,
      lastValueVisible: isMarketOpen,
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
  }, [isMarketOpen]);

  useEffect(() => {
    if (seriesRef.current && sessionIndex.candles.length > 0) {
      const data = sessionIndex.candles.map(c => ({ time: c.time, value: c.close }));
      seriesRef.current.setData(data as any);
      chartRef.current?.timeScale().fitContent();
    }
  }, [sessionIndex]);

  const hasData = sessionIndex.candles.length > 0;
  const lastPrice = hasData ? sessionIndex.candles[sessionIndex.candles.length - 1].close : 0;

  return (
    <div className="bg-black border border-white/10 h-full flex flex-col relative overflow-hidden">
      <div className="terminal-header flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className={`w-3 h-3 ${isMarketOpen ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className="tracking-[0.2em] font-black uppercase">{sessionIndex.name} // {isMarketOpen ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isMarketOpen && (
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground font-black text-[9px]">MARKET CLOSED</span>
            </div>
          )}
          <span className={`font-mono text-xs tabular-nums font-bold ${isMarketOpen ? 'text-white' : 'text-muted-foreground'}`}>
            {hasData ? lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
          </span>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full relative">
        {!hasData && !isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60">
            <AlertCircle className="w-8 h-8 text-muted-foreground/20 mb-2" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">No Real-Time Data Available</span>
            <span className="text-[8px] text-muted-foreground/50 mt-1">Check API Connection or Market Hours</span>
          </div>
        )}
        
        {!isMarketOpen && hasData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="px-4 py-2 border border-white/10 bg-black/80 flex items-center gap-3">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Static Historical View</span>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};