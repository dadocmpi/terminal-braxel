import React from 'react';
import { useTrading, TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MiniChart } from '../components/MiniChart';
import { MarketNews } from '../components/MarketNews';
import { SessionTimelineBar } from '../components/SessionTimelineBar';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { SignalHistory } from '../components/SignalHistory';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Asset } from '../types/trading';
import { Lock } from 'lucide-react';

const DashboardContent = () => {
  const { activeAssets, currentSession } = useTrading();
  const allAssets: Asset[] = ['EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'GBPJPY', 'EURGBP'];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <DashboardHeader />
      
      <main className="w-full">
        <StatusCards />
        <ActiveSignal />

        <div className="grid grid-cols-12 gap-0 border-b border-border/50">
          {/* Left: Multi-Chart Grid (3 Columns) */}
          <div className="col-span-12 xl:col-span-9 p-6 border-r border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Session Terminal: <span className="text-primary">{currentSession}</span>
                </h2>
                <p className="text-[8px] text-muted-foreground mt-1">Apenas ativos da sessão atual estão liberados para operação.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                <span className="text-[8px] font-bold text-bull uppercase">Live Scanning</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allAssets.map(asset => {
                const isActive = activeAssets.includes(asset);
                return (
                  <div key={asset} className="relative">
                    {!isActive && (
                      <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center border border-border/50 rounded-lg">
                        <Lock className="w-6 h-6 text-muted-foreground/50 mb-2" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Manutenção</span>
                        <span className="text-[8px] text-muted-foreground/70 mt-1">Fora da Sessão {currentSession}</span>
                      </div>
                    )}
                    <MiniChart asset={asset} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: News & Activity */}
          <div className="col-span-12 xl:col-span-3 flex flex-col bg-secondary/5">
            <div className="p-6 border-b border-border/50">
              <MarketNews />
            </div>
            <div className="p-6 border-b border-border/50">
              <SessionTimelineBar />
            </div>
            <div className="p-6 flex-1">
              <ZoneActivityFeed />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <SignalHistory />
        </div>

        <footer className="py-8 opacity-30">
          <MadeWithDyad />
        </footer>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <TradingProvider>
      <DashboardContent />
    </TradingProvider>
  );
};

export default Index;