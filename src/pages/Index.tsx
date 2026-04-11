import React from 'react';
import { useTrading, TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { WeeklyPerformance } from '../components/WeeklyPerformance';
import { MiniChart } from '../components/MiniChart';
import { MarketNews } from '../components/MarketNews';
import { SessionTimelineBar } from '../components/SessionTimelineBar';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { SignalHistory } from '../components/SignalHistory';
import { MadeWithDyad } from "@/components/made-with-dyad";

const DashboardContent = () => {
  const { activeAssets, currentSession } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <DashboardHeader />
      
      <main className="w-full">
        <StatusCards />
        <ActiveSignal />
        <WeeklyPerformance />

        <div className="grid grid-cols-12 gap-0 border-b border-border/50">
          {/* Left: Multi-Chart Grid - Agora com 3 colunas altas */}
          <div className="col-span-12 xl:col-span-9 border-r border-border/50 bg-black">
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/5">
              <div className="flex flex-col">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Terminal de Monitoramento: <span className="text-primary">{currentSession}</span>
                </h2>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                <span className="text-[8px] font-bold text-bull uppercase tracking-widest">Live Scanning</span>
              </div>
            </div>
            
            {/* Grid de 3 colunas para gráficos altos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {activeAssets.map((asset, index) => (
                <div 
                  key={asset} 
                  className={`border-b border-border/50 ${(index + 1) % 3 !== 0 ? 'lg:border-r' : ''} ${(index + 1) % 2 !== 0 ? 'md:border-r lg:md:border-r-0' : ''}`}
                >
                  <MiniChart asset={asset} />
                </div>
              ))}
              {activeAssets.length === 0 && (
                <div className="col-span-full h-[600px] flex flex-col items-center justify-center bg-secondary/5">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Market is currently closed</p>
                </div>
              )}
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

        <div className="p-8 space-y-6">
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