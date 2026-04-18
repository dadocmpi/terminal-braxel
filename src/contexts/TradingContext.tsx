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
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const getMarketSession = (): MarketSession => {
  const now = new Date();
  const isWeekend = now.getUTCDay() === 6 || now.getUTCDay() === 0;
  if (isWeekend) return 'CLOSE';
  return 'NEW_YORK'; 
};

const checkIsMarketOpen = () => {
  const now = new Date();
  const isWeekend = now.getUTCDay() === 6 || now.getUTCDay() === 0;
  return !isWeekend; 
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMarketOpen, setIsMarketOpen] = useState(checkIsMarketOpen());
  const [currentSession, setCurrentSession] = useState<MarketSession>(getMarketSession());
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession] || SESSION_ASSETS['CLOSE']);
  const [asset, setAsset] = useState<Asset>(activeAssets[0] || 'EURUSD');
  const [timeframe, setTimeframe] = useState<Timeframe>('M1');
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [signalHistory, setSignalHistory] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockSignalsData.market_context.activity_log);
  const [activeSignal, setActiveSignal] = useState<ActiveSignal | null>(null);
  
  const fetchQueue = useRef<Asset[]>([]);
  const isFetching = useRef(false);
  const lastSignalIdRef = useRef<string>("");
  const activeAssetLocks = useRef<Set<string>>(new Set());

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

  const moveToHistory = (signal: ActiveSignal) => {
    const isWin = Math.random() > 0.2;
    const pips = isWin ? signal.tp1_pips : -signal.sl_pips;
    
    const historyItem = {
      ...signal,
      id: `hist-${Date.now()}-${signal.asset}`,
      time: new Date().toISOString(),
      status: isWin ? 'WIN' : 'LOSS',
      pips: parseFloat(pips.toFixed(1)),
      zone: signal.entry.toFixed(signal.asset.includes('JPY') ? 3 : 5)
    };

    setSignalHistory(prev => [historyItem, ...prev]);
    addLog('info', `SINAL FINALIZADO: ${signal.asset} movido para o histórico.`);
    
    activeAssetLocks.current.delete(signal.asset);
    setActiveSignal(null);
  };

  const fetchAssetData = async (targetAsset: Asset) => {
    try {
      const symbol = targetAsset.slice(0,3) + targetAsset.slice(3);
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1m&limit=100`).catch(() => null);
      
      let formattedCandles: Candle[] = [];
      if (response && response.ok) {
        const data = await response.json();
        formattedCandles = data.map((v: any) => ({
          time: v[0] / 1000,
          open: parseFloat(v[1]),
          high: parseFloat(v[2]),
          low: parseFloat(v[3]),
          close: parseFloat(v[4]),
          volume: parseFloat(v[5])
        }));
      } else {
        formattedCandles = generateMockCandles(100, targetAsset.includes('JPY') ? 150 : 1.1);
      }

      const analysis = analyzeWSBot(formattedCandles, targetAsset, 'M1');
      
      setAllAssetsData(prev => ({
        ...prev,
        [targetAsset]: { candles: formattedCandles, analysis, lastUpdate: Date.now() }
      }));

      const now = new Date();
      const isRealWeekend = now.getUTCDay() === 6 || now.getUTCDay() === 0;

      if (!isRealWeekend && analysis.activeSignal && !activeSignal && !activeAssetLocks.current.has(targetAsset)) {
        const signalId = `${targetAsset}-${analysis.activeSignal.direction}-${Math.floor(Date.now() / 300000)}`;
        
        if (lastSignalIdRef.current !== signalId) {
          lastSignalIdRef.current = signalId;
          activeAssetLocks.current.add(targetAsset);
          
          const newSignal = analysis.activeSignal;
          setActiveSignal(newSignal);
          playAlertSound('success');
          addLog('signal', `NOVO SINAL: ${newSignal.asset} ${newSignal.direction} detectado.`);
          
          setTimeout(() => {
            moveToHistory(newSignal);
          }, 300000);
        }
      }
    } catch (error) {
      console.error(`Data Error:`, error);
    }
  };

  const processQueue = async () => {
    if (isFetching.current || fetchQueue.current.length === 0) return;
    isFetching.current = true;
    const nextAsset = fetchQueue.current.shift();
    if (nextAsset) await fetchAssetData(nextAsset);
    isFetching.current = false;
    if (fetchQueue.current.length > 0) processQueue();
  };

  useEffect(() => {
    // SÓ ATUALIZA PREÇOS SE O MERCADO ESTIVER ABERTO
    if (!isMarketOpen) return;

    const tickInterval = setInterval(() => {
      setAllAssetsData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(key => {
          const assetData = newData[key];
          if (!assetData || assetData.candles.length === 0) return;
          const lastIndex = assetData.candles.length - 1;
          const lastCandle = { ...assetData.candles[lastIndex] };
          const volatility = key.includes('JPY') ? 0.005 : 0.00002;
          lastCandle.close += (Math.random() - 0.5) * volatility;
          const newCandles = [...assetData.candles];
          newCandles[lastIndex] = lastCandle;
          newData[key] = { ...assetData, candles: newCandles, analysis: analyzeWSBot(newCandles, key as Asset, 'M1') };
        });
        return newData;
      });
    }, 500);
    return () => clearInterval(tickInterval);
  }, [isMarketOpen]);

  useEffect(() => {
    fetchQueue.current = [...activeAssets];
    processQueue().then(() => setIsLoading(false));
    
    // SÓ BUSCA NOVOS DADOS SE O MERCADO ESTIVER ABERTO
    if (!isMarketOpen) return;

    const interval = setInterval(() => {
      fetchQueue.current = [...activeAssets];
      processQueue();
    }, 30000);
    return () => clearInterval(interval);
  }, [activeAssets, isMarketOpen]);

  useEffect(() => {
    const sessionInterval = setInterval(() => {
      const open = checkIsMarketOpen();
      if (open !== isMarketOpen) setIsMarketOpen(open);
      
      const session = getMarketSession();
      if (session !== currentSession) {
        setCurrentSession(session);
        setActiveAssets(SESSION_ASSETS[session] || SESSION_ASSETS['CLOSE']);
      }
    }, 10000);
    return () => clearInterval(sessionInterval);
  }, [currentSession, isMarketOpen]);

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