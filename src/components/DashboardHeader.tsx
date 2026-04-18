import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';
import { LayoutDashboard, BarChart3, Activity, ShieldCheck } from 'lucide-react';

export const DashboardHeader = () => {
  const { isMarketOpen } = useTrading();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Logo />
        
        <nav className="flex items-center gap-1">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === '/' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
          >
            <LayoutDashboard className="w-3 h-3" />
            Terminal 01: Live
          </Link>
          <Link 
            to="/analytics" 
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === '/analytics' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
          >
            <BarChart3 className="w-3 h-3" />
            Terminal 02: Data
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-white/10 pr-6">
          <div className="flex items-center gap-2">
            <Activity className={`w-3 h-3 ${isMarketOpen ? 'text-bull animate-pulse' : 'text-bear'}`} />
            <span className={`text-[9px] font-mono uppercase ${isMarketOpen ? 'text-bull' : 'text-bear'}`}>
              {isMarketOpen ? 'Market Live' : 'Market Closed'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-primary/50" />
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Secure Node</span>
          </div>
        </div>
        <RiskCalculator />
      </div>
    </header>
  );
};

const HeaderStat = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[8px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>
    <span className={`text-[10px] font-bold uppercase ${color}`}>{value}</span>
  </div>
);