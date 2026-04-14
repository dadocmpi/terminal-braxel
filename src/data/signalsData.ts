import { SignalsData } from '../types/trading';

export const mockSignalsData: SignalsData = {
  last_updated: new Date().toISOString(),
  active_signal: null,
  signals: [], // Cleared mock history
  market_context: {
    pairs: [
      { asset: 'EURUSD', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'GBPUSD', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'USDCAD', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'USDJPY', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'AUDUSD', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'GBPJPY', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } },
      { asset: 'EURGBP', bias: 'NEUTRAL', premium: 50, zones: { buy: 0, sell: 0 } }
    ],
    activity_log: [
      { id: 'l1', time: new Date().toLocaleTimeString(), type: 'scan', message: 'System initialized. Monitoring institutional flow...', isToday: true }
    ]
  }
};