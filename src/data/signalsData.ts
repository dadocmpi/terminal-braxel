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
    confidence: 88,
    type_code: 'A',
    lot_size: 0.82,
    gate: {
      stop_hunt: true,
      choch: true,
      of_aligned: true,
      pillars_count: 3
    },
    manipulation: {
      stop_hunt: true,
      stop_hunt_pips: 5.2,
      wyckoff_pattern: 'SPRING',
      fixing_window: 'NY_OPEN',
      score_bonus: 30
    },
    checklist: {
      d1_aligned: true,
      htf_aligned: true,
      zone_touched: true,
      of_confirmed: true,
      m1_candle: true,
      premium_ok: true
    }
  },
  signals: [
    { id: '1', time: '2024-05-20T10:00:00Z', asset: 'GBPUSD', direction: 'SELL', zone: 'H1 OB', entry: 1.27450, sl: 1.27600, tp1: 1.27100, rr: 2.3, confidence: 82, status: 'WIN', pips: 35 },
    { id: '2', time: '2024-05-19T15:30:00Z', asset: 'USDCAD', direction: 'BUY', zone: 'M15 FVG', entry: 1.36550, sl: 1.36400, tp1: 1.36850, rr: 1.7, confidence: 76, status: 'LOSS', pips: -15 }
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
      { id: 'l1', time: '10:45:22', type: 'signal', message: 'New signal detected: EURUSD BUY @ 1.08542', isToday: true },
      { id: 'l2', time: '10:42:10', type: 'touch', message: 'Price touched M15 Order Block on GBPUSD', isToday: true },
      { id: 'l3', time: '10:35:00', type: 'scan', message: 'Scanning Market: 7 active pairs, 0.4ms latency', isToday: true }
    ]
  }
};