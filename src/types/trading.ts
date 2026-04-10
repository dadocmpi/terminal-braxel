export type Asset = 'EURUSD' | 'GBPUSD' | 'USDCAD' | 'XAUUSD' | 'USDJPY' | 'AUDUSD' | 'GBPJPY' | 'EURGBP';
export type Timeframe = 'D1' | 'H4' | 'H1' | 'M15' | 'M5' | 'M1';
export type BiasDirection = 'BUY' | 'SELL' | 'NEUTRAL';
export type MarketSession = 'SYDNEY' | 'TOKYO' | 'LONDON' | 'NEW_YORK' | 'CLOSE';

export const SESSION_ASSETS: Record<MarketSession, Asset[]> = {
  SYDNEY: ['AUDUSD', 'USDJPY'],
  TOKYO: ['USDJPY', 'GBPJPY', 'AUDUSD'],
  LONDON: ['EURUSD', 'GBPUSD', 'EURGBP', 'GBPJPY'],
  NEW_YORK: ['EURUSD', 'GBPUSD', 'USDCAD', 'XAUUSD'],
  CLOSE: []
};

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
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
  institutional_score: number;
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
  type: 'HH' | 'HL' | 'LH' | 'LL' | 'BOS' | 'CHoCH';
  price: number;
  time: number;
}

export interface BankManipulation {
  stop_hunt: boolean;
  stop_hunt_pips: number;
  wyckoff_pattern: string;
  fixing_window: string;
  score_bonus: number;
}

export interface ConfirmationGate {
  stop_hunt: boolean;
  choch: boolean;
  of_aligned: boolean;
  pillars_count: number;
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
  confidence: number;
  type_code: 'A' | 'B' | 'C' | 'D';
  gate: ConfirmationGate;
  manipulation: BankManipulation;
  checklist: {
    d1_aligned: boolean;
    htf_aligned: boolean;
    zone_touched: boolean;
    of_confirmed: boolean;
    m1_candle: boolean;
    premium_ok: boolean;
  };
}

export interface SignalsData {
  last_updated: string;
  active_signal: ActiveSignal | null;
  market_context: {
    pairs: { asset: Asset; bias: BiasDirection; premium: number; zones: { buy: number; sell: number } }[];
    activity_log: { id: string; time: string; type: 'signal' | 'touch' | 'scan' | 'info' | 'warning'; message: string }[];
  };
}