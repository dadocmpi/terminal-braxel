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
      height: 650, // Altura aumentada para puxar para baixo
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
        fontSize: 10,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
      },
      timeScale: { 
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: { 
        borderVisible: false, 
        scaleMargins: { top: 0.1, bottom: 0.1 },
        alignLabels: true,
      },
      handleScroll: false,
      handleScale: false,
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    series.setData(candles as any);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [candles]);

  return (
    <div className="bg-transparent overflow-hidden group transition-colors hover:bg-white/[0.02]">
      <div className="p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tighter text-white group-hover:text-primary transition-colors">{asset}</span>
          <span className="text-[8px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded-none border border-white/10">M1 REALTIME</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-bull" />
          <span className="text-[8px] font-bold text-bull uppercase">Bullish Flow</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[650px]" />
      <div className="p-3 bg-black/40 flex justify-between items-center border-t border-white/5">
        <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Institutional Matrix v2.0</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-muted-foreground">VOL:</span>
            <span className="text-[8px] font-mono text-white">HIGH</span>
          </div>
        </div>
      </div>
    </div>
  );
};