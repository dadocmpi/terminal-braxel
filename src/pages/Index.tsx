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
import { MarketBiasSummary } from '../components/MarketBiasSummary';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { InstitutionalBrain } from '../components/InstitutionalBrain';
import { MarketCalendar } from '../components/MarketCalendar';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Coffee, LayoutDashboard, BarChart3, Shield } from 'lucide-react';

const DashboardContent = () => {
  const { activeAssets, isMarketOpen } = useTrading();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <DashboardHeader />
      
      <main className="w-full">
        {/* 1. EXECUÇÃO IMEDIATA */}
        <StatusCards />
        <ActiveSignal />
        
        {/* 2. MONITORAMENTO EM TEMPO REAL */}
        <div className="grid grid-cols-12 gap-0 border-b border-border/50">
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
            
            {/* NOVA SEÇÃO: BRAIN & CALENDAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border/50">
              <InstitutionalBrain />
              <MarketCalendar />
            </div>
          </div>

          <div className="col-span-12 xl:col-span-3 flex flex-col bg-secondary/5 h-full">
            <div className="p-4 border-b border-border/50">
              <MarketNews />
            </div>
            <div className="p-4 flex-1">
              <ZoneActivityFeed />
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE SEMANAL E TIMELINE */}
        <WeeklyPerformance />
        <SessionTimelineBar />

        {/* 4. HISTÓRICO DE EXECUÇÃO */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Execution Log</h3>
          </div>
          <SignalHistory />
        </div>

        {/* 5. INTELIGÊNCIA E ANALYTICS (BASE) */}
        <div className="grid grid-cols-12 gap-0 bg-[#030303]">
          <div className="col-span-12 lg:col-span-4 p-8 border-r border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Market Bias Overview</h3>
            </div>
            <MarketBiasSummary />
          </div>
          
          <div className="col-span-12 lg:col-span-8 p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Performance Analytics</h3>
            </div>
            <AnalyticsCharts />
          </div>
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