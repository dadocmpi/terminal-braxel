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
import { Coffee, Lock } from 'lucide-react';

const MarketClosedOverlay = () => (
  <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
      <Coffee className="w-12 h-12 text-primary animate-bounce" />
    </div>
    <h2 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">Market Closed</h2>
    <p className="text-muted-foreground max-w-md font-mono text-sm leading-relaxed uppercase tracking-widest">
      Braxel Bot is in rest mode. Forex and Metals markets are closed during the weekend.
    </p>
    <div className="mt-10 flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-none">
      <Lock className="w-4 h-4 text-primary" />
      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Returning Sunday at 21:00 UTC</span>
    </div>
  </div>
);

const DashboardContent = () => {
  const { activeAssets, currentSession, isMarketOpen } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {!isMarketOpen && <MarketClosedOverlay />}
      
      <DashboardHeader />
      
      <main className="w-full">
        <StatusCards />
        <ActiveSignal />
        <WeeklyPerformance />

        <div className="grid grid-cols-12 gap-0 border-b border-border/50">
          <div className="col-span-12 xl:col-span-9 border-r border-border/50 bg-black">
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/5">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Monitoring Terminal: <span className="text-primary">{currentSession}</span>
              </h2>
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-bull animate-pulse" />
                <span className="text-[8px] font-bold text-bull uppercase tracking-widest">Live Scanning</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {activeAssets.slice(0, 3).map((asset, index) => (
                <div 
                  key={asset} 
                  className={`border-b border-border/50 ${index < 2 ? 'md:border-r' : ''}`}
                >
                  <MiniChart asset={asset} />
                </div>
              ))}
            </div>
          </div>

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