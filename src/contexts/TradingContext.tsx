import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { fetchHistoricalData, setupRealtimeWS } from '../services/marketData';
import { requestNotificationPermission, sendSignalNotification } from '../utils/notifications';
import { showSuccess } from '../utils/toast';

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
  allAssetsData: Record<string, AssetData>;
  sessionIndex: { name: string; candles: Candle[] };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const TWELVE_DATA_API_KEY = '65e9481bb8634db4b208afd0af073fdb';

const ALL_OPERATED_ASSETS: Asset[] = [
  'EURUSD', 'GBPUSD', 'USDCAD', 'USDJPY', 
  'AUDUSD', 'GBPJPY', 'EURGBP', 'NZDUSD'
];

const getSession = (): MarketSession => {
  // Obtém a hora atual em New York
  const nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false
  }).formatToParts(new Date());
  
  const hour = parseInt(nyTime.find(p => p.type === 'hour')?.value || '0');

  // London: 03:00 - 12:00 NY
  if (hour >= 3 && hour < 12) return 'LONDON';
  // NY: 08:00 - 17:00 NY
  if (hour >= 8 && hour < 17) return 'NEW_YORK';
  // Tokyo: 19:00 - 04:00 NY
  if (hour >= 19 || hour < 4) return 'TOKYO';
  
  return 'CLOSE';
};

const getIndexName = (session: MarketSession): string => {
  switch (session) {
    case 'LONDON': return 'GBP INDEX';
    case 'NEW_YORK': return 'DXY INDEX';
    case 'TOKYO': return 'JPY STRENGTH';
    default: return 'GLOBAL INDEX';
  }
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<MarketSession>(getSession());
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession]);
  const [asset, setAsset] = useState<Asset>(activeAssets[0]);
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [dbSignals, setDbSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: getIndexName(currentSession),
    candles: generateMockCandles(100, 104.5)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newSession = getSession();
      if (newSession !== currentSession) {
        setCurrentSession(newSession);
        const newAssets = SESSION_ASSETS[newSession];
        setActiveAssets(newAssets);
        setAsset(newAssets[0]);
        setSessionIndex(prev => ({ ...prev, name: getIndexName(newSession) }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentSession]);

  useEffect(() => {
    requestNotificationPermission();
    const fetchSignals = async () => {
      const { data } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setDbSignals(data);
    };
    fetchSignals();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', table: 'signals' }, (payload) => {
        setDbSignals(prev => [payload.new, ...prev]);
        sendSignalNotification(payload.new.asset, payload.new.direction, payload.new.entry);
        showSuccess(`🚨 NOVO SINAL CLOUD: ${payload.new.asset} ${payload.new.direction}`);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const initialData: Record<string, AssetData> = {};
      
      for (const a of ALL_OPERATED_ASSETS) {
        let candles = await fetchHistoricalData(a, '1min', TWELVE_DATA_API_KEY);
        if (candles.length === 0) {
          candles = generateMockCandles(100, a.includes('JPY') ? 150 : 1.1);
        }
        const analysis = analyzeWSBot(candles, a, 'M1');
        initialData[a] = { candles, analysis, lastUpdate: Date.now() };
      }
      
      setAllAssetsData(initialData);
      setIsLoading(false);

      if (wsRef.current) wsRef.current.close();
      wsRef.current = setupRealtimeWS(ALL_OPERATED_ASSETS, TWELVE_DATA_API_KEY, (data) => {
        if (data.symbol && data.price) {
          const symbol = data.symbol as Asset;
          const price = parseFloat(data.price);
          setAllAssetsData(prev => {
            const assetData = prev[symbol];
            if (!assetData) return prev;
            const newCandles = [...assetData.candles];
            const lastCandle = { ...newCandles[newCandles.length - 1] };
            lastCandle.close = price;
            if (price > lastCandle.high) lastCandle.high = price;
            if (price < lastCandle.low) lastCandle.low = price;
            newCandles[newCandles.length - 1] = lastCandle;
            return { ...prev, [symbol]: { ...assetData, candles: newCandles, lastUpdate: Date.now() } };
          });
        }
      });
    };
    initData();
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  const currentData = allAssetsData[asset] || { candles: [], analysis: { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null } };
  const activeSignalFromDb = dbSignals.find(s => s.status === 'PENDING');

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      candles: currentData.candles,
      d1Bias: currentData.analysis.d1Bias,
      premiumPct: currentData.analysis.premiumPct,
      activeSignal: activeSignalFromDb || null,
      signalsData: {
        last_updated: new Date().toISOString(),
        active_signal: activeSignalFromDb || null,
        signals: dbSignals,
        market_context: { pairs: [], activity_log: [] }
      },
      isLoading,
      currentSession,
      activeAssets,
      isMarketOpen: currentSession !== 'CLOSE',
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