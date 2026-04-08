import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
import { PerformanceCard } from '../components/PerformanceCard';
import { MarketBiasSummary } from '../components/MarketBiasSummary';
import { ActiveSignal } from '../components/ActiveSignal';
import { CandlestickChart } from '../components/CandlestickChart';
import { AnalysisTabs } from '../components/AnalysisTabs';
import { SessionTimelineBar } from '../components/SessionTimelineBar';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { SignalHistory } from '../components/SignalHistory';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <TradingProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <DashboardHeader />
        
        <main className="container mx-auto px-6 py-6 space-y-6 max-w-[1600px]">
          {/* Row 1: Status & Performance */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-5">
              <StatusCards />
            </div>
            <div className="col-span-3">
              <PerformanceCard />
            </div>
            <div className="col-span-4">
              <MarketBiasSummary />
            </div>
          </div>

          {/* Row 2: Hero Signal */}
          <ActiveSignal />

          {/* Row 3: Chart & Sidebar */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <CandlestickChart />
              <AnalysisTabs />
            </div>
            <div className="col-span-4 space-y-6">
              <SessionTimelineBar />
              <ZoneActivityFeed />
              <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Premium/Discount Radar</h3>
                <div className="space-y-3">
                  {['EURUSD', 'GBPUSD', 'XAUUSD'].map(pair => (
                    <div key={pair} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span>{pair}</span>
                        <span className="text-primary">42%</span>
                      </div>
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '42%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: History */}
          <SignalHistory />

          {/* Row 5: Analytics */}
          <AnalyticsCharts />

          <footer className="pt-12 pb-6 opacity-50">
            <MadeWithDyad />
          </footer>
        </main>
      </div>
    </TradingProvider>
  );
};

export default Index;