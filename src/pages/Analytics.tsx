import React from 'react';
import { TradingProvider } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { WeeklyPerformance } from '../components/WeeklyPerformance';
import { SignalHistory } from '../components/SignalHistory';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { MarketBiasSummary } from '../components/MarketBiasSummary';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';

const DataTerminal = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="w-full p-8 space-y-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <WeeklyPerformance />
            <SignalHistory />
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <ZoneActivityFeed />
            <MarketBiasSummary />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <AnalyticsCharts />
        </div>
      </main>
    </div>
  );
};

const Analytics = () => (
  <TradingProvider>
    <DataTerminal />
  </TradingProvider>
);

export default Analytics;