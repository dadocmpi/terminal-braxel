import { SignalsData } from '../types/trading';

export const mockSignalsData: SignalsData = {
  last_updated: new Date().toISOString(),
  active_signal: {
    asset: 'EURUSD',
    direction: 'BUY',
    entry: 1.08542,
    sl: 1.08420,
    tp1: 1.08850,
    tp2: 1.09200,
    sl_pips: 12.2,
    tp1_pips: 30.8,
    tp2_pips: 65.8,
    rr: 2.52,
    rr2: 5.39,
    lot_size: 8.2,
    session: 'LONDON',
    zone_kind: 'ORDER BLOCK',
    zone_tf: 'M15',
    zone_quality: 'HIGH',
    zone_age: 14,
    of_bull_pct: 78,
    entry_pattern: 'MSS + FVG',
    confidence: 88,
    d1_bias: 'BUY',
    htf_bias: 'BUY',
    premium_pct: 12,
    pdh: 1.09100,
    pdl: 1.08200,
    liquidity_targets: [
      { label: 'PDH', price: 1.09100, pips: 55.8 },
      { label: 'H4 FVG', price: 1.08950, pips: 40.8 }
    ],
    checklist: {
      d1_aligned: true,
      htf_aligned: true,
      zone_touched: true,
      of_confirmed: true,
      m1_candle: true,
      premium_ok: true
    },
    status: 'PENDING'
  },
  signals: [
    { id: '1', time: '2024-05-20T10:00:00Z', asset: 'GBPUSD', direction: 'SELL', zone: 'H1 OB', entry: 1.27450, sl: 1.27600, tp1: 1.27100, rr: 2.3, confidence: 82, status: 'WIN', pips: 35 },
    { id: '2', time: '2024-05-19T15:30:00Z', asset: 'XAUUSD', direction: 'BUY', zone: 'M15 FVG', entry: 2345.50, sl: 2340.00, tp1: 2355.00, rr: 1.7, confidence: 76, status: 'LOSS', pips: -55 }
  ],
  market_context: {
    pairs: [
      { asset: 'EURUSD', bias: 'BUY', premium: 15, zones: { buy: 2, sell: 1 } },
      { asset: 'GBPUSD', bias: 'SELL', premium: 85, zones: { buy: 1, sell: 3 } },
      { asset: 'USDCAD', bias: 'SELL', premium: 78, zones: { buy: 1, sell: 2 } },
      { asset: 'USDJPY', bias: 'NEUTRAL', premium: 50, zones: { buy: 1, sell: 1 } },
      { asset: 'AUDUSD', bias: 'SELL', premium: 92, zones: { buy: 0, sell: 2 } },
      { asset: 'GBPJPY', bias: 'BUY', premium: 20, zones: { buy: 3, sell: 0 } },
      { asset: 'EURGBP', bias: 'BUY', premium: 10, zones: { buy: 2, sell: 0 } }
    ],
    activity_log: [
      { id: 'l1', time: '10:45:22', type: 'signal', message: 'New signal detected: EURUSD BUY @ 1.08542' },
      { id: 'l2', time: '10:42:10', type: 'touch', message: 'Price touched M15 Order Block on GBPUSD' },
      { id: 'l3', time: '10:35:00', type: 'scan', message: 'Scanning Market: 7 active pairs, 0.4ms latency' }
    ]
  }
};