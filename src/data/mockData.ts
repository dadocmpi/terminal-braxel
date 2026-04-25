import { Asset, Timeframe, Candle, BiasDirection, ActiveSignal, SignalType } from '../types/trading';

const isWeekend = () => {
  const day = new Date().getDay();
  return day === 0 || day === 6;
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
  // Se for fim de semana, retorna estado neutro absoluto
  if (isWeekend() || candles.length < 50) {
    return { d1Bias: 'NEUTRAL' as BiasDirection, premiumPct: 50, activeSignal: null };
  }

  const last = candles[candles.length - 1];
  const prev = candles.slice(-30, -1);
  
  const pdh = Math.max(...prev.map(c => c.high));
  const pdl = Math.min(...prev.map(c => c.low));
  const sweptHigh = last.high > pdh;
  const sweptLow = last.low < pdl;

  const avgVolume = prev.reduce((acc, c) => acc + c.volume, 0) / prev.length;
  const highVolume = last.volume > avgVolume * 1.5;

  const hasFVG = Math.abs(candles[candles.length-3].high - candles[candles.length-1].low) > (last.close * 0.0003);
  const isMSS = (last.close > pdh && candles[candles.length-2].close <= pdh) || 
                (last.close < pdl && candles[candles.length-2].close >= pdl);

  const premiumPct = ((last.close - pdl) / (pdh - pdl)) * 100;
  const bias: BiasDirection = last.close > (pdh + pdl) / 2 ? 'BUY' : 'SELL';

  let activeSignal: ActiveSignal | null = null;
  let confluences: string[] = [];

  const canBuy = sweptLow && isMSS && highVolume && premiumPct < 40;
  const canSell = sweptHigh && isMSS && highVolume && premiumPct > 60;

  if (canBuy || canSell) {
    const direction = canBuy ? 'BUY' : 'SELL';
    let confidence = 85;
    
    if (highVolume) confluences.push('Institutional Volume Spike');
    if (hasFVG) confluences.push('Fair Value Gap Created');

    const range = pdh - pdl;
    const sl_dist = range * 0.12;
    const entry = last.close;
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const multiplier = asset.includes('JPY') ? 100 : 10000;

    activeSignal = {
      asset,
      direction,
      type: confidence >= 90 ? 'A' : 'B',
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