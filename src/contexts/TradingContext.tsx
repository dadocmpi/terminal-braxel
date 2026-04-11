import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';
import { playAlertSound } from '../utils/audio';

// NOTA: Substitua 'demo' pela sua API Key da Twelve Data para evitar limites
const API_KEY = 'demo'; 

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
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  if (day === 6) return false;
  if (day === 5 && hour >= 21) return false;
  if (day === 0 && hour < 21) return false;
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

  const fetchRealData = async () => {
    if (!isMarketOpen) return;
    
    try {
      const symbol = asset === 'XAUUSD' ? 'XAU/USD' : asset.slice(0,3) + '/' + asset.slice(3);
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=100&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.values) {
        const formattedCandles: Candle[] = data.values.map((v: any) => ({
          time: new Date(v.datetime).getTime() / 1000,
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close),
          volume: parseFloat(v.volume || '0')
        })).reverse();

        setCandles(formattedCandles);
        const result = analyzeWSBot(formattedCandles, asset, timeframe);
        setAnalysis(result);
        
        if (result.activeSignal && !analysis.activeSignal) {
          playAlertSound('success');
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados reais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 60000); // Atualiza a cada minuto (limite da API free)
    return () => clearInterval(interval);
  }, [asset, timeframe, isMarketOpen]);

  useEffect(() => {
    const sessionInterval = setInterval(() => {
      setIsMarketOpen(checkIsMarketOpen());
      const session = getMarketSession();
      if (session !== currentSession) {
        setCurrentSession(session);
        setActiveAssets(SESSION_ASSETS[session]);
      }
    }, 10000);
    return () => clearInterval(sessionInterval);
  }, [currentSession]);

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