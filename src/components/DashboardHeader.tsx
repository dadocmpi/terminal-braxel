"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiskCalculator } from './RiskCalculator';
import { ShieldCheck, Activity, Cloud, CloudOff } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';

export const DashboardHeader = () => {
  const location = useLocation();
  const { signalsData } = useTrading();
  const isTerminal1 = location.pathname === '/';
  const isTerminal2 = location.pathname === '/analytics';
  
  // Verifica se há conexão com a nuvem (Supabase)
  const isCloudConnected = !!signalsData;

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <header className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-[0.3em] text-white">
                BRAXEL
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10">
                {isCloudConnected ? (
                  <>
                    <Cloud className="w-2.5 h-2.5 text-primary animate-pulse" />
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">Cloud Active</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="w-2.5 h-2.5 text-bear" />
                    <span className="text-[8px] font-black text-bear uppercase tracking-widest">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <nav className="flex items-center gap-1 bg-white/5 p-1 border border-white/5">
            <Link 
              to="/" 
              className={`px-4 py-1.5 flex items-center gap-2 transition-all ${
                isTerminal1 
                ? 'bg-primary text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
            </Link>
            <Link 
              to="/analytics" 
              className={`px-4 py-1.5 flex items-center gap-2 transition-all ${
                isTerminal2 
                ? 'bg-primary text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                : 'text-muted-foreground hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          {isTerminal1 && <RiskCalculator />}
        </div>
      </header>
    </div>
  );
};