import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, ActivityLog } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';
import { supabase } from '../lib/supabase';

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

const getSessionAssets = (session: MarketSession): Asset[] => {
  switch(session) {
    case 'NEW_YORK': return ['EURUSD', 'GBPUSD', 'USDCAD'];
    case 'LONDON': return ['EURUSD', 'GBPUSD', 'EURGBP'];
    case 'TOKYO': return ['USDJPY', 'GBPJPY', 'AUDUSD'];
    default: return ['EURUSD', 'GBPUSD', 'USDJPY'];
  }
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession] = useState<MarketSession>(getMarketSession());
  const [activeAssets] = useState<Asset[]>(getSessionAssets(currentSession));
  const [asset, setAsset] = useState<Asset>(activeAssets[0]);
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState({ buyers: 50, sellers: 50 });
  
  // Agregadores Reais
  const [d1Bias, setD1Bias] = useState<BiasDirection>('NEUTRAL');
  const [premiumPct, setPremiumPct] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      const newData: Record<string, AssetData> = {};
      let totalPremium = 0;
      let buyCount = 0;
      let sellCount = 0;

      for (const a of activeAssets) {
        // Aqui no futuro substituiremos por: await fetchRealData(a)
        const candles = generateMockCandles(100, a.includes('JPY') ? 150 : 1.1);
        const analysis = analyzeWSBot(candles, a, 'M1');
        
        newData[a] = { candles, analysis, lastUpdate: Date.now() };
        
        totalPremium += analysis.premiumPct;
        if (analysis.d1Bias === 'BUY') buyCount++;
        if (analysis.d1Bias === 'SELL') sellCount++;
      }

      // Cálculo da Média da Sessão (Profissional)
      setPremiumPct(totalPremium / activeAssets.length);
      if (buyCount > sellCount) setD1Bias('BUY');
      else if (sellCount > buyCount) setD1Bias('SELL');
      else setD1Bias('NEUTRAL');

      setAllAssetsData(newData);
      setIsLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Atualização profissional a cada 10s
    return () => clearInterval(interval);
  }, [activeAssets]);

  const currentData = allAssetsData[asset] || { 
    candles: [], 
    analysis: { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null }
  };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe: 'M1', setTimeframe: () => {},
      candles: currentData.candles,
      d1Bias,
      premiumPct,
      activeSignal: currentData.analysis.activeSignal,
      signalsData: mockSignalsData,
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen: currentSession !== 'CLOSE',
      allAssetsData,
      marketSentiment,
      sessionIndex: { name: 'DXY', candles: generateMockCandles(100, 104.5) }
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