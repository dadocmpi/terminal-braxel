import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Timeframe, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession } from '../types/trading';
import { analyzeWSBot, generateMockCandles, generateNextCandle } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';

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
  if (hour >= 17 && hour <= 23) return 'CLOSE';
  return 'LONDON';
};

const getIndexConfig = (session: MarketSession) => {
  switch(session) {
    case 'NEW_YORK': return { name: 'DXY INDEX', base: 104.5 };
    case 'LONDON': return { name: 'BXY INDEX', base: 126.2 };
    case 'TOKYO': return { name: 'JXY INDEX', base: 92.4 };
    default: return { name: 'DXY INDEX', base: 104.5 };
  }
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
  
  const indexConfig = getIndexConfig(currentSession);
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: indexConfig.name,
    candles: generateMockCandles(100, indexConfig.base)
  });
  
  const [d1Bias, setD1Bias] = useState<BiasDirection>('NEUTRAL');
  const [premiumPct, setPremiumPct] = useState(50);
  const isMarketOpen = currentSession !== 'CLOSE';

  useEffect(() => {
    const initialData: Record<string, AssetData> = {};
    for (const a of activeAssets) {
      const candles = generateMockCandles(100, a.includes('JPY') ? 150 : 1.1);
      const analysis = analyzeWSBot(candles, a, 'M1');
      initialData[a] = { candles, analysis, lastUpdate: Date.now() };
    }
    setAllAssetsData(initialData);
    setIsLoading(false);
  }, [activeAssets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionIndex(prev => {
        const lastCandle = prev.candles[prev.candles.length - 1];
        const nextCandle = generateNextCandle(lastCandle, 1);
        
        const change = nextCandle.close - lastCandle.close;
        setMarketSentiment(s => {
          const shift = change * 100;
          const newBuyers = Math.max(10, Math.min(90, s.buyers - shift));
          return { buyers: newBuyers, sellers: 100 - newBuyers };
        });

        return {
          ...prev,
          candles: [...prev.candles.slice(-199), nextCandle]
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMarketOpen) {
        setD1Bias('NEUTRAL');
        setPremiumPct(50);
        return;
      }

      setAllAssetsData(prev => {
        const newData = { ...prev };
        let totalPremium = 0;
        let buyCount = 0;
        let sellCount = 0;

        for (const a of activeAssets) {
          if (!newData[a]) continue;
          const lastCandle = newData[a].candles[newData[a].candles.length - 1];
          const nextCandle = generateNextCandle(lastCandle, 10);
          const updatedCandles = [...newData[a].candles.slice(-99), nextCandle];
          const analysis = analyzeWSBot(updatedCandles, a, 'M1');
          
          newData[a] = { candles: updatedCandles, analysis, lastUpdate: Date.now() };
          
          totalPremium += analysis.premiumPct;
          if (analysis.d1Bias === 'BUY') buyCount++;
          if (analysis.d1Bias === 'SELL') sellCount++;
        }

        setPremiumPct(totalPremium / activeAssets.length);
        if (buyCount > sellCount) setD1Bias('BUY');
        else if (sellCount > buyCount) setD1Bias('SELL');
        else setD1Bias('NEUTRAL');

        return newData;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activeAssets, isMarketOpen]);

  const currentData = allAssetsData[asset] || { 
    candles: [], 
    analysis: { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null }
  };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe: 'M1', setTimeframe: () => {},
      candles: currentData.candles,
      d1Bias: isMarketOpen ? d1Bias : 'NEUTRAL',
      premiumPct: isMarketOpen ? premiumPct : 50,
      activeSignal: isMarketOpen ? currentData.analysis.activeSignal : null,
      signalsData: mockSignalsData,
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