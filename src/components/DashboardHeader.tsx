import React, { useState, useEffect } from 'react';
import { useTrading } from '../contexts/TradingContext';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';
import { Activity, Cpu, Globe, ShieldCheck, Database } from 'lucide-react';

export const DashboardHeader = () => {
  const { isLoading, currentSession, isMarketOpen } = useTrading();
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 15);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Verifica se estamos no final de semana real para marcar como simulado
  const isWeekend = new Date().getUTCDay() === 6 || new Date().getUTCDay() === 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo />
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 ${isMarketOpen ? 'bg-bull shadow-[0_0_8px_#22c55e]' : 'bg-bear'}`} />
              <span className="text-[10px] font-bold text-white uppercase">
                {isWeekend ? 'SIMULATION ACTIVE' : isMarketOpen ? 'OPERATIONAL' : 'STANDBY'}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Data Source</span>
            <div className="flex items-center gap-2">
              <Database className={`w-3 h-3 ${isWeekend ? 'text-yellow-500' : 'text-primary'}`} />
              <span className={`text-[10px] font-bold uppercase ${isWeekend ? 'text-yellow-500' : 'text-primary'}`}>
                {isWeekend ? 'INTERNAL_SIM_V4' : 'REUTERS_LIVE_FEED'}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">Active Session</span>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase">{currentSession}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-4 mr-4 border-r border-white/10 pr-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono text-muted-foreground">CPU: 12%</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-bull" />
            <span className="text-[9px] font-mono text-bull">SECURE</span>
          </div>
        </div>
        
        <RiskCalculator />
      </div>
    </header>
  );
};