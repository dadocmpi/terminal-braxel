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
  const [marketSentiment, setMarketSentiment] = useState({ buyers: 52, sellers: 48 });
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: 'DXY INDEX',
    candles: generateMockCandles(100, 104.5)
  });
  
  const [d1Bias, setD1Bias] = useState<BiasDirection>('NEUTRAL');
  const [premiumPct, setPremiumPct] = useState(50);

  // 1. Inicialização de Dados
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

  // 2. Feed de 1 Segundo para o INDEX (DXY)
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionIndex(prev => {
        const lastCandle = prev.candles[prev.candles.length - 1];
        const nextCandle = generateNextCandle(lastCandle, 1);
        return {
          ...prev,
          candles: [...prev.candles.slice(-199), nextCandle]
        };
      });

      // Simular variação de sentimento
      setMarketSentiment(prev => ({
        buyers: Math.max(30, Math.min(70, prev.buyers + (Math.random() - 0.5) * 2)),
        sellers: 100 - (prev.buyers + (Math.random() - 0.5) * 2)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Atualização de Ativos (Incremental a cada 10s para análise pesada)
  useEffect(() => {
    const interval = setInterval(() => {
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