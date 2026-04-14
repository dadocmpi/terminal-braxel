import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';

const weeklyData = [
  { day: 'MON', date: '--/--', pips: 0, wins: 0, losses: 0, status: 'pending' },
  { day: 'TUE', date: '--/--', pips: 0, wins: 0, losses: 0, status: 'pending' },
  { day: 'WED', date: '--/--', pips: 0, wins: 0, losses: 0, status: 'pending' },
  { day: 'THU', date: '--/--', pips: 0, wins: 0, losses: 0, status: 'pending' },
  { day: 'FRI', date: '--/--', pips: 0, wins: 0, losses: 0, status: 'pending' },
];

export const WeeklyPerformance = () => {
  const totalWins = weeklyData.reduce((acc, curr) => acc + curr.wins, 0);
  const totalLosses = weeklyData.reduce((acc, curr) => acc + curr.losses, 0);
  const winRate = totalWins + totalLosses > 0 ? Math.round((totalWins / (totalWins + totalLosses)) * 100) : 0;

  return (
    <Card className="bg-black border-white/5 rounded-none overflow-hidden">
      <div className="grid grid-cols-12">
        {/* Win Rate Stat */}
        <div className="col-span-12 lg:col-span-3 p-8 border-r border-white/5 bg-[#050505] flex flex-col justify-center">
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">Weekly Win Rate</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black tracking-tighter text-white glow-text-gold">{winRate}%</h2>
            <TrendingUp className="w-6 h-6 text-muted-foreground/20" />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bull/20" />
              <span className="text-[10px] font-mono text-muted-foreground">{totalWins} Wins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bear/20" />
              <span className="text-[10px] font-mono text-muted-foreground">{totalLosses} Losses</span>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="col-span-12 lg:col-span-9 p-0">
          <div className="grid grid-cols-5 h-full">
            {weeklyData.map((item, idx) => (
              <div 
                key={item.day} 
                className={`p-6 border-r border-white/5 last:border-r-0 flex flex-col justify-between transition-colors hover:bg-white/[0.02] ${item.status === 'pending' ? 'opacity-40' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest">{item.day}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/50">{item.date}</span>
                  </div>
                  <div className={`text-lg font-mono font-bold ${item.pips >= 0 ? 'text-bull' : 'text-bear'}`}>
                    {item.pips > 0 ? `+${item.pips}` : item.pips} <span className="text-[10px] opacity-50">pips</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: item.wins }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-bull" />
                    ))}
                    {Array.from({ length: item.losses }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-bear" />
                    ))}
                  </div>
                  {item.status === 'win' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-bull/50" />
                  ) : item.status === 'loss' ? (
                    <XCircle className="w-3.5 h-3.5 text-bear/50" />
                  ) : (
                    <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};