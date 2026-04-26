import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Asset, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession, SESSION_ASSETS } from '../types/trading';
import { analyzeWSBot, generateMockCandles } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { fetchHistoricalData } from '../services/marketData';
import { showSuccess, showError } from '../utils/toast';
import { executeTrade } from '../services/broker';

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
  sessionIndex: { name: string; candles: Candle[] };
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
    case 'LONDON': return { name: 'GBP INDEX (BXY)', symbol: 'BXY', fallbackPrice: 125.50 };
    case 'NEW_YORK': return { name: 'US DOLLAR INDEX (DXY)', symbol: 'DXY', fallbackPrice: 104.20 };
    case 'TOKYO': return { name: 'YEN INDEX (JXY)', symbol: 'JXY', fallbackPrice: 72.80 };
    default: return { name: 'NASDAQ 100 (NAS100)', symbol: 'QQQ', fallbackPrice: 18250.00 };
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
  const lastExecutedSignalRef = useRef<string | null>(null);
  
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: getIndexConfig(currentSession).name,
    candles: []
  });

  // Atualização de Sessão e Index Real
  useEffect(() => {
    const updateIndex = async () => {
      const config = getIndexConfig(currentSession);
      let candles = isWeekend ? [] : await fetchHistoricalData(config.symbol, '5min', TWELVE_DATA_API_KEY);
      
      if (candles.length === 0) {
        candles = generateMockCandles(100, config.fallbackPrice);
      }
      
      setSessionIndex({ name: config.name, candles });
    };

    updateIndex();
    
    const interval = setInterval(() => {
      const newSession = getSession();
      if (newSession !== currentSession) {
        setCurrentSession(newSession);
      }
      updateIndex();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [currentSession, isWeekend]);

  // Execução de Trade (Sem Telegram)
  useEffect(() => {
    if (isWeekend) return;

    const processSignal = async (signal: ActiveSignal) => {
      const signalKey = `${signal.asset}-${signal.created_at}`;
      if (lastExecutedSignalRef.current === signalKey) return;
      lastExecutedSignalRef.current = signalKey;
      
      try {
        const result = await executeTrade(signal);
        if (result.success) showSuccess(`AUTO-TRADE: ${signal.asset} EXECUTADO NO MT5`);
      } catch (err) {
        showError(`FALHA NA EXECUÇÃO: ${signal.asset}`);
      }
    };

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', table: 'signals' }, (payload) => {
        processSignal(payload.new as ActiveSignal);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isWeekend]);

  // Inicialização de Dados Reais para todos os ativos
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const initialData: Record<string, AssetData> = {};
      
      for (const a of ALL_OPERATED_ASSETS) {
        let candles = isWeekend ? [] : await fetchHistoricalData(a, '1min', TWELVE_DATA_API_KEY);
        
        // Fallback apenas se a API falhar ou for fim de semana
        if (candles.length === 0) {
          candles = generateMockCandles(100, 1.1);
        }
        
        const analysis = analyzeWSBot(candles, a, 'M1');
        initialData[a] = { candles, analysis, lastUpdate: Date.now() };
      }
      
      setAllAssetsData(initialData);
      setIsLoading(false);
    };
    
    initData();
  }, [isWeekend]);

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
      isMarketOpen: !isWeekend && currentSession !== 'CLOSE',
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