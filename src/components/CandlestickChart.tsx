import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useTrading } from '../contexts/TradingContext';

export const CandlestickChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const emaRef = useRef<ISeriesApi<"Line"> | null>(null);
  
  const { candles, asset, timeframe, obs, fvgs, isLoading } = useTrading();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Limpeza de instâncias anteriores
    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { labelBackgroundColor: '#1e293b' },
        horzLine: { labelBackgroundColor: '#1e293b' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Adicionando a série de Candlestick com verificação
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Adicionando a EMA 20
    const emaSeries = chart.addLineSeries({
      color: 'hsl(185, 80%, 50%)',
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    emaRef.current = emaSeries;

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
  }, []);

  useEffect(() => {
    if (seriesRef.current && emaRef.current && candles.length > 0) {
      try {
        // Atualiza Candles
        seriesRef.current.setData(candles as any);
        
        // Calcula e atualiza EMA 20
        const emaData = candles.map((candle, index) => {
          if (index < 20) return null;
          const slice = candles.slice(index - 20, index);
          const sum = slice.reduce((acc, c) => acc + c.close, 0);
          return { time: candle.time, value: sum / 20 };
        }).filter(d => d !== null);
        
        emaRef.current.setData(emaData as any);
        
        chartRef.current?.timeScale().fitContent();
      } catch (err) {
        console.error("Erro ao atualizar dados do gráfico:", err);
      }
    }
  }, [candles]);

  return (
    <div className="relative w-full h-[450px] bg-card/30 rounded-xl border border-border/50 overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tighter">{asset}</span>
            <span className="text-[10px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{timeframe}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-bull font-mono flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-bull" /> OB: {obs.filter(o => o.type === 'BUY').length}
            </span>
            <span className="text-[10px] text-bear font-mono flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-bear" /> OB: {obs.filter(o => o.type === 'SELL').length}
            </span>
            <span className="text-[10px] text-primary font-mono flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" /> EMA 20
            </span>
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest">Loading Market Data...</span>
          </div>
        </div>
      )}
      
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};