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
  // Bloqueio de Fim de Semana
  if (isWeekend() || candles.length < 50) {
    return { d1Bias: 'NEUTRAL' as BiasDirection, premiumPct: 50, activeSignal: null };
  }

  const last = candles[candles.length - 1];
  const prev = candles.slice(-40, -1);
  
  // 1. Identificação de Liquidez (PDH/PDL)
  const pdh = Math.max(...prev.map(c => c.high));
  const pdl = Math.min(...prev.map(c => c.low));
  
  // 2. Detecção de Manipulação (Liquidity Sweep)
  const sweptHigh = last.high > pdh;
  const sweptLow = last.low < pdl;

  // 3. Confirmação de Volume (Smart Money Entry)
  const avgVolume = prev.reduce((acc, c) => acc + c.volume, 0) / prev.length;
  const institutionalVolume = last.volume > avgVolume * 1.8;

  // 4. Market Structure Shift (MSS) - Confirmação de reversão
  const isMSS_Buy = last.close > prev[prev.length-2].high && sweptLow;
  const isMSS_Sell = last.close < prev[prev.length-2].low && sweptHigh;

  // 5. Premium vs Discount
  const premiumPct = ((last.close - pdl) / (pdh - pdl)) * 100;
  const bias: BiasDirection = premiumPct > 50 ? 'SELL' : 'BUY';

  let activeSignal: ActiveSignal | null = null;
  let confluences: string[] = [];

  // Gatilho de Alta Probabilidade
  const canBuy = isMSS_Buy && institutionalVolume && premiumPct < 35;
  const canSell = isMSS_Sell && institutionalVolume && premiumPct > 65;

  if (canBuy || canSell) {
    const direction = canBuy ? 'BUY' : 'SELL';
    confluences.push('Institutional Liquidity Sweep');
    confluences.push('Market Structure Shift (MSS)');
    if (institutionalVolume) confluences.push('Volume Spike Confirmed');

    const range = pdh - pdl;
    const sl_dist = range * 0.15;
    const entry = last.close;
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const multiplier = asset.includes('JPY') ? 100 : 10000;

    activeSignal = {
      asset,
      direction,
      type: 'A', // Sinais filtrados por MSS + Volume são sempre Tipo A
      entry,
      sl,
      tp1: direction === 'BUY' ? entry + (sl_dist * 2.0) : entry - (sl_dist * 2.0),
      tp2: direction === 'BUY' ? entry + (sl_dist * 4.5) : entry - (sl_dist * 4.5),
      sl_pips: sl_dist * multiplier,
      tp1_pips: (sl_dist * 2.0) * multiplier,
      tp2_pips: (sl_dist * 4.5) * multiplier,
      rr: 2.0,
      confidence: 92,
      status: 'PENDING',
      confluences,
      created_at: new Date().toISOString()
    };
  }

  return { d1Bias: bias, premiumPct, activeSignal };
};