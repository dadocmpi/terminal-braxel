import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot } from '../data/mockData';
import { fetchHistoricalData, analyzeInstitutionalStrategy } from '../services/marketData';

interface AssetData {
  candles: Candle[];
  analysis: any;
  lastUpdate: number;
}

interface TradingContextType {
  asset: Asset;
  setAsset: (a: Asset) => void;
  candles: Candle[];
  d1Bias: BiasDirection;
  premiumPct: number;
  activeSignal: ActiveSignal | null;
  signalsData: SignalsData;
  isLoading: boolean;
  currentSession: MarketSession;
  activeAssets: Asset[];
  isMarketOpen: boolean;
  isWeekend: boolean;
  allAssetsData: Record<string, AssetData>;
  sessionIndex: { name: string; symbol: string; candles: Candle[] };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const TWELVE_DATA_API_KEY = 'a143c6507d1c49e08fe640980f18b2d8';
const ALL_OPERATED_ASSETS: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD'];

const getSession = (): MarketSession => {
  const now = new Date();
  const day = now.getDay();
  if (day === 0 || day === 6) return 'CLOSE';
  
  const nyTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).formatToParts(now);
  const hour = parseInt(nyTime.find(p => p.type === 'hour')?.value || '0');
  
  if (hour >= 5 && hour < 8) return 'LONDON';
  if (hour >= 8 && hour < 11) return 'NEW_YORK';
  if (hour >= 11 && hour < 14) return 'TOKYO';
  return 'CLOSE';
};

const getIndexConfig = (session: MarketSession) => {
  switch (session) {
    case 'LONDON': return { name: 'GBP INDEX', symbol: 'GBP/USD', fallbackPrice: 1.26 };
    case 'NEW_YORK': return { name: 'US DOLLAR INDEX', symbol: 'DXY', fallbackPrice: 104.00 };
    case 'TOKYO': return { name: 'YEN INDEX', symbol: 'USD/JPY', fallbackPrice: 150.00 };
    default: return { name: 'NASDAQ 100', symbol: 'QQQ', fallbackPrice: 440.00 };
  }
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<MarketSession>(getSession());
  const [isWeekend, setIsWeekend] = useState(new Date().getDay() === 0 || new Date().getDay() === 6);
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession]);
  const [asset, setAsset] = useState<Asset>(activeAssets[0] || 'EURUSD');
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [dbSignals, setDbSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionIndex, setSessionIndex] = useState<{ name: string; symbol: string; candles: Candle[] }>({
    name: getIndexConfig(currentSession).name,
    symbol: getIndexConfig(currentSession).symbol,
    candles: []
  });

  const updateAllData = async () => {
    const newData: Record<string, AssetData> = {};
    
    for (const symbol of ALL_OPERATED_ASSETS) {
      const candles = await fetchHistoricalData(symbol, '15min', TWELVE_DATA_API_KEY);
      if (candles.length > 0) {
        const institutionalSignal = analyzeInstitutionalStrategy(candles, symbol);
        const botAnalysis = analyzeWSBot(candles, symbol);
        
        newData[symbol] = {
          candles,
          analysis: institutionalSignal || botAnalysis,
          lastUpdate: Date.now()
        };

        if (institutionalSignal && institutionalSignal.status === 'ACTIVE') {
           setDbSignals(prev => {
             const exists = prev.find(s => s.asset === symbol && s.time === institutionalSignal.time);
             if (!exists) return [institutionalSignal, ...prev].slice(0, 20);
             return prev;
           });
        }
      }
    }
    
    const idxConfig = getIndexConfig(currentSession);
    const idxCandles = await fetchHistoricalData(idxConfig.symbol, '15min', TWELVE_DATA_API_KEY);
    setSessionIndex(prev => ({ ...prev, candles: idxCandles }));
    
    setAllAssetsData(newData);
    setIsLoading(false);
  };

  useEffect(() => {
    updateAllData();
    const interval = setInterval(updateAllData, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, [currentSession]);

  const currentData = allAssetsData[asset] || { candles: [], analysis: null };

  const value = {
    asset,
    setAsset,
    candles: currentData.candles,
    d1Bias: currentData.analysis?.direction || 'NEUTRAL',
    premiumPct: 50,
    activeSignal: currentData.analysis,
    signalsData: {
      daily: { bias: currentData.analysis?.direction || 'NEUTRAL', strength: 80 },
      h4: { bias: 'NEUTRAL', strength: 50 },
      h1: { bias: 'NEUTRAL', strength: 50 }
    },
    isLoading,
    currentSession,
    activeAssets,
    isMarketOpen: currentSession !== 'CLOSE',
    isWeekend,
    allAssetsData,
    sessionIndex
  };

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};
