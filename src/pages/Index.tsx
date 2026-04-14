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
import { Coffee } from 'lucide-react';

const MarketClosedOverlay = () => (
  <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
      <Coffee className="w-12 h-12 text-primary animate-bounce" />
    </div>
    <h2 className="text-4xl font-black tracking-tighter text-white mb-4 uppercase">Market Closed</h2>
    <p className="text-muted-foreground max-w-md font-mono text-sm leading-relaxed uppercase tracking-widest">
      Braxel Bot is in rest mode.
    </p>
  </div>
);

const DashboardContent = () => {
  const { activeAssets, isMarketOpen } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {!isMarketOpen && <MarketClosedOverlay />}
      
      <DashboardHeader />
      
      <main className="w-full">
        <StatusCards />
        <ActiveSignal />
        <WeeklyPerformance />
        <SessionTimelineBar />

        <div className="grid grid-cols-12 gap-0 border-b border-border/50">
          {/* Coluna dos Gráficos (750px de altura total por gráfico) */}
          <div className="col-span-12 xl:col-span-9 border-r border-border/50 bg-black">
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

          {/* Coluna Lateral - Alinhada com o fundo dos gráficos */}
          <div className="col-span-12 xl:col-span-3 flex flex-col bg-secondary/5 h-full">
            {/* Espaçador para empurrar o conteúdo para baixo e alinhar com a base */}
            <div className="flex-1" /> 
            
            <div className="p-4 border-t border-border/50">
              <MarketNews />
            </div>
            <div className="p-4 border-t border-border/50">
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