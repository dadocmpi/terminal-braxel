import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
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
  currentSession: MarketSession;
  activeAssets: Asset[];
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const getMarketSession = (): MarketSession => {
  const hour = new Date().getUTCHours();
  
  if (hour >= 22 || hour < 7) return 'SYDNEY';
  if (hour >= 0 && hour < 9) return 'TOKYO';
  if (hour >= 8 && hour < 17) return 'LONDON';
  if (hour >= 13 && hour < 22) return 'NEW_YORK';
  
  return 'CLOSE';
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<MarketSession>(getMarketSession());
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession]);
  const [asset, setAsset] = useState<Asset>(activeAssets[0] || 'EURUSD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M1');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<any>({ obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null });
  const [isLoading, setIsLoading] = useState(true);

  // Timer para verificar sessão a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const session = getMarketSession();
      if (session !== currentSession) {
        setCurrentSession(session);
        const newAssets = SESSION_ASSETS[session];
        setActiveAssets(newAssets);
        if (!newAssets.includes(asset)) {
          setAsset(newAssets[0] || 'EURUSD');
        }
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentSession, asset]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const basePrice = asset === 'XAUUSD' ? 2300 : asset === 'USDJPY' || asset === 'GBPJPY' ? 150 : 1.08500;
      const newCandles = generateMockCandles(200, basePrice);
      const result = analyzeWSBot(newCandles, asset, timeframe);
      
      setCandles(newCandles);
      setAnalysis(result);
      setIsLoading(false);

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
      isLoading,
      currentSession,
      activeAssets
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