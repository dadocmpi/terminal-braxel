import React from 'react';
import { Card } from "@/components/ui/card";

export const PerformanceCard = () => {
  const winRate = 68;
  const totalPips = 1240;

  return (
    <Card className="bg-card/50 border-border/50 p-4 flex items-center gap-6">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="stroke-secondary fill-none"
            strokeWidth="3"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="stroke-primary fill-none transition-all duration-1000"
            strokeWidth="3"
            strokeDasharray={`${winRate}, 100`}
            strokeLinecap="round"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-none">{winRate}%</span>
          <span className="text-[8px] text-muted-foreground uppercase">Win Rate</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total P&L</p>
          <p className="text-xl font-mono font-bold text-bull">+{totalPips} <span className="text-xs">pips</span></p>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-bull" />
            <span className="text-[10px] text-muted-foreground">42 Wins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-bear" />
            <span className="text-[10px] text-muted-foreground">18 Losses</span>
          </div>
        </div>
      </div>
    </Card>
  );
};