import React, { useState, useEffect } from 'react';
import { useTrading } from '../contexts/TradingContext';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';
import { Cpu, Globe, ShieldCheck, Database, Activity } from 'lucide-react';

export const DashboardHeader = () => {
  const { currentSession, isMarketOpen } = useTrading();
  const isWeekend = new Date().getUTCDay() === 6 || new Date().getUTCDay() === 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Logo />
        
        <nav className="hidden xl:flex items-center gap-8">
          <HeaderStat 
            label="System Status" 
            value={isWeekend ? 'RESTING' : isMarketOpen ? 'OPERATIONAL' : 'STANDBY'} 
            color={isWeekend ? 'text-muted-foreground' : isMarketOpen ? 'text-bull' : 'text-bear'}
            icon={<Activity className="w-3 h-3" />}
          />
          <HeaderStat 
            label="Data Source" 
            value="REUTERS_LIVE" 
            color="text-primary"
            icon={<Database className="w-3 h-3" />}
          />
          <HeaderStat 
            label="Active Session" 
            value={isWeekend ? 'MARKET_CLOSED' : currentSession} 
            color="text-primary"
            icon={<Globe className="w-3 h-3" />}
          />
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Load: 4%</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-bull" />
            <span className="text-[9px] font-mono text-bull uppercase">Encrypted</span>
          </div>
        </div>
        
        <RiskCalculator />
      </div>
    </header>
  );
};

const HeaderStat = ({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className={`text-[10px] font-bold uppercase ${color}`}>{value}</span>
    </div>
  </div>
);