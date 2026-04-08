export type Asset = 'EURUSD' | 'GBPUSD' | 'USDCAD' | 'XAUUSD' | 'USDJPY' | 'AUDUSD' | 'GBPJPY';
export type Timeframe = 'D1' | 'H4' | 'H1' | 'M15' | 'M5' | 'M1';
export type BiasDirection = 'BUY' | 'SELL' | 'NEUTRAL';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface OrderBlock {
  id: string;
  asset: Asset;
  timeframe: Timeframe;
  type: 'BUY' | 'SELL';
  low: number;
  high: number;
  ageCandles: number;
  status: 'active' | 'mitigated';
}

export interface FairValueGap {
  id: string;
  asset: Asset;
  timeframe: Timeframe;
  type: 'BUY' | 'SELL';
  low: number;
  high: number;
  status: 'active' | 'filled';
}

export interface MarketStructure {
  type: 'HH' | 'HL' | 'LH' | 'LL';
  price: number;
  candleIndex: number;
}

export interface SweepEvent {
  id: string;
  asset: Asset;
  level: number;
  spikePips: number;
  direction: 'BUY' | 'SELL';
  timestamp: string;
}

export interface SignalHistoryItem {
  id: string;
  time: string;
  asset: Asset;
  direction: 'BUY' | 'SELL';
  zone: string;
  entry: number;
  sl: number;
  tp1: number;
  rr: number;
  confidence: number;
  status: 'WIN' | 'LOSS' | 'PENDING';
  pips: number;
}

export interface ActiveSignal {
  asset: Asset;
  direction: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  sl_pips: number;
  tp1_pips: number;
  tp2_pips: number;
  rr: number;
  rr2: number;
  lot_size: number;
  session: string;
  zone_kind: string;
  zone_tf: string;
  zone_quality: string;
  zone_age: number;
  of_bull_pct: number;
  entry_pattern: string;
  confidence: number;
  d1_bias: BiasDirection;
  htf_bias: BiasDirection;
  premium_pct: number;
  pdh: number;
  pdl: number;
  liquidity_targets: { label: string; price: number; pips: number }[];
  checklist: {
    d1_aligned: boolean;
    htf_aligned: boolean;
    zone_touched: boolean;
    of_confirmed: boolean;
    m1_candle: boolean;
    premium_ok: boolean;
  };
  status: 'PENDING' | 'WIN' | 'LOSS';
}

export interface SignalsData {
  last_updated: string;
  active_signal: ActiveSignal | null;
  signals: SignalHistoryItem[];
  market_context: {
    pairs: { asset: Asset; bias: BiasDirection; premium: number; zones: { buy: number; sell: number } }[];
    activity_log: { id: string; time: string; type: 'signal' | 'touch' | 'scan' | 'info' | 'warning'; message: string }[];
  };
}

export const PIP_VALUES: Record<Asset, number> = {
  EURUSD: 10,
  GBPUSD: 10,
  USDCAD: 7.5,
  XAUUSD: 10,
  USDJPY: 6.5,
  AUDUSD: 10,
  GBPJPY: 6.5
};