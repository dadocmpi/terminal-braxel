import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isMarketOpen: boolean;
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

const checkIsMarketOpen = () => {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Domingo, 6 = Sábado
  const hour = now.getUTCHours();

  // Mercado fecha Sexta às 21:00 UTC e abre Domingo às 21:00 UTC
  if (day === 6) return false; // Sábado fechado
  if (day === 5 && hour >= 21) return false; // Sexta noite fechado
  if (day === 0 && hour < 21) return false; // Domingo manhã fechado
  
  return true;
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(checkIsMarketOpen());
  const [currentSession, setCurrentSession] = useState<MarketSession>(getMarketSession());
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession]);
  const [asset, setAsset] = useState<Asset>(activeAssets[0] || 'EURUSD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M1');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [analysis, setAnalysis] = useState<any>({ obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null });
  const [isLoading, setIsLoading] = useState(true);

  // Atualiza o estado do mercado e sessão
  useEffect(() => {
    const interval = setInterval(() => {
      setIsMarketOpen(checkIsMarketOpen());
      const session = getMarketSession();
      if (session !== currentSession) {
        setCurrentSession(session);
        const newAssets = SESSION_ASSETS[session];
        setActiveAssets(newAssets);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentSession]);

  // Carregamento inicial de dados
  useEffect(() => {
    if (!isMarketOpen) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const basePrice = asset === 'XAUUSD' ? 2345.50 : asset === 'USDJPY' || asset === 'GBPJPY' ? 154.20 : 1.08540;
      const initialCandles = generateMockCandles(200, basePrice);
      setCandles(initialCandles);
      setAnalysis(analyzeWSBot(initialCandles, asset, timeframe));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [asset, timeframe, isMarketOpen]);

  // Simulação de Ticks em Tempo Real (Atualiza o preço a cada segundo)
  useEffect(() => {
    if (!isMarketOpen || candles.length === 0 || isLoading) return;

    const tickInterval = setInterval(() => {
      setCandles(prev => {
        const last = { ...prev[prev.length - 1] };
        const change = (Math.random() - 0.5) * (last.close * 0.0001);
        last.close += change;
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        
        const newCandles = [...prev.slice(0, -1), last];
        
        // Re-analisar a cada 5 ticks para performance
        if (Math.random() > 0.8) {
          const result = analyzeWSBot(newCandles, asset, timeframe);
          setAnalysis(result);
          if (result.activeSignal && !analysis.activeSignal) {
            playAlertSound('success');
          }
        }
        
        return newCandles;
      });
    }, 1000);

    return () => clearInterval(tickInterval);
  }, [isMarketOpen, candles.length, isLoading, asset, timeframe]);

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe, setTimeframe,
      candles,
      ...analysis,
      signalsData: mockSignalsData,
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen
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