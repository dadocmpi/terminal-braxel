import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { StatusCards } from '../components/StatusCards';
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
        
        <main className="w-full">
          {/* Top Section: Bias & Performance */}
          <StatusCards />

          {/* Hero Section: Active Signal */}
          <ActiveSignal />

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-0 border-b border-border/50">
            {/* Left: Chart & Analysis */}
            <div className="col-span-8 border-r border-border/50 p-6">
              <CandlestickChart />
              <AnalysisTabs />
            </div>

            {/* Right: Sidebar Tools */}
            <div className="col-span-4 flex flex-col">
              <div className="p-6 border-b border-border/50">
                <SessionTimelineBar />
              </div>
              
              <div className="p-6 border-b border-border/50">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Premium/Discount Radar</h3>
                <div className="space-y-4">
                  {['EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'AUDUSD'].map(pair => (
                    <div key={pair} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span>{pair}</span>
                        <span className={pair === 'GBPUSD' ? 'text-bear' : 'text-bull'}>
                          {pair === 'GBPUSD' ? '85% (Premium)' : '22% (Discount)'}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${pair === 'GBPUSD' ? 'bg-bear' : 'bg-bull'}`} 
                          style={{ width: pair === 'GBPUSD' ? '85%' : '22%' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 flex-1">
                <ZoneActivityFeed />
              </div>
            </div>
          </div>

          {/* Bottom Section: History & Analytics */}
          <div className="p-6 space-y-6 bg-secondary/5">
            <SignalHistory />
            <AnalyticsCharts />
          </div>

          <footer className="py-8 opacity-30">
            <MadeWithDyad />
          </footer>
        </main>
      </div>
    </TradingProvider>
  );
};

export default Index;