import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Asset, Candle } from '../types/trading';
import { generateMockCandles } from '../data/mockData';

export const MiniChart = ({ asset }: { asset: Asset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = React.useState<Candle[]>([]);

  useEffect(() => {
    setCandles(generateMockCandles(50, asset === 'XAUUSD' ? 2300 : 1.0850));
  }, [asset]);

  useEffect(() => {
    if (!chartContainerRef.current || candles.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 180,
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
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
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
    <div className="bg-card/30 border border-border/50 rounded-lg overflow-hidden hover:border-primary/50 transition-colors group">
      <div className="p-2 border-b border-border/50 flex justify-between items-center bg-secondary/10">
        <span className="text-xs font-black tracking-tighter group-hover:text-primary transition-colors">{asset}</span>
        <span className="text-[8px] font-mono text-muted-foreground bg-background px-1 rounded">M1</span>
      </div>
      <div ref={chartContainerRef} className="w-full h-[180px]" />
    </div>
  );
};