"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Clock, Globe, Zap } from 'lucide-react';

interface NewsItem {
  time: string;
  impact: 'LOW' | 'MED' | 'HIGH';
  event: string;
  currency: 'EUR' | 'GBP' | 'JPY' | 'USD';
}

export const MarketNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulação de chamada para a "NOSSA API"
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      // Aqui seria o fetch('SUA_API_URL')
      const mockNews: NewsItem[] = [
        { time: '04:00', impact: 'HIGH', event: 'German CPI MoM', currency: 'EUR' },
        { time: '07:00', impact: 'MED', event: 'BoE Gov Bailey Speaks', currency: 'GBP' },
        { time: '09:30', impact: 'HIGH', event: 'ECB Monetary Policy Meeting', currency: 'EUR' },
        { time: '11:00', impact: 'LOW', event: 'Construction Output', currency: 'GBP' },
        { time: '23:50', impact: 'HIGH', event: 'BoJ Monetary Policy Meeting', currency: 'JPY' },
        { time: '08:00', impact: 'MED', event: 'EU Economic Forecasts', currency: 'EUR' },
      ].sort((a, b) => a.time.localeCompare(b.time));

      setNews(mockNews);
      setLoading(false);
    };

    fetchNews();
  }, []);

  const ImpactBars = ({ level }: { level: 'LOW' | 'MED' | 'HIGH' }) => {
    const bars = level === 'HIGH' ? 3 : level === 'MED' ? 2 : 1;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-1 h-3 rounded-none transition-colors ${
              i <= bars 
                ? 'bg-bear shadow-[0_0_5px_rgba(239,68,68,0.5)]' 
                : 'bg-white/5'
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-black border-none h-full flex flex-col rounded-none">
      <div className="terminal-header flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Institutional News Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-bear animate-pulse" />
          <span className="text-[8px] font-mono text-bear uppercase font-bold">Live API</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center opacity-20">
            <Zap className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          news.map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 p-2 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <div className="flex flex-col items-center justify-center min-w-[45px] border-r border-white/5 pr-2">
                <span className="text-[10px] font-mono font-black text-white/80">{item.time}</span>
                <span className="text-[7px] text-muted-foreground uppercase font-bold">GMT</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-primary">{item.currency}</span>
                  <div className="h-2 w-[1px] bg-white/10" />
                  <p className="text-[10px] font-bold text-white/90 truncate uppercase tracking-tight">
                    {item.event}
                  </p>
                </div>
              </div>

              <div className="pl-2 border-l border-white/5">
                <ImpactBars level={item.impact} />
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-1.5 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Filter: EUR/GBP/JPY</span>
        <span className="text-[7px] font-mono text-primary/40">BRAXEL_API_V2</span>
      </div>
    </Card>
  );
};