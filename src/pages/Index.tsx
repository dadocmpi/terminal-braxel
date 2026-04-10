import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
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

const Index = () => {
  const assets: Asset[] = ['EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'USDCAD', 'AUDUSD', 'GBPJPY', 'EURGBP'];

  return (
    <TradingProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <DashboardHeader />
        
        <main className="w-full">
          <StatusCards />
          <ActiveSignal />

          <div className="grid grid-cols-12 gap-0 border-b border-border/50">
            {/* Left: Multi-Chart Grid */}
            <div className="col-span-12 xl:col-span-9 p-6 border-r border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Multi-Asset Terminal (M1 Real-time)</h2>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-bull animate-pulse" />
                  <span className="text-[8px] font-bold text-bull uppercase">Scanning 8 Pairs</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assets.map(asset => (
                  <MiniChart key={asset} asset={asset} />
                ))}
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
    </TradingProvider>
  );
};

export default Index;