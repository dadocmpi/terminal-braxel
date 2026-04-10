import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Asset, Candle } from '../types/trading';
import { generateMockCandles } from '../data/mockData';

export const MiniChart = ({ asset }: { asset: Asset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = React.useState<Candle[]>([]);

  useEffect(() => {
    const basePrice = asset === 'XAUUSD' ? 2345.50 : asset === 'USDJPY' || asset === 'GBPJPY' ? 154.20 : 1.08540;
    setCandles(generateMockCandles(60, basePrice));
  }, [asset]);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 280, // Aumentado de 180 para 280
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: { visible: false },
      rightPriceScale: { 
        borderVisible: false, 
        scaleMargins: { top: 0.2, bottom: 0.2 },
        alignLabels: true,
      },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    series.setData(candles as any);

    return () => chart.remove();
  }, [candles]);

  return (
    <div className="bg-card/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all group shadow-2xl">
      <div className="p-3 border-b border-border/50 flex justify-between items-center bg-secondary/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-black tracking-tighter group-hover:text-primary transition-colors">{asset}</span>
        </div>
        <span className="text-[8px] font-mono text-muted-foreground bg-background px-2 py-0.5 rounded border border-border/50">M1 LIVE</span>
      </div>
      <div ref={chartContainerRef} className="w-full h-[280px]" />
      <div className="p-2 bg-secondary/5 border-t border-border/30 flex justify-between items-center">
        <span className="text-[8px] text-muted-foreground uppercase font-bold">Institutional Flow</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-bull" />
          <div className="w-1 h-1 rounded-full bg-bull" />
          <div className="w-1 h-1 rounded-full bg-secondary" />
        </div>
      </div>
    </div>
  );
};