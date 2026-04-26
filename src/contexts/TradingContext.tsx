import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot } from '../data/mockData';
import { fetchHistoricalData } from '../services/marketData';

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

const TWELVE_DATA_API_KEY = '65e9481bb8634db4b208afd0af073fdb';
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
    case 'LONDON': return { name: 'GBP INDEX', symbol: 'GBP/USD', fallbackPrice: 1.26 }; // Usando par real como proxy para o index se o index puro falhar
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

  const isMarketOpen = !isWeekend && currentSession !== 'CLOSE';

  // Carregamento do Índice - APENAS DADOS REAIS
  useEffect(() => {
    const config = getIndexConfig(currentSession);
    
    const loadIndexData = async () => {
      const candles = await fetchHistoricalData(config.symbol, '5min', TWELVE_DATA_API_KEY);
      if (candles && candles.length > 0) {
        setSessionIndex({ name: config.name, symbol: config.symbol, candles });
      } else {
        console.warn(`Não foi possível carregar dados reais para ${config.symbol}`);
        setSessionIndex(prev => ({ ...prev, candles: [] }));
      }
    };

    loadIndexData();
  }, [currentSession]);

  // Carregamento dos Pares - APENAS DADOS REAIS
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const initialData: Record<string, AssetData> = {};
      
      for (const a of ALL_OPERATED_ASSETS) {
        const candles = await fetchHistoricalData(a, '1min', TWELVE_DATA_API_KEY);
        if (candles && candles.length > 0) {
          const analysis = analyzeWSBot(candles, a, 'M1');
          initialData[a] = { candles, analysis, lastUpdate: Date.now() };
        }
      }
      
      setAllAssetsData(initialData);
      setIsLoading(false);
    };
    initData();
  }, []);

  const currentData = allAssetsData[asset] || { candles: [], analysis: { d1Bias: 'NEUTRAL', premiumPct: 50 } };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      candles: currentData.candles,
      d1Bias: isWeekend ? 'NEUTRAL' : currentData.analysis.d1Bias,
      premiumPct: isWeekend ? 50 : currentData.analysis.premiumPct,
      activeSignal: dbSignals.find(s => s.status === 'PENDING') || null,
      signalsData: {
        last_updated: new Date().toISOString(),
        active_signal: null,
        signals: dbSignals,
        market_context: { pairs: [], activity_log: [] }
      },
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen,
      isWeekend,
      allAssetsData,
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