import { SignalsData } from '../types/trading';

export const mockSignalsData: SignalsData = {
  last_updated: new Date().toISOString(),
  active_signal: null, // Resetting active signal
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
      { id: 'l3', time: new Date().toLocaleTimeString(), type: 'scan', message: 'Scanning Market: 7 active pairs, 0.4ms latency', isToday: true }
    ]
  }
};