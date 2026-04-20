import { Candle, Asset } from '../types/trading';

const BASE_URL = 'https://api.twelvedata.com';

export const fetchHistoricalData = async (symbol: string, interval: string, apiKey: string): Promise<Candle[]> => {
  try {
    const response = await fetch(`${BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=100&apikey=${apiKey}`);
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