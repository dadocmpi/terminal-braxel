import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { getStartOfWeek } from '../utils/csv';

export const WeeklyPerformance = () => {
  const { signalsData } = useTrading();
  const history = signalsData.signals;
  
  // Filtra o histórico para pegar apenas sinais desta semana (Segunda em diante)
  const startOfWeek = getStartOfWeek();
  const weeklyHistory = history.filter(s => new Date(s.time) >= startOfWeek);

  // Cálculo dinâmico baseado apenas na semana atual
  const totalWins = weeklyHistory.filter(s => s.status === 'WIN').length;
  const totalLosses = weeklyHistory.filter(s => s.status === 'LOSS').length;
  const totalSignals = totalWins + totalLosses;
  const winRate = totalSignals > 0 ? Math.round((totalWins / totalSignals) * 100) : 0;

  // Mapeamento para os dias da semana
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const weeklyStats = days.map(day => {
    const daySignals = weeklyHistory.filter(s => {
      const date = new Date(s.time);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      return dayName === day;
    });

    const dayWins = daySignals.filter(s => s.status === 'WIN').length;
    const dayLosses = daySignals.filter(s => s.status === 'LOSS').length;
    const dayPips = daySignals.reduce((acc, curr) => acc + curr.pips, 0);

    return {
      day,
      pips: dayPips,
      wins: dayWins,
      losses: dayLosses,
      status: daySignals.length === 0 ? 'pending' : dayPips >= 0 ? 'win' : 'loss'
    };
  });

  return (
    <Card className="bg-black border-white/5 rounded-none overflow-hidden">
      <div className="grid grid-cols-12">
        {/* Win Rate Stat */}
        <div className="col-span-12 lg:col-span-3 p-8 border-r border-white/5 bg-[#050505] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Weekly Win Rate</span>
            <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 text-[7px] text-primary font-bold rounded-none">CURRENT WEEK</div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black tracking-tighter text-white glow-text-gold">
              {totalSignals > 0 ? winRate : '--'}%
            </h2>
            <TrendingUp className="w-6 h-6 text-muted-foreground/20" />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bull" />
              <span className="text-[10px] font-mono text-muted-foreground">{totalWins} Wins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-bear" />
              <span className="text-[10px] font-mono text-muted-foreground">{totalLosses} Losses</span>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="col-span-12 lg:col-span-9 p-0">
          <div className="grid grid-cols-5 h-full">
            {weeklyStats.map((item) => (
              <div 
                key={item.day} 
                className={`p-6 border-r border-white/5 last:border-r-0 flex flex-col justify-between transition-colors hover:bg-white/[0.02] ${item.status === 'pending' ? 'opacity-40' : ''}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-muted-foreground tracking-widest">{item.day}</span>
                  </div>
                  <div className={`text-lg font-mono font-bold ${item.pips >= 0 ? 'text-bull' : 'text-bear'}`}>
                    {item.pips > 0 ? `+${item.pips.toFixed(1)}` : item.pips.toFixed(1)} <span className="text-[10px] opacity-50">pips</span>
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