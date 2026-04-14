import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { downloadCSV, getStartOfWeek } from '../utils/csv';

export const SignalHistory = () => {
  const { signalsData } = useTrading();

  const handleExport = () => {
    const startOfWeek = getStartOfWeek();
    const weeklySignals = signalsData.signals.filter(s => new Date(s.time) >= startOfWeek);
    
    if (weeklySignals.length === 0) {
      alert("Nenhum sinal encontrado para esta semana.");
      return;
    }

    downloadCSV(weeklySignals, `braxel-signals-week-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Signal History</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-[10px] gap-2 hover:bg-primary hover:text-black"
          onClick={handleExport}
        >
          <Download className="w-3 h-3" /> Export Weekly CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/30 border-b border-border/50">
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dir</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Zone</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Entry</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">RR</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conf%</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pips</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {signalsData.signals.length > 0 ? signalsData.signals.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-3 text-[10px] font-mono text-muted-foreground">{new Date(s.time).toLocaleTimeString()}</td>
                <td className="px-6 py-3 font-mono text-xs font-bold">{s.asset}</td>
                <td className="px-6 py-3">
                  <Badge className={s.direction === 'BUY' ? 'bg-bull/20 text-bull border-bull/30' : 'bg-bear/20 text-bear border-bear/30'}>
                    {s.direction}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-[10px] font-mono">{s.zone}</td>
                <td className="px-6 py-3 text-[10px] font-mono">{s.entry.toFixed(5)}</td>
                <td className="px-6 py-3 text-[10px] font-mono text-primary">{s.rr}</td>
                <td className="px-6 py-3 text-[10px] font-mono">{s.confidence}%</td>
                <td className="px-6 py-3">
                  <Badge variant="outline" className={s.status === 'WIN' ? 'border-bull text-bull' : s.status === 'LOSS' ? 'border-bear text-bear' : 'border-muted text-muted'}>
                    {s.status}
                  </Badge>
                </td>
                <td className={`px-6 py-3 text-[10px] font-mono font-bold ${s.pips > 0 ? 'text-bull' : 'text-bear'}`}>
                  {s.pips > 0 ? `+${s.pips}` : s.pips}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-30">
                  No signals recorded this week
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};