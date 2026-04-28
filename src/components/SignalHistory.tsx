import React from 'react';
import { useTrading } from '../contexts/TradingContext';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { downloadCSV, getStartOfWeek } from '../utils/csv';

export const SignalHistory = () => {
  const { allAssetsData } = useTrading();
  
  // Coletar sinais ativos de todos os ativos
  const activeSignals = Object.values(allAssetsData)
    .map(data => data.analysis)
    .filter(analysis => analysis && analysis.status === 'ACTIVE')
    .sort((a, b) => b.confidence - a.confidence);

  const handleExport = () => {
    if (activeSignals.length === 0) {
      alert("No active signals to export.");
      return;
    }
    downloadCSV(activeSignals, `braxel-live-signals-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-primary animate-pulse" />
          <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Institutional Signals</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-[10px] gap-2 hover:bg-primary hover:text-black"
          onClick={handleExport}
        >
          <Download className="w-3 h-3" /> Export Live
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/30 border-b border-border/50">
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Time</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Asset</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dir</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Entry</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SL</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">TP1</th>
              <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Conf%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {activeSignals.length > 0 ? activeSignals.map((s, idx) => (
              <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-3 text-[10px] font-mono text-muted-foreground">{s.time}</td>
                <td className="px-6 py-3 font-mono text-xs font-bold">{s.asset}</td>
                <td className="px-6 py-3">
                  <Badge variant="outline" className="text-[8px] border-primary/30 text-primary">
                    {s.type}
                  </Badge>
                </td>
                <td className="px-6 py-3">
                  <Badge className={s.direction === 'BUY' ? 'bg-bull/20 text-bull border-bull/30' : 'bg-bear/20 text-bear border-bear/30'}>
                    {s.direction}
                  </Badge>
                </td>
                <td className="px-6 py-3 text-[10px] font-mono font-bold text-primary">{s.entry.toFixed(5)}</td>
                <td className="px-6 py-3 text-[10px] font-mono text-bear">{s.sl.toFixed(5)}</td>
                <td className="px-6 py-3 text-[10px] font-mono text-bull">{s.tp1.toFixed(5)}</td>
                <td className="px-6 py-3 text-[10px] font-mono">{s.confidence}%</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-[10px] text-muted-foreground italic">
                  Scanning markets for institutional liquidity sweeps...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
