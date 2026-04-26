"use client";

import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { CandlestickChart } from '../components/CandlestickChart';
import { MarketNews } from '../components/MarketNews';
import { WorldClocks } from '../components/WorldClocks';
import { PremiumDiscountGrid } from '../components/PremiumDiscountGrid';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { SessionTimelineBar } from '../components/SessionTimelineBar';
import { Watchlist } from '../components/Watchlist';
import { CopytradeStatus } from '../components/CopytradeStatus';

const LiveTerminal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <DashboardHeader />
      
      {/* Relógio Mundial agora no topo */}
      <WorldClocks />
      
      <div className="bg-black border-b border-white/5">
        <SessionTimelineBar />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <ActiveSignal />
        
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          {/* Coluna Esquerda: Watchlist e Status */}
          <div className="hidden lg:flex col-span-3 border-r border-white/5 flex-col bg-black">
            <div className="flex-1">
              <Watchlist />
            </div>
            <div className="p-4 border-t border-white/5">
              <CopytradeStatus />
            </div>
          </div>

          {/* Coluna Central: Bias e Gráfico Real */}
          <div className="col-span-12 lg:col-span-6 border-r border-white/5 flex flex-col bg-black">
            <StatusCards />
            <div className="flex-[2] relative w-full border-b border-white/5">
              <CandlestickChart />
            </div>
            <div className="flex-1 overflow-hidden">
              <MarketNews />
            </div>
          </div>

          {/* Coluna Direita: Matrix e Feed */}
          <div className="col-span-12 lg:col-span-3 flex flex-col bg-black">
            <div className="flex-1 border-b border-white/5">
              <PremiumDiscountGrid />
            </div>
            <div className="flex-1 overflow-hidden">
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