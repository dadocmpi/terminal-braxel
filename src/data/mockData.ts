import { Asset, Timeframe, Candle, BiasDirection, ActiveSignal } from '../types/trading';

export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60;

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.001);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.0005);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.0005);
    
    candles.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000
    });
    currentPrice = close;
  }
  return candles;
};

export const generateNextCandle = (lastCandle: Candle, intervalSeconds: number = 1): Candle => {
  const change = (Math.random() - 0.5) * (lastCandle.close * 0.0002);
  const close = lastCandle.close + change;
  return {
    time: (lastCandle.time as number) + intervalSeconds,
    open: lastCandle.close,
    high: Math.max(lastCandle.close, close) + Math.random() * 0.0001,
    low: Math.min(lastCandle.close, close) - Math.random() * 0.0001,
    close: close,
    volume: Math.random() * 100
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

  const isMSS_Bull = lastCandle.close > highestPrev;
  const isMSS_Bear = lastCandle.close < lowestPrev;

  const longMA = candles.reduce((a, b) => a + b.close, 0) / candles.length;
  const htfBias: BiasDirection = lastCandle.close > longMA ? 'BUY' : 'SELL';

  const inKillZone = isKillZone();

  const high = Math.max(...candles.map(c => c.high));
  const low = Math.min(...candles.map(c => c.low));
  const premiumPct = ((lastCandle.close - low) / (high - low)) * 100;

  let activeSignal: ActiveSignal | null = null;
  const direction = (isMSS_Bull || sweptLow) ? 'BUY' : 'SELL';
  const isTrendAligned = direction === htfBias;
  
  if (inKillZone && isTrendAligned && (sweptHigh || sweptLow)) {
    const entry = lastCandle.close;
    const sl_dist = Math.abs(high - low) * 0.15;
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const tp1 = entry + (Math.abs(entry - sl) * 2.5);
    
    const multiplier = asset.includes('JPY') ? 100 : 10000;
    const sl_pips = Math.abs(entry - sl) * multiplier;
    
    activeSignal = {
      asset,
      direction,
      entry,
      sl,
      tp1,
      tp2: entry + (Math.abs(entry - sl) * 4.0),
      sl_pips,
      tp1_pips: Math.abs(entry - tp1) * multiplier,
      tp2_pips: Math.abs(entry - sl) * 4.0 * multiplier,
      rr: 2.5,
      confidence: 92,
      type_code: 'A',
      lot_size: parseFloat((10 / (sl_pips * 10)).toFixed(2)),
      gate: { stop_hunt: sweptHigh || sweptLow, choch: isMSS_Bull || isMSS_Bear, of_aligned: true, pillars_count: 3 },
      manipulation: { stop_hunt: true, stop_hunt_pips: sl_pips * 0.2, wyckoff_pattern: 'INSTITUTIONAL SWEEP', fixing_window: inKillZone ? 'KILL ZONE' : 'STANDARD', score_bonus: 15 },
      checklist: { d1_aligned: isTrendAligned, htf_aligned: true, zone_touched: true, of_confirmed: true, m1_candle: true, premium_ok: direction === 'BUY' ? premiumPct < 50 : premiumPct > 50 }
    };
  }

  return { obs: [], fvgs: [], structure: [], d1Bias: htfBias, premiumPct, activeSignal };
};