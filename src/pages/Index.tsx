import React from 'react';
import { useTrading, TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MiniChart } from '../components/MiniChart';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';

const LiveTerminal = () => {
  const { activeAssets } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="w-full relative">
        <StatusCards />
        <ActiveSignal />
        
        <div className="grid grid-cols-12 gap-0 border-b border-white/5">
          <div className="col-span-12 xl:col-span-9 border-r border-white/5 bg-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {activeAssets.slice(0, 3).map((asset, index) => (
                <div key={asset} className={`border-b border-white/5 ${index < 2 ? 'md:border-r' : ''}`}>
                  <MiniChart asset={asset} />
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 xl:col-span-3 bg-black h-full">
            <ZoneActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

const Index = () => (
  <TradingProvider>
    <LiveTerminal />
  </TradingProvider>
);

export default Index;