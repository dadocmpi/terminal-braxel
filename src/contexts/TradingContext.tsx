import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { fetchHistoricalData } from '../services/marketData';
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

const getSession = (): MarketSession => {
  const hour = new Date().getUTCHours();
  if (hour >= 8 && hour < 16) return 'LONDON';
  if (hour >= 13 && hour < 21) return 'NEW_YORK';
  if (hour >= 0 && hour < 8) return 'TOKYO';
  return 'CLOSE';
};

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<MarketSession>(getSession());
  const [activeAssets, setActiveAssets] = useState<Asset[]>(SESSION_ASSETS[currentSession]);
  const [asset, setAsset] = useState<Asset>(activeAssets[0]);
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [dbSignals, setDbSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: 'DXY INDEX',
    candles: generateMockCandles(100, 104.5)
  });
  
  const apiKey = localStorage.getItem('twelve_data_key');
  const isRealMode = localStorage.getItem('data_mode') === 'real' && !!apiKey;

  // Atualização automática de sessão a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const newSession = getSession();
      if (newSession !== currentSession) {
        setCurrentSession(newSession);
        setActiveAssets(SESSION_ASSETS[newSession]);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentSession]);

  useEffect(() => {
    requestNotificationPermission();
    const fetchSignals = async () => {
      const { data } = await supabase.from('signals').select('*').order('created_at', { ascending: false }).limit(50);
      if (data) setDbSignals(data);
    };
    fetchSignals();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', table: 'signals' }, (payload) => {
        setDbSignals(prev => [payload.new, ...prev]);
        sendSignalNotification(payload.new.asset, payload.new.direction, payload.new.entry);
        showSuccess(`Novo sinal: ${payload.new.asset}`);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const initData = async () => {
      const initialData: Record<string, AssetData> = {};
      for (const a of activeAssets) {
        let candles = isRealMode ? await fetchHistoricalData(a, '1min', apiKey!) : generateMockCandles(100, a.includes('JPY') ? 150 : 1.1);
        const analysis = analyzeWSBot(candles, a, 'M1');
        initialData[a] = { candles, analysis, lastUpdate: Date.now() };
      }
      setAllAssetsData(initialData);
      setIsLoading(false);
    };
    initData();
  }, [activeAssets, isRealMode, apiKey]);

  const currentData = allAssetsData[asset] || { candles: [], analysis: { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null } };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      candles: currentData.candles,
      d1Bias: currentData.analysis.d1Bias,
      premiumPct: currentData.analysis.premiumPct,
      activeSignal: dbSignals[0]?.status === 'PENDING' ? dbSignals[0] : null,
      signalsData: {
        last_updated: new Date().toISOString(),
        active_signal: dbSignals[0],
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