import { Candle, Asset } from '../types/trading';

const BASE_URL = 'https://api.twelvedata.com';

export const fetchHistoricalData = async (symbol: string, interval: string, apiKey: string): Promise<Candle[]> => {
  try {
    const response = await fetch(`${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=150&apikey=${apiKey}`);
    const data = await response.json();
    if (data.status === 'error') throw new Error(data.message);
    
    return data.values.map((v: any) => ({
      time: Math.floor(new Date(v.datetime).getTime() / 1000),
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseFloat(v.volume || '0')
    })).reverse();
  } catch (error) {
    console.error("Error fetching real data:", error);
    return [];
  }
};

export const setupRealtimeWS = (symbols: string[], apiKey: string, onMessage: (data: any) => void) => {
  const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`);
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      action: "subscribe",
      params: { symbols: symbols.join(',') }
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.event === 'price') {
      onMessage(data);
    }
  };

  return ws;
};

// Estratégia de Trading Institucional (Dyad)
export const analyzeInstitutionalStrategy = (candles: Candle[], asset: string) => {
  if (candles.length < 50) return null;

  const last = candles[candles.length - 1];
  const prev = candles.slice(-20, -1);

  // 1. Liquidez (Stop Hunt)
  const pdh = Math.max(...prev.map(c => c.high));
  const pdl = Math.min(...prev.map(c => c.low));
  
  const sweptHigh = last.high > pdh;
  const sweptLow = last.low < pdl;

  // 2. Volume Institucional
  const avgVolume = prev.reduce((acc, c) => acc + c.volume, 0) / prev.length;
  const institutionalVolume = last.volume > avgVolume * 1.5;

  // 3. Estrutura (MSS/CHoCH)
  const isMSS_Buy = last.close > prev[prev.length - 2].high && sweptLow;
  const isMSS_Sell = last.close < prev[prev.length - 2].low && sweptHigh;

  if ((isMSS_Buy || isMSS_Sell) && institutionalVolume) {
    return {
      id: `${asset}-${Date.now()}`,
      asset,
      time: new Date().toLocaleTimeString(),
      direction: isMSS_Buy ? 'BUY' : 'SELL',
      type: 'INSTITUTIONAL_DYAD',
      entry: last.close,
      sl: isMSS_Buy ? pdl : pdh,
      tp1: last.close + (isMSS_Buy ? (last.close - pdl) * 2 : -(pdh - last.close) * 2),
      confidence: 85 + Math.min(10, (last.volume / avgVolume) * 2),
      status: 'ACTIVE'
    };
  }

  return null;
};
