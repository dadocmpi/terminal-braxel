export type Asset = 'EURUSD' | 'GBPUSD' | 'USDCAD' | 'USDJPY' | 'AUDUSD' | 'GBPJPY' | 'EURGBP' | 'NZDUSD';
export type Timeframe = 'D1' | 'H4' | 'H1' | 'M15' | 'M5' | 'M1';
export type BiasDirection = 'BUY' | 'SELL' | 'NEUTRAL';
export type MarketSession = 'LONDON' | 'NEW_YORK' | 'TOKYO' | 'CLOSE';

export const SESSION_ASSETS: Record<MarketSession, Asset[]> = {
  LONDON: ['EURUSD', 'GBPUSD', 'GBPJPY', 'EURGBP'],
  NEW_YORK: ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD'],
  TOKYO: ['USDJPY', 'GBPJPY', 'AUDUSD', 'NZDUSD'],
  CLOSE: ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD']
};

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type SignalType = 'A' | 'B' | 'C';

export interface ActiveSignal {
  asset: Asset;
  direction: 'BUY' | 'SELL';
  type: SignalType;
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  sl_pips: number;
  tp1_pips: number;
  tp2_pips: number;
  rr: number;
  confidence: number;
  status: 'PENDING' | 'WIN' | 'LOSS';
  confluences: string[];
  created_at: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  type: 'signal' | 'touch' | 'scan' | 'info' | 'warning';
  message: string;
  isToday: boolean;
}

export interface SignalsData {
  last_updated: string;
  active_signal: ActiveSignal | null;
  signals: any[];
  market_context: {
    pairs: any[];
    activity_log: ActivityLog[];
  };
}