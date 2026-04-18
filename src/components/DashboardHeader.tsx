import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';
import { LayoutDashboard, BarChart3 } from 'lucide-react';

export const DashboardHeader = () => {
  const location = useLocation();
  const isTerminal1 = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Logo />
        
        <nav className="flex items-center gap-1">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${isTerminal1 ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
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
        {isTerminal1 && <RiskCalculator />}
      </div>
    </header>
  );
};