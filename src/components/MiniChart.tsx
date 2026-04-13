import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, ISeriesApi } from 'lightweight-charts';
import { Asset, Candle } from '../types/trading';

const API_KEY = 'demo';

export const MiniChart = ({ asset }: { asset: Asset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [status, setStatus] = useState<'loading' | 'live' | 'error'>('loading');

  const fetchChartData = async () => {
    try {
      const symbol = asset.slice(0,3) + '/' + asset.slice(3);
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=50&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.values && seriesRef.current) {
        const formatted = data.values.map((v: any) => ({
          time: new Date(v.datetime).getTime() / 1000,
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close)
        })).reverse();

        seriesRef.current.setData(formatted);
        setCurrentPrice(formatted[formatted.length - 1].close);
        setStatus('live');
      } else if (data.status === 'error') {
        setTimeout(fetchChartData, 10000);
      }
    } catch (e) {
      setStatus('error');
      setTimeout(fetchChartData, 15000);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 650,
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
    fetchChartData();

    const interval = setInterval(fetchChartData, 60000);
    return () => {
      clearInterval(interval);
      chart.remove();
    };
  }, [asset]);

  return (
    <div className="bg-transparent overflow-hidden group transition-colors hover:bg-white/[0.02]">
      <div className="p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tighter text-white group-hover:text-primary transition-colors">{asset}</span>
          <span className={`text-[8px] font-mono px-2 py-0.5 rounded-none border ${status === 'live' ? 'text-bull border-bull/20 bg-bull/5' : 'text-muted-foreground border-white/10 bg-white/5'}`}>
            {status === 'live' ? 'REAL-TIME' : 'CONNECTING...'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-primary tabular-nums">
            {currentPrice > 0 ? currentPrice.toFixed(asset.includes('JPY') ? 2 : 5) : '---'}
          </span>
          <div className={`w-1 h-1 rounded-full ${status === 'live' ? 'bg-bull animate-pulse' : 'bg-muted'}`} />
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full h-[650px]" />
      
      <div className="p-3 bg-black/40 flex justify-between items-center border-t border-white/5">
        <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Twelve Data API Feed</span>
        <span className="text-[8px] font-mono text-white/40">LATENCY: LOW</span>
      </div>
    </div>
  );
};