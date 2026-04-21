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
      height: chartContainerRef.current.clientHeight || 500,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#475569',
        fontSize: 10,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.02)' },
      },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: true },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addAreaSeries({
      lineColor: '#EAB308',
      topColor: 'rgba(234, 179, 8, 0.2)',
      bottomColor: 'rgba(234, 179, 8, 0)',
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    seriesRef.current = series;
    chartRef.current = chart;

    const initialData = sessionIndex.candles.map(c => ({ time: c.time, value: c.close }));
    series.setData(initialData as any);

    // Adicionar Linhas de S/R Automáticas (Apenas as linhas, sem nomes)
    const prices = initialData.map(d => d.value);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const range = max - min;

    // Resistências (Vermelho)
    [max, max - range * 0.2].forEach((price) => {
      series.createPriceLine({
        price: price,
        color: '#ef4444',
        lineWidth: 1,
        lineStyle: 2, // Dotted
        axisLabelVisible: false,
        title: '',
      });
    });

    // Suportes (Verde)
    [min, min + range * 0.2].forEach((price) => {
      series.createPriceLine({
        price: price,
        color: '#22c55e',
        lineWidth: 1,
        lineStyle: 2, // Dotted
        axisLabelVisible: false,
        title: '',
      });
    });

    chart.timeScale().fitContent();

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
  }, [sessionIndex]);

  return (
    <div className="bg-black border border-white/10 h-full flex flex-col relative overflow-hidden">
      <div className="terminal-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-primary" />
          <span className="tracking-[0.2em] font-black">{sessionIndex.name} // INSTITUTIONAL FEED</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-primary font-black text-[9px] animate-pulse">LIVE DATA</span>
          <span className="text-white font-mono text-xs tabular-nums">
            {sessionIndex.candles[sessionIndex.candles.length-1]?.close.toFixed(3)}
          </span>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full h-full" />
    </div>
  );
};