import { Asset, Timeframe, Candle, BiasDirection, ActiveSignal } from '../types/trading';

// Algoritmo de Movimento Browniano Geométrico com Tendência
export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60;
  
  let trend = (Math.random() - 0.5) * 0.0001; 
  let volatility = basePrice * 0.0008;

  for (let i = 0; i < count; i++) {
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
    if (i % 20 === 0) trend = (Math.random() - 0.5) * 0.0002;
  }
  return candles;
};

const isKillZone = () => {
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false
  }).format(new Date());
  const hour = parseInt(nyTime);
  // London: 3-5 AM NY | NY: 8-10 AM NY
  return (hour >= 3 && hour <= 5) || (hour >= 8 && hour <= 10);
};

export const analyzeWSBot = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  if (candles.length < 50) return { obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null };

  const lastCandle = candles[candles.length - 1];
  const prevCandles = candles.slice(-50, -1);
  
  // 1. Identificar PDH e PDL (Máximas e Mínimas Relevantes)
  const pdh = Math.max(...prevCandles.map(c => c.high));
  const pdl = Math.min(...prevCandles.map(c => c.low));

  // 2. Detectar Liquidity Sweep (Caça de Stop)
  const sweptHigh = lastCandle.high > pdh;
  const sweptLow = lastCandle.low < pdl;

  // 3. Detectar FVG (Fair Value Gap) - O "Imbalance" institucional
  const hasFVG_Bull = candles[candles.length-3].high < candles[candles.length-1].low;
  const hasFVG_Bear = candles[candles.length-3].low > candles[candles.length-1].high;

  // 4. Market Structure Shift (MSS)
  const isMSS_Bull = lastCandle.close > pdh && candles[candles.length - 2].close <= pdh;
  const isMSS_Bear = lastCandle.close < pdl && candles[candles.length - 2].close >= pdl;

  // 5. HTF Bias (Média Móvel de Longo Prazo simulada)
  const longMA = candles.reduce((a, b) => a + b.close, 0) / candles.length;
  const htfBias: BiasDirection = lastCandle.close > longMA ? 'BUY' : 'SELL';

  const inKillZone = isKillZone();
  const premiumPct = ((lastCandle.close - pdl) / (pdh - pdl)) * 100;

  let activeSignal: ActiveSignal | null = null;

  // ESTRATÉGIA COMPLETA: Killzone + Bias + Sweep + MSS + FVG
  const canBuy = inKillZone && htfBias === 'BUY' && sweptLow && isMSS_Bull && hasFVG_Bull && premiumPct < 40;
  const canSell = inKillZone && htfBias === 'SELL' && sweptHigh && isMSS_Bear && hasFVG_Bear && premiumPct > 60;

  if (canBuy || canSell) {
    const direction = canBuy ? 'BUY' : 'SELL';
    const entry = lastCandle.close;
    const range = pdh - pdl;
    const sl_dist = range * 0.15; // SL mais curto e técnico
    
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const tp1 = direction === 'BUY' ? entry + (sl_dist * 2) : entry - (sl_dist * 2);
    
    const multiplier = asset.includes('JPY') ? 100 : 10000;
    const sl_pips = Math.abs(entry - sl) * multiplier;
    
    activeSignal = {
      asset,
      direction,
      entry,
      sl,
      tp1,
      tp2: direction === 'BUY' ? entry + (sl_dist * 3.5) : entry - (sl_dist * 3.5),
      sl_pips,
      tp1_pips: sl_pips * 2,
      tp2_pips: sl_pips * 3.5,
      rr: 2.0,
      confidence: 96, // Aumentado devido às novas confluências
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
  }

  return { obs: [], fvgs: [], structure: [], d1Bias: htfBias, premiumPct, activeSignal };
};