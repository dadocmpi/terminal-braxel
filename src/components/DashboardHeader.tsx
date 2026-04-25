"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiskCalculator } from './RiskCalculator';
import { ShieldCheck, Activity, Send } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { formatSessionSummary, sendToTelegram } from '../services/telegram';
import { showSuccess, showError } from '../utils/toast';

export const DashboardHeader = () => {
  const location = useLocation();
  const { currentSession, d1Bias, signalsData } = useTrading();
  const isTerminal1 = location.pathname === '/';
  const isTerminal2 = location.pathname === '/analytics';

  const handleTelegramTest = async () => {
    const totalPips = signalsData.signals.reduce((acc, s) => acc + s.pips, 0);
    const msg = formatSessionSummary(currentSession, d1Bias, totalPips);
    
    const success = await sendToTelegram(msg);
    
    if (success) {
      showSuccess("Relatório enviado com sucesso para o Telegram!");
    } else {
      showError("Erro ao enviar para o Telegram. Verifique o console.");
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <header className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-[0.3em] text-white">
                BRAXEL
              </span>
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
          <button 
            onClick={handleTelegramTest}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="Send Telegram Summary"
          >
            <Send className="w-4 h-4" />
          </button>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          {isTerminal1 && <RiskCalculator />}
        </div>
      </header>
    </div>
  );
};