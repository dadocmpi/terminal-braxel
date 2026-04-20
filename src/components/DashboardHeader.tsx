"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';
import { LayoutDashboard, BarChart3, ShieldCheck, Globe } from 'lucide-react';

export const DashboardHeader = () => {
  const location = useLocation();
  const isTerminal1 = location.pathname === '/';

  return (
    <div className="sticky top-0 z-50 w-full bg-black">
      <header className="border-b border-white/10 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          
          <nav className="flex items-center gap-1">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${isTerminal1 ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
            >
              <LayoutDashboard className="w-3 h-3" />
              Terminal 01
            </Link>
            <Link 
              to="/analytics" 
              className={`flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${location.pathname === '/analytics' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white'}`}
            >
              <BarChart3 className="w-3 h-3" />
              Terminal 02
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-4 border-x border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-bull" />
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Secure Node</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Cloud Active</span>
            </div>
          </div>
          {isTerminal1 && <RiskCalculator />}
        </div>
      </header>
    </div>
  );
};