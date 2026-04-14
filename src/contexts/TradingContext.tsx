import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Timeframe, Candle, OrderBlock, FairValueGap, MarketStructure, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { mockSignalsData } from '../data/signalsData';
import { playAlertSound } from '../utils/audio';

const API_KEY = 'demo'; 

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
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const getMarketSession = (): MarketSession => {
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false
  }).format(new Date());
  
  const hour = parseInt(nyTime);

  if (hour >= 5 && hour < 8) return 'LONDON';
  if (hour >= 8 && hour < 11) return 'NEW_YORK';
  if (hour >= 11 && hour < 14) return 'TOKYO';
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
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchQueue = useRef<Asset[]>([]);
  const isFetching = useRef(false);

  const fetchAssetData = async (targetAsset: Asset) => {
    try {
      const symbol = targetAsset.slice(0,3) + '/' + targetAsset.slice(3);
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&outputsize=100&apikey=${API_KEY}`
      );
      const data = await response.json();
      
      let formattedCandles: Candle[] = [];

      if (data.values) {
        formattedCandles = data.values.map((v: any) => ({
          time: new Date(v.datetime).getTime() / 1000,
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close),
          volume: parseFloat(v.volume || '0')
        })).reverse();
      } else {
        const basePrice = targetAsset.includes('JPY') ? 150 : 1.1;
        formattedCandles = generateMockCandles(100, basePrice);
      }

      const analysis = analyzeWSBot(formattedCandles, targetAsset, 'M1');
      
      setAllAssetsData(prev => ({
        ...prev,
        [targetAsset]: {
          candles: formattedCandles,
          analysis,
          lastUpdate: Date.now()
        }
      }));

      if (targetAsset === asset && analysis.activeSignal) {
        playAlertSound('success');
      }
    } catch (error) {
      console.error(`Error fetching ${targetAsset}:`, error);
    }
  };

  const processQueue = async () => {
    if (isFetching.current || fetchQueue.current.length === 0) return;
    
    isFetching.current = true;
    const nextAsset = fetchQueue.current.shift();
    
    if (nextAsset) {
      await fetchAssetData(nextAsset);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    isFetching.current = false;
    if (fetchQueue.current.length > 0) {
      processQueue();
    }
  };

  // Simulador de Ticks (Movimentação em tempo real)
  useEffect(() => {
    if (!isMarketOpen) return;

    const tickInterval = setInterval(() => {
      setAllAssetsData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(key => {
          const assetData = newData[key];
          if (assetData.candles.length === 0) return;

          const lastIndex = assetData.candles.length - 1;
          const lastCandle = { ...assetData.candles[lastIndex] };
          
          // Pequena variação aleatória (0.001% a 0.005%)
          const volatility = key.includes('JPY') ? 0.01 : 0.00005;
          const change = (Math.random() - 0.5) * volatility;
          
          lastCandle.close += change;
          if (lastCandle.close > lastCandle.high) lastCandle.high = lastCandle.close;
          if (lastCandle.close < lastCandle.low) lastCandle.low = lastCandle.close;

          const newCandles = [...assetData.candles];
          newCandles[lastIndex] = lastCandle;
          
          // Re-analisa com o novo preço para atualizar sinais e bias
          const newAnalysis = analyzeWSBot(newCandles, key as Asset, 'M1');

          newData[key] = {
            ...assetData,
            candles: newCandles,
            analysis: newAnalysis
          };
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(tickInterval);
  }, [isMarketOpen]);

  useEffect(() => {
    fetchQueue.current = [...activeAssets];
    processQueue().then(() => setIsLoading(false));

    const interval = setInterval(() => {
      fetchQueue.current = [...activeAssets];
      processQueue();
    }, 60000);

    return () => clearInterval(interval);
  }, [activeAssets]);

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

  const currentData = allAssetsData[asset] || { 
    candles: [], 
    analysis: { obs: [], fvgs: [], structure: [], d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null },
    lastUpdate: 0 
  };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe, setTimeframe,
      candles: currentData.candles,
      ...currentData.analysis,
      signalsData: mockSignalsData,
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen,
      allAssetsData
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