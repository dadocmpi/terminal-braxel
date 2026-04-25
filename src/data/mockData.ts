import { Asset, Timeframe, Candle, BiasDirection, ActiveSignal, SignalType } from '../types/trading';

const FIXING_WINDOWS = [
  { name: 'NY_OPEN_FIX', hour: 8, minStart: 55, minEnd: 5, weight: 2.0 },
  { name: 'LONDON_CLOSE', hour: 10, minStart: 55, minEnd: 5, weight: 1.8 },
  { name: 'WM_FIX_4PM', hour: 15, minStart: 55, minEnd: 5, weight: 2.5 }
];

const isInsideFixing = () => {
  const now = new Date();
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(now);
  
  const h = parseInt(nyTime.find(p => p.type === 'hour')?.value || '0');
  const m = parseInt(nyTime.find(p => p.type === 'minute')?.value || '0');

  return FIXING_WINDOWS.find(fw => {
    if (fw.minStart > fw.minEnd) {
      return (h === fw.hour && m >= fw.minStart) || (h === fw.hour + 1 && m <= fw.minEnd);
    }
    return h === fw.hour && m >= fw.minStart && m <= fw.minEnd;
  });
};

export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60;
  
  for (let i = 0; i < count; i++) {
    const open = currentPrice;
    const close = currentPrice + (Math.random() - 0.5) * (basePrice * 0.001);
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.0005);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.0005);
    
    candles.push({
      time: now - (count - i) * interval,
      open, high, low, close,
      volume: Math.random() * 10000
    });
    currentPrice = close;
  }
  return candles;
};

export const analyzeWSBot = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  if (candles.length < 50) return { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null };

  const last = candles[candles.length - 1];
  const prev = candles.slice(-30, -1);
  
  // 1. Estrutura de Mercado (Market Structure Shift)
  const pdh = Math.max(...prev.map(c => c.high));
  const pdl = Math.min(...prev.map(c => c.low));
  const sweptHigh = last.high > pdh;
  const sweptLow = last.low < pdl;

  // 2. Volume Institucional (Confirmação de Smart Money)
  const avgVolume = prev.reduce((acc, c) => acc + c.volume, 0) / prev.length;
  const highVolume = last.volume > avgVolume * 1.5;

  // 3. FVG e Desequilíbrio
  const hasFVG = Math.abs(candles[candles.length-3].high - candles[candles.length-1].low) > (last.close * 0.0003);
  const isMSS = (last.close > pdh && candles[candles.length-2].close <= pdh) || 
                (last.close < pdl && candles[candles.length-2].close >= pdl);

  // 4. Contexto de Premium/Discount
  const premiumPct = ((last.close - pdl) / (pdh - pdl)) * 100;
  const bias: BiasDirection = last.close > (pdh + pdl) / 2 ? 'BUY' : 'SELL';

  let activeSignal: ActiveSignal | null = null;
  let confluences: string[] = [];

  // Gatilho de Alta Assertividade: Sweep + MSS + Volume + FVG
  const canBuy = sweptLow && isMSS && highVolume && premiumPct < 40;
  const canSell = sweptHigh && isMSS && highVolume && premiumPct > 60;

  if (canBuy || canSell) {
    const direction = canBuy ? 'BUY' : 'SELL';
    const fixing = isInsideFixing();
    
    let confidence = 75;
    if (highVolume) { confluences.push('Institutional Volume Spike'); confidence += 10; }
    if (fixing) { confluences.push(`Killzone Alignment: ${fixing.name}`); confidence += 10; }
    if (hasFVG) { confluences.push('Fair Value Gap Created'); confidence += 5; }

    const range = pdh - pdl;
    const sl_dist = range * 0.12; // Stop mais curto para melhor RR
    const entry = last.close;
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const multiplier = asset.includes('JPY') ? 100 : 10000;

    activeSignal = {
      asset,
      direction,
      type: confidence >= 90 ? 'A' : confidence >= 80 ? 'B' : 'C',
      entry,
      sl,
      tp1: direction === 'BUY' ? entry + (sl_dist * 2.0) : entry - (sl_dist * 2.0),
      tp2: direction === 'BUY' ? entry + (sl_dist * 4.0) : entry - (sl_dist * 4.0),
      sl_pips: sl_dist * multiplier,
      tp1_pips: (sl_dist * 2.0) * multiplier,
      tp2_pips: (sl_dist * 4.0) * multiplier,
      rr: 2.0,
      confidence: Math.min(99, confidence),
      status: 'PENDING',
      confluences,
      created_at: new Date().toISOString()
    };
  }

  return { d1Bias: bias, premiumPct, activeSignal };
};