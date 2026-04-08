import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData } from '../types/trading';
import { generateMockCandles, analyzeSMC } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';

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
  atr: number;
  signalsData: SignalsData;
  isLoading: boolean;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [asset, setAsset] = useState<Asset>('EURUSD');
  const [timeframe, setTimeframe] = useState<Timeframe>('H1');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<any>({ obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, atr: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    const timer = setTimeout(() => {
      const basePrice = asset === 'XAUUSD' ? 2300 : asset === 'USDJPY' || asset === 'GBPJPY' ? 150 : 1.1;
      const newCandles = generateMockCandles(200, basePrice);
      setCandles(newCandles);
      setAnalysis(analyzeSMC(newCandles, asset, timeframe));
      setIsLoading(false);
    }, 500);
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