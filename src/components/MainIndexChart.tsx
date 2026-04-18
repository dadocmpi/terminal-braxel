import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import { useTrading } from '../contexts/TradingContext';
import { Activity } from 'lucide-react';

export const MainIndexChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const chartRef = useRef<any>(null);
  const { sessionIndex } = useTrading();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#475569',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      timeScale: { borderVisible: false },
      rightPriceScale: { borderVisible: false },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addAreaSeries({
      lineColor: '#EAB308',
      topColor: 'rgba(234, 179, 8, 0.2)',
      bottomColor: 'rgba(234, 179, 8, 0)',
      lineWidth: 2,
    });

    seriesRef.current = series;
    chartRef.current = chart;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 0 });
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

  return (
    <div className="bg-black border border-white/10 h-full flex flex-col relative overflow-hidden">
      <div className="terminal-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-primary" />
          <span className="tracking-[0.2em]">{sessionIndex.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-primary font-black text-xs animate-pulse">LIVE FEED</span>
          <span className="text-white font-mono text-xs">{sessionIndex.candles[sessionIndex.candles.length-1]?.close.toFixed(3)}</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
};