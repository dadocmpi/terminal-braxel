"use client";

import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MainIndexChart } from '../components/MainIndexChart';
import { MarketNews } from '../components/MarketNews';
import { WorldClocks } from '../components/WorldClocks';
import { PremiumDiscountGrid } from '../components/PremiumDiscountGrid';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';

const LiveTerminal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <StatusCards />
        <ActiveSignal />
        
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          {/* Coluna Esquerda: Clocks e Gráfico Principal (8 cols) */}
          <div className="col-span-12 lg:col-span-8 border-r border-white/5 flex flex-col bg-black">
            <WorldClocks />
            <div className="flex-1 relative w-full">
              <MainIndexChart />
            </div>
            <div className="h-1/3 border-t border-white/5">
              <MarketNews />
            </div>
          </div>

          {/* Coluna Direita: P/D Grid e Feed (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col bg-black">
            <div className="flex-1 border-b border-white/5">
              <PremiumDiscountGrid />
            </div>
            <div className="h-1/2">
              <ZoneActivityFeed />
            </div>
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