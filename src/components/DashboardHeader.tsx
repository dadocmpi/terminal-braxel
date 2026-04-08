import React from 'react';
import { TrendingUp, Bell, Calculator, ChevronDown, Shield } from 'lucide-react';
import { useTrading } from '../contexts/TradingContext';
import { Asset, Timeframe } from '../types/trading';
import { WorldClocks } from './WorldClocks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const { asset, setAsset, timeframe, setTimeframe, isLoading } = useTrading();

  const assets: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'XAUUSD', 'USDJPY', 'AUDUSD', 'GBPJPY', 'EURGBP'];
  const timeframes: Timeframe[] = ['D1', 'H4', 'H1', 'M15', 'M5', 'M1'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[#0a0d12]/90 backdrop-blur-md px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter leading-none">BRAXEL MARKETS</h1>
            <p className="text-[8px] text-muted-foreground uppercase tracking-[0.3em] mt-0.5">Institutional Terminal v2.4</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-secondary/30 p-0.5 rounded border border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-3 font-mono text-xs hover:bg-secondary">
                {asset} <ChevronDown className="ml-2 w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              {assets.map(a => (
                <DropdownMenuItem key={a} onClick={() => setAsset(a)} className="font-mono text-xs">
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-4 bg-border/50" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-3 font-mono text-xs hover:bg-secondary">
                {timeframe} <ChevronDown className="ml-2 w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              {timeframes.map(t => (
                <DropdownMenuItem key={t} onClick={() => setTimeframe(t)} className="font-mono text-xs">
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <WorldClocks />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-bull/10 rounded border border-bull/20">
            <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull shadow-[0_0_5px_#22c55e]'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest text-bull">Live</span>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </Button>
          
          <Button variant="outline" size="sm" className="h-8 gap-2 border-border/50 text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all">
            <Calculator className="w-3.5 h-3.5" />
            Calculator
          </Button>
        </div>
      </div>
    </header>
  );
};