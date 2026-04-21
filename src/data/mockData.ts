import { Asset, Timeframe, Candle, BiasDirection, ActiveSignal } from '../types/trading';

// Algoritmo de Movimento Browniano Geométrico com Tendência (Mais realista)
export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60;
  
  // Tendência aleatória para o lote de candles (Bullish ou Bearish)
  let trend = (Math.random() - 0.5) * 0.0001; 
  let volatility = basePrice * 0.0008;

  for (let i = 0; i < count; i++) {
    // Adiciona "ruído" de mercado e tendência
    const change = (trend * currentPrice) + (Math.random() - 0.5) * volatility;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
    
    candles.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close,
      volume: 1000 + Math.random() * 5000
    });
    currentPrice = close;
    
    // Muda a tendência levemente a cada 20 candles
    if (i % 20 === 0) trend = (Math.random() - 0.5) * 0.0002;
  }
  return candles;
};

export const generateNextCandle = (lastCandle: Candle, intervalSeconds: number = 1): Candle => {
  const volatility = lastCandle.close * 0.0001;
  const change = (Math.random() - 0.5) * volatility;
  const close = lastCandle.close + change;
  return {
    time: (lastCandle.time as number) + intervalSeconds,
    open: lastCandle.close,
    high: Math.max(lastCandle.close, close) + Math.random() * (volatility * 0.2),
    low: Math.min(lastCandle.close, close) - Math.random() * (volatility * 0.2),
    close: close,
    volume: 100 + Math.random() * 500
  };
};

const isKillZone = () => {
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false
  }).format(new Date());
  const hour = parseInt(nyTime);
  return (hour >= 3 && hour <= 5) || (hour >= 8 && hour <= 10);
};

export const analyzeWSBot = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  if (candles.length < 50) return { obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null };

  const lastCandle = candles[candles.length - 1];
  const prevCandles = candles.slice(-30, -1);
  
  const highestPrev = Math.max(...prevCandles.map(c => c.high));
  const lowestPrev = Math.min(...prevCandles.map(c => c.low));
  const sweptHigh = lastCandle.high > highestPrev;
  const sweptLow = lastCandle.low < lowestPrev;

  const isMSS_Bull = lastCandle.close > highestPrev && candles[candles.length - 2].close <= highestPrev;
  const isMSS_Bear = lastCandle.close < lowestPrev && candles[candles.length - 2].close >= lowestPrev;

  const longMA = candles.reduce((a, b) => a + b.close, 0) / candles.length;
  const htfBias: BiasDirection = lastCandle.close > longMA ? 'BUY' : 'SELL';

  const inKillZone = isKillZone();

  const high = Math.max(...candles.map(c => c.high));
  const low = Math.min(...candles.map(c => c.low));
  const premiumPct = ((lastCandle.close - low) / (high - low)) * 100;

  let activeSignal: ActiveSignal | null = null;

  const canBuy = inKillZone && htfBias === 'BUY' && sweptLow && isMSS_Bull && premiumPct < 40;
  const canSell = inKillZone && htfBias === 'SELL' && sweptHigh && isMSS_Bear && premiumPct > 60;

  if (canBuy || canSell) {
    const direction = canBuy ? 'BUY' : 'SELL';
    const entry = lastCandle.close;
    const range = highestPrev - lowestPrev;
    const sl_dist = range * 0.2;
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const tp1 = direction === 'BUY' ? entry + (sl_dist * 2.5) : entry - (sl_dist * 2.5);
    
    const multiplier = asset.includes('JPY') ? 100 : 10000;
    const sl_pips = Math.abs(entry - sl) * multiplier;
    
    activeSignal = {
      asset,
      direction,
      entry,
      sl,
      tp1,
      tp2: direction === 'BUY' ? entry + (sl_dist * 4) : entry - (sl_dist * 4),
      sl_pips,
      tp1_pips: sl_pips * 2.5,
      tp2_pips: sl_pips * 4,
      rr: 2.5,
      confidence: 94,
      type_code: 'A',
      lot_size: parseFloat((10 / (sl_pips * 10)).toFixed(2)),
      gate: { stop_hunt: true, choch: true, of_aligned: true, pillars_count: 4 },
      manipulation: { stop_hunt: true, stop_hunt_pips: sl_pips * 0.3, wyckoff_pattern: 'MSS CONFIRMED', fixing_window: 'KILL ZONE', score_bonus: 20 },
      checklist: { d1_aligned: true, htf_aligned: true, zone_touched: true, of_confirmed: true, m1_candle: true, premium_ok: true }
    };
  }

  return { obs: [], fvgs: [], structure: [], d1Bias: htfBias, premiumPct, activeSignal };
};