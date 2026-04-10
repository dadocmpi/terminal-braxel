import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData, ActiveSignal } from '../types/trading';
import { generateMockCandles, analyzeWSBot } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';
import { playAlertSound } from '../utils/audio';

interface TradingContextType {
  asset: Asset;
  setAsset: (a: Asset) => void;
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  candles: Candle[];
  obs: OrderBlock[];
  fvgs: FairValueGap[];
  structure: MarketStructure[];
  d1Bias: BiasDirection;
  premiumPct: number;
  activeSignal: ActiveSignal | null;
  signalsData: SignalsData;
  isLoading: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [asset, setAsset] = useState<Asset>('EURUSD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M1');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<any>({ obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const basePrice = asset === 'XAUUSD' ? 2300 : asset === 'USDJPY' || asset === 'GBPJPY' ? 150 : 1.08500;
      const newCandles = generateMockCandles(200, basePrice);
      const result = analyzeWSBot(newCandles, asset, timeframe);
      
      setCandles(newCandles);
      setAnalysis(result);
      setIsLoading(false);

      // Alerta sonoro se um novo sinal Tipo A ou B for detectado
      if (result.activeSignal && (result.activeSignal.type_code === 'A' || result.activeSignal.type_code === 'B')) {
        playAlertSound(result.activeSignal.type_code === 'A' ? 'critical' : 'success');
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [asset, timeframe]);

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe, setTimeframe,
      candles,
      ...analysis,
      signalsData: mockSignalsData,
      isLoading
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};