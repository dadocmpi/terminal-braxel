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
          {/* Left: Terminal de Gráficos em 3 Colunas (I I I) */}
          <div className="col-span-12 xl:col-span-9 border-r border-border/50 bg-black">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/5">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Terminal de Monitoramento: <span className="text-primary">{currentSession}</span>
              </h2>
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
                <span className="text-[8px] font-bold text-bull uppercase tracking-widest">Live Scanning</span>
              </div>
            </div>
            
            {/* Grid forçado em 3 colunas para o visual I I I */}
            <div className="grid grid-cols-3 gap-0">
              {activeAssets.slice(0, 3).map((asset, index) => (
                <div 
                  key={asset} 
                  className={`border-b border-border/50 ${index < 2 ? 'border-r' : ''}`}
                >
                  <MiniChart asset={asset} />
                </div>
              ))}
              {activeAssets.length === 0 && (
                <div className="col-span-3 h-[700px] flex flex-col items-center justify-center bg-secondary/5">
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