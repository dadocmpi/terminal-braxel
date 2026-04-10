import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, ActiveSignal } from '../types/trading';

export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 60; // M1

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

export const analyzeWSBot = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  const obs: OrderBlock[] = [];
  const fvgs: FairValueGap[] = [];
  const structure: MarketStructure[] = [];
  
  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles[candles.length - 2];

  // 1. Detecção de Stop Hunt (Sombra longa + Reversão)
  const isStopHunt = (lastCandle.high - Math.max(lastCandle.open, lastCandle.close)) > (Math.abs(lastCandle.close - lastCandle.open) * 2);
  
  // 2. Detecção de CHoCH (Quebra de estrutura recente)
  const isCHoCH = lastCandle.close > Math.max(...candles.slice(-10, -1).map(c => c.high));

  // 3. Order Flow (Volume + Delta simulado)
  const isOFAligned = lastCandle.volume > (candles.slice(-20).reduce((a, b) => a + b.volume, 0) / 20);

  // 4. Bias D1
  const d1Bias: BiasDirection = lastCandle.close > candles[0].close ? 'BUY' : 'SELL';

  // 5. Premium/Discount
  const high = Math.max(...candles.map(c => c.high));
  const low = Math.min(...candles.map(c => c.low));
  const premiumPct = ((lastCandle.close - low) / (high - low)) * 100;

  // Gerar Sinal Ativo se houver confluência (Pelo menos 2 pilares)
  let activeSignal: ActiveSignal | null = null;
  const pillarsCount = (isStopHunt ? 1 : 0) + (isCHoCH ? 1 : 0) + (isOFAligned ? 1 : 0);

  if (pillarsCount >= 2) {
    const direction = d1Bias;
    const entry = lastCandle.close;
    const sl = direction === 'BUY' ? low : high;
    const tp1 = entry + (Math.abs(entry - sl) * 1.5);
    
    activeSignal = {
      asset,
      direction,
      entry,
      sl,
      tp1,
      tp2: entry + (Math.abs(entry - sl) * 2.5),
      sl_pips: Math.abs(entry - sl) * 10000,
      tp1_pips: Math.abs(entry - tp1) * 10000,
      tp2_pips: Math.abs(entry - sl) * 2.5 * 10000,
      rr: 1.5,
      confidence: 70 + (pillarsCount * 10),
      type_code: pillarsCount === 3 ? 'A' : 'B',
      gate: {
        stop_hunt: isStopHunt,
        choch: isCHoCH,
        of_aligned: isOFAligned,
        pillars_count: pillarsCount
      },
      manipulation: {
        stop_hunt: isStopHunt,
        stop_hunt_pips: 5.2,
        wyckoff_pattern: isStopHunt ? 'SPRING' : 'NONE',
        fixing_window: 'NY_OPEN',
        score_bonus: isStopHunt ? 30 : 0
      },
      checklist: {
        d1_aligned: true,
        htf_aligned: true,
        zone_touched: true,
        of_confirmed: isOFAligned,
        m1_candle: true,
        premium_ok: direction === 'BUY' ? premiumPct < 50 : premiumPct > 50
      }
    };
  }

  return { obs, fvgs, structure, d1Bias, premiumPct, activeSignal };
};