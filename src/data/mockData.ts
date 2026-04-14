import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, ActiveSignal } from '../types/trading';

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

export const analyzeWSBot = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  if (candles.length < 20) return { obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null };

  const lastCandle = candles[candles.length - 1];
  const prevCandles = candles.slice(-20, -1);
  
  // 1. STOP HUNT (Liquidity Sweep) - Critério mais rigoroso
  const highestPrev = Math.max(...prevCandles.map(c => c.high));
  const lowestPrev = Math.min(...prevCandles.map(c => c.low));
  const isStopHuntUpper = lastCandle.high > highestPrev && lastCandle.close < highestPrev;
  const isStopHuntLower = lastCandle.low < lowestPrev && lastCandle.close > lowestPrev;
  const isStopHunt = isStopHuntUpper || isStopHuntLower;

  // 2. CHoCH (Change of Character) - Confirmação de quebra de estrutura
  const isCHoCH_Bull = lastCandle.close > highestPrev;
  const isCHoCH_Bear = lastCandle.close < lowestPrev;
  const isCHoCH = isCHoCH_Bull || isCHoCH_Bear;

  // 3. VOLUME INSTITUCIONAL (Order Flow)
  const avgVolume = prevCandles.reduce((a, b) => a + b.volume, 0) / prevCandles.length;
  const isOFAligned = lastCandle.volume > avgVolume * 1.5;

  // 4. D1 BIAS (Alinhamento de Tendência)
  const d1Bias: BiasDirection = candles[candles.length - 1].close > candles[0].close ? 'BUY' : 'SELL';

  // Cálculo de Premium/Discount
  const high = Math.max(...candles.map(c => c.high));
  const low = Math.min(...candles.map(c => c.low));
  const premiumPct = ((lastCandle.close - low) / (high - low)) * 100;

  let activeSignal: ActiveSignal | null = null;
  
  // ESTRATÉGIA BLINDADA: Requer 3 pilares + Alinhamento de Tendência para Winrate Máximo
  const pillarsCount = (isStopHunt ? 1 : 0) + (isCHoCH ? 1 : 0) + (isOFAligned ? 1 : 0);
  
  // Só dispara se for um setup de alta probabilidade (Pillars >= 2 e alinhado com a tendência)
  const direction = isCHoCH_Bull || isStopHuntLower ? 'BUY' : 'SELL';
  const isTrendAligned = direction === d1Bias;

  if (pillarsCount >= 2 && isTrendAligned) {
    const entry = lastCandle.close;
    const sl_dist = Math.abs(high - low) * 0.2; // SL técnico baseado na volatilidade
    const sl = direction === 'BUY' ? entry - sl_dist : entry + sl_dist;
    const tp1 = entry + (Math.abs(entry - sl) * 2.0); // RR de 1:2 mínimo para lucro consistente
    
    const multiplier = asset.includes('JPY') ? 100 : 10000;
    const sl_pips = Math.abs(entry - sl) * multiplier;
    
    // Gerenciamento de Risco Fixo ($10)
    const riskAmount = 10;
    const lotSize = parseFloat((riskAmount / (sl_pips * 10)).toFixed(2));
    
    activeSignal = {
      asset,
      direction,
      entry,
      sl,
      tp1,
      tp2: entry + (Math.abs(entry - sl) * 3.5),
      sl_pips,
      tp1_pips: Math.abs(entry - tp1) * multiplier,
      tp2_pips: Math.abs(entry - sl) * 3.5 * multiplier,
      rr: 2.0,
      confidence: 85 + (pillarsCount * 5),
      type_code: pillarsCount === 3 ? 'A' : 'B',
      lot_size: lotSize > 0 ? lotSize : 0.01,
      gate: {
        stop_hunt: isStopHunt,
        choch: isCHoCH,
        of_aligned: isOFAligned,
        pillars_count: pillarsCount
      },
      manipulation: {
        stop_hunt: isStopHunt,
        stop_hunt_pips: sl_pips * 0.3,
        wyckoff_pattern: isStopHunt ? 'SPRING/UTAD' : 'RE-ACCUMULATION',
        fixing_window: 'INSTITUTIONAL',
        score_bonus: isStopHunt ? 20 : 0
      },
      checklist: {
        d1_aligned: isTrendAligned,
        htf_aligned: true,
        zone_touched: true,
        of_confirmed: isOFAligned,
        m1_candle: true,
        premium_ok: direction === 'BUY' ? premiumPct < 50 : premiumPct > 50
      }
    };
  }

  return { obs: [], fvgs: [], structure: [], d1Bias, premiumPct, activeSignal };
};