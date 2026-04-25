"use client";

import React from 'react';
import { TradingProvider, useTrading } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { ActiveSignal } from '../components/ActiveSignal';
import { MainIndexChart } from '../components/MainIndexChart';
import { MarketNews } from '../components/MarketNews';
import { WorldClocks } from '../components/WorldClocks';
import { PremiumDiscountGrid } from '../components/PremiumDiscountGrid';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { SessionTimelineBar } from '../components/SessionTimelineBar';
import { Watchlist } from '../components/Watchlist';
import { CopytradeStatus } from '../components/CopytradeStatus';
import { Lock, ShieldAlert } from 'lucide-react';

const WeekendOverlay = () => (
  <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
    <div className="w-20 h-20 border-2 border-primary/20 rounded-none flex items-center justify-center mb-8 relative">
      <Lock className="w-8 h-8 text-primary animate-pulse" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-bear rounded-full" />
    </div>
    <h2 className="text-3xl font-black tracking-[0.4em] text-white mb-4 uppercase">Terminal Inativo</h2>
    <div className="flex items-center gap-3 mb-8">
      <ShieldAlert className="w-4 h-4 text-bear" />
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Mercado Institucional Fechado (Fim de Semana)</span>
    </div>
    <p className="text-[11px] text-muted-foreground max-w-md leading-relaxed font-mono uppercase tracking-tighter">
      O motor de análise neural está em modo de hibernação. A detecção de sinais e o copytrade serão reativados automaticamente na abertura de Sydney (Domingo à noite).
    </p>
    <div className="mt-12 grid grid-cols-3 gap-8 opacity-30">
      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black text-white uppercase mb-1">Sinais</span>
        <span className="text-[10px] font-mono text-primary">OFFLINE</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black text-white uppercase mb-1">Copytrade</span>
        <span className="text-[10px] font-mono text-primary">STANDBY</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[8px] font-black text-white uppercase mb-1">Liquidez</span>
        <span className="text-[10px] font-mono text-primary">NULA</span>
      </div>
    </div>
  </div>
);

const LiveTerminal = () => {
  // Desativado temporariamente a pedido do usuário para visualização
  // const { isWeekend } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* WeekendOverlay removido temporariamente */}
      
      <DashboardHeader />
      <div className="bg-black border-b border-white/5">
        <SessionTimelineBar />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <StatusCards />
        <ActiveSignal />
        
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          <div className="hidden lg:flex col-span-3 border-r border-white/5 flex-col bg-black">
            <div className="flex-1">
              <Watchlist />
            </div>
            <div className="p-4 border-t border-white/5">
              <CopytradeStatus />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 border-r border-white/5 flex flex-col bg-black">
            <WorldClocks />
            <div className="flex-[2] relative w-full border-b border-white/5">
              <MainIndexChart />
            </div>
            <div className="flex-1 overflow-hidden">
              <MarketNews />
            </div>
          </div>

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