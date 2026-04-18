import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS, ActivityLog } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';
import { playAlertSound } from '../utils/audio';

interface AssetData {
  candles: Candle[];
  analysis: any;
  lastUpdate: number;
}

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
  allAssetsData: Record<string, AssetData>;
  marketSentiment: { buyers: number; sellers: number };
  sessionIndex: { name: string; candles: Candle[] };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const getMarketSession = (): MarketSession => {
  const now = new Date();
  const isWeekend = now.getUTCDay() === 6 || now.getUTCDay() === 0;
  if (isWeekend) return 'CLOSE';
  const hour = now.getUTCHours();
  if (hour >= 8 && hour <= 16) return 'NEW_YORK';
  if (hour >= 0 && hour <= 8) return 'TOKYO';
  return 'LONDON';
};

const getSessionIndexName = (session: MarketSession) => {
  switch(session) {
    case 'NEW_YORK': return 'DXY (USD INDEX)';
    case 'LONDON': return 'EXY (EUR INDEX)';
    case 'TOKYO': return 'JXY (JPY INDEX)';
    default: return 'DXY (USD INDEX)';
  }
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [currentSession, setCurrentSession] = useState<MarketSession>(getMarketSession());
  const [activeAssets] = useState<Asset[]>(['EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY']);
  const [asset, setAsset] = useState<Asset>('EURUSD');
  const [timeframe] = useState<Timeframe>('M1');
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState({ buyers: 50, sellers: 50 });
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({ 
    name: getSessionIndexName(currentSession), 
    candles: generateMockCandles(100, 104.5) 
  });
  
  const [signalHistory, setSignalHistory] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockSignalsData.market_context.activity_log);
  const [activeSignal, setActiveSignal] = useState<ActiveSignal | null>(null);
  
  const lastSignalIdRef = useRef<string>("");

  const addLog = (type: ActivityLog['type'], message: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      type,
      message,
      isToday: true
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const buyers = 40 + Math.random() * 20;
      setMarketSentiment({ buyers, sellers: 100 - buyers });
      
      setSessionIndex(prev => {
        const lastCandle = { ...prev.candles[prev.candles.length - 1] };
        lastCandle.close += (Math.random() - 0.5) * 0.01;
        const newCandles = [...prev.candles];
        newCandles[newCandles.length - 1] = lastCandle;
        return { ...prev, candles: newCandles };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const newData: Record<string, AssetData> = {};
      for (const a of activeAssets) {
        const candles = generateMockCandles(100, a.includes('JPY') ? 150 : 1.1);
        newData[a] = { candles, analysis: analyzeWSBot(candles, a, 'M1'), lastUpdate: Date.now() };
      }
      setAllAssetsData(newData);
      setIsLoading(false);
    };
    fetchAll();
  }, [activeAssets]);

  const currentData = allAssetsData[asset] || { 
    candles: [], 
    analysis: { obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null },
    lastUpdate: 0 
  };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe, setTimeframe: () => {},
      candles: currentData.candles,
      ...currentData.analysis,
      activeSignal,
      signalsData: {
        ...mockSignalsData,
        signals: signalHistory,
        market_context: {
          ...mockSignalsData.market_context,
          activity_log: activityLogs
        }
      },
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen,
      allAssetsData,
      marketSentiment,
      sessionIndex
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