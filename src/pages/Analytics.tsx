import React from 'react';
import { TradingProvider, useTrading } from '../contexts/TradingContext';
import { DashboardHeader } from '../components/DashboardHeader';
import { WeeklyPerformance } from '../components/WeeklyPerformance';
import { SignalHistory } from '../components/SignalHistory';
import { EquityChart } from '../components/EquityChart';
import { WinLossChart } from '../components/WinLossChart';
import { ZoneActivityFeed } from '../components/ZoneActivityFeed';
import { Cloud, ShieldCheck, Zap } from 'lucide-react';

const DataTerminal = () => {
  const { signalsData } = useTrading();
  const history = signalsData.signals;
  
  const totalWins = history.filter(s => s.status === 'WIN').length;
  const totalSignals = history.filter(s => s.status !== 'PENDING').length;
  const winRate = totalSignals > 0 ? Math.round((totalWins / totalSignals) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />
      
      <main className="w-full p-8 space-y-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                label="Total Signals" 
                value={totalSignals} 
                icon={<Zap className="w-3 h-3 text-primary" />}
              />
              <StatCard 
                label="Win Rate" 
                value={`${winRate}%`} 
                color="text-bull" 
                icon={<ShieldCheck className="w-3 h-3 text-bull" />}
              />
              <StatCard 
                label="Cloud Engine" 
                value="CONNECTED" 
                color="text-primary" 
                icon={<Cloud className="w-3 h-3 text-primary animate-pulse" />}
              />
            </div>
            <WeeklyPerformance />
            <SignalHistory />
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <WinLossChart />
            <ZoneActivityFeed />
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <EquityChart />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white", icon }: { label: string, value: string | number, color?: string, icon?: React.ReactNode }) => (
  <div className="bg-black border border-white/10 p-6 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5 group-hover:bg-primary/30 transition-colors" />
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block">{label}</span>
    </div>
    <span className={`text-3xl font-black tracking-tighter ${color}`}>{value}</span>
  </div>
);

const Analytics = () => (
  <TradingProvider>
    <DataTerminal />
  </TradingProvider>
);

export default Analytics;