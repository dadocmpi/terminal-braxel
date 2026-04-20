"use client";

import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MainIndexChart } from '../components/MainIndexChart';
import { MarketSentimentBubble } from '../components/MarketSentimentBubble';
import { MarketNews } from '../components/MarketNews';
import { WorldClocks } from '../components/WorldClocks';

const LiveTerminal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Section: Bias & P/D Matrix */}
        <StatusCards />
        
        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          {/* Left Column: Clocks, Signal & Stretched Chart (8 cols) */}
          <div className="col-span-12 lg:col-span-8 border-r border-white/5 flex flex-col bg-black">
            <WorldClocks />
            <ActiveSignal />
            <div className="flex-1 relative w-full">
              <MainIndexChart />
            </div>
          </div>

          {/* Right Column: Sentiment & News (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col bg-black">
            <div className="h-1/2 border-b border-white/5">
              <MarketSentimentBubble />
            </div>
            <div className="h-1/2 overflow-auto">
              <MarketNews />
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