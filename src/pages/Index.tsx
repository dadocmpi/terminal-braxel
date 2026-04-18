import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MainIndexChart } from '../components/MainIndexChart';
import { MarketSentimentBubble } from '../components/MarketSentimentBubble';
import { MarketNews } from '../components/MarketNews';

const LiveTerminal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="w-full relative">
        <StatusCards />
        <ActiveSignal />
        
        <div className="grid grid-cols-12 gap-0 border-b border-white/5">
          {/* Coluna do Gráfico Principal (Index) */}
          <div className="col-span-12 xl:col-span-6 border-r border-white/5 bg-black">
            <MainIndexChart />
          </div>

          {/* Coluna de Sentimento (Bolha) */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 border-r border-white/5 bg-black">
            <MarketSentimentBubble />
          </div>

          {/* Coluna de Notícias */}
          <div className="col-span-12 md:col-span-6 xl:col-span-3 bg-black">
            <MarketNews />
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