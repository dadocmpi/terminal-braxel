import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection } from '../types/trading';

export const generateMockCandles = (count: number, basePrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const interval = 3600; // 1h

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.002);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.001);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.001);
    
    candles.push({
      time: now - (count - i) * interval,
      open,
      high,
      low,
      close
    });
    currentPrice = close;
  }
  return candles;
};

export const analyzeSMC = (candles: Candle[], asset: Asset, timeframe: Timeframe) => {
  const obs: OrderBlock[] = [];
  const fvgs: FairValueGap[] = [];
  const structure: MarketStructure[] = [];

  // Simple OB detection: Bearish candle before a strong move up
  for (let i = 2; i < candles.length - 2; i++) {
    const c1 = candles[i-1];
    const c2 = candles[i];
    const c3 = candles[i+1];

    // Buy OB
    if (c1.close < c1.open && c2.close > c2.open && c3.close > c2.high) {
      obs.push({
        id: `ob-buy-${i}`,
        asset,
        timeframe,
        type: 'BUY',
        low: c1.low,
        high: c1.high,
        ageCandles: candles.length - i,
        status: 'active'
      });
    }

    // FVG detection
    if (candles[i].low > candles[i-2].high) {
      fvgs.push({
        id: `fvg-buy-${i}`,
        asset,
        timeframe,
        type: 'BUY',
        low: candles[i-2].high,
        high: candles[i].low,
        status: 'active'
      });
    } else if (candles[i].high < candles[i-2].low) {
      fvgs.push({
        id: `fvg-sell-${i}`,
        asset,
        timeframe,
        type: 'SELL',
        low: candles[i].high,
        high: candles[i-2].low,
        status: 'active'
      });
    }
  }

  // D1 Bias logic
  const lastClose = candles[candles.length - 1].close;
  const avg = candles.slice(-100).reduce((acc, c) => acc + c.close, 0) / 100;
  const d1Bias: BiasDirection = lastClose > avg * 1.002 ? 'BUY' : lastClose < avg * 0.998 ? 'SELL' : 'NEUTRAL';

  // Premium/Discount
  const recent = candles.slice(-20);
  const high = Math.max(...recent.map(c => c.high));
  const low = Math.min(...recent.map(c => c.low));
  const premiumPct = ((lastClose - low) / (high - low)) * 100;

  return { obs, fvgs, structure, d1Bias, premiumPct, atr: (high - low) / 10 };
};