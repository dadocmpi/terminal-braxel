"use client";

import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { RiskCalculator } from './RiskCalculator';

export const DashboardHeader = () => {
  const location = useLocation();
  const isTerminal1 = location.pathname === '/';
  const isTerminal2 = location.pathname === '/analytics';

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <header className="px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          
          <div className="flex items-center gap-1.5">
            <Link 
              to="/" 
              className={`w-8 h-8 flex items-center justify-center text-[11px] font-black transition-all border ${
                isTerminal1 
                ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                : 'text-muted-foreground border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              1
            </Link>
            <Link 
              to="/analytics" 
              className={`w-8 h-8 flex items-center justify-center text-[11px] font-black transition-all border ${
                isTerminal2 
                ? 'bg-primary text-black border-primary shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                : 'text-muted-foreground border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              2
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          {isTerminal1 && <RiskCalculator />}
        </div>
      </header>
    </div>
  );
};