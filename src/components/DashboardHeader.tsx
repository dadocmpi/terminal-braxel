import React from 'react';
import { TrendingUp, Bell, Calculator, ChevronDown } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";

export const DashboardHeader = () => {
  const { asset, setAsset, timeframe, setTimeframe, isLoading } = useTrading();

  const assets: Asset[] = ['EURUSD', 'GBPUSD', 'USDCAD', 'XAUUSD', 'USDJPY', 'AUDUSD', 'GBPJPY'];
  const timeframes: Timeframe[] = ['D1', 'H4', 'H1', 'M15', 'M5', 'M1'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary glow-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">BRAXEL MARKETS</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Institutional Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-border/50 font-mono">
                {asset} <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              {assets.map(a => (
                <DropdownMenuItem key={a} onClick={() => setAsset(a)} className="font-mono">
                  {a}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-border/50 font-mono">
                {timeframe} <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              {timeframes.map(t => (
                <DropdownMenuItem key={t} onClick={() => setTimeframe(t)} className="font-mono">
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 rounded-full border border-border/50">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-bull'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live Data</span>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px]">2</Badge>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
            <Calculator className="w-4 h-4" />
            Calculator
          </Button>
        </div>
      </div>
    </header>
  );
};