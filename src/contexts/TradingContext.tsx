import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, Timeframe, Candle, BiasDirection, SignalsData, ActiveSignal, MarketSession } from '../types/trading';
import { analyzeWSBot, generateMockCandles, generateNextCandle } from '../data/mockData';
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

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession] = useState<MarketSession>('LONDON'); // Simplificado para o exemplo
  const [activeAssets] = useState<Asset[]>(['EURUSD', 'GBPUSD', 'USDJPY', 'GBPJPY']);
  const [asset, setAsset] = useState<Asset>(activeAssets[0]);
  const [allAssetsData, setAllAssetsData] = useState<Record<string, AssetData>>({});
  const [dbSignals, setDbSignals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState({ buyers: 50, sellers: 50 });
  
  const [sessionIndex, setSessionIndex] = useState<{ name: string; candles: Candle[] }>({
    name: 'DXY INDEX',
    candles: generateMockCandles(100, 104.5)
  });
  
  const apiKey = localStorage.getItem('twelve_data_key');
  const isRealMode = localStorage.getItem('data_mode') === 'real' && !!apiKey;

  // 1. Inicializar Notificações e Dados do Banco
  useEffect(() => {
    requestNotificationPermission();
    
    const fetchSignals = async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data) setDbSignals(data);
    };

    fetchSignals();

    // Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', table: 'signals' }, (payload) => {
        setDbSignals(prev => [payload.new, ...prev]);
        sendSignalNotification(payload.new.asset, payload.new.direction, payload.new.entry);
        showSuccess(`Novo sinal detectado: ${payload.new.asset}`);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // 2. Lógica de Geração e Salvamento de Sinais
  useEffect(() => {
    const processAnalysis = async (assetSymbol: Asset, analysis: any) => {
      if (analysis.activeSignal) {
        // Verificar se já existe um sinal recente para evitar duplicatas
        const isDuplicate = dbSignals.some(s => 
          s.asset === assetSymbol && 
          Math.abs(new Date(s.created_at).getTime() - Date.now()) < 300000 // 5 min
        );

        if (!isDuplicate) {
          const { error } = await supabase.from('signals').insert([{
            asset: assetSymbol,
            direction: analysis.activeSignal.direction,
            entry: analysis.activeSignal.entry,
            sl: analysis.activeSignal.sl,
            tp1: analysis.activeSignal.tp1,
            tp2: analysis.activeSignal.tp2,
            confidence: analysis.activeSignal.confidence,
            status: 'PENDING',
            pips: 0
          }]);
          if (error) console.error("Erro ao salvar sinal:", error);
        }
      }
    };

    Object.entries(allAssetsData).forEach(([symbol, data]) => {
      processAnalysis(symbol as Asset, data.analysis);
    });
  }, [allAssetsData]);

  // 3. Loop de Dados (Real ou Mock)
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
  }, [isRealMode, apiKey]);

  const currentData = allAssetsData[asset] || { candles: [], analysis: { d1Bias: 'NEUTRAL', premiumPct: 50, activeSignal: null } };

  return (
    <TradingContext.Provider value={{
      asset, setAsset,
      timeframe: 'M1', setTimeframe: () => {},
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
      currentSession: 'LONDON',
      activeAssets,
      isMarketOpen: true,
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