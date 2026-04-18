import React from 'react';
import { useTrading, TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MiniChart } from '../components/MiniChart';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { Lock } from 'lucide-react';

const LiveTerminal = () => {
  const { activeAssets, isMarketOpen } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="w-full relative">
        {/* Bloqueio de Final de Semana */}
        {!isMarketOpen && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-6 bg-white/5">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-black tracking-[0.3em] text-white uppercase mb-2">Terminal Locked</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest max-w-md">
              The institutional execution engine is offline. Live data and signal generation will resume at London Open.
            </p>
          </div>
        )}

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